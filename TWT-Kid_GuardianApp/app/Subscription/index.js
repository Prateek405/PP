"use client"

import { useState, useEffect, useCallback } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
} from "react-native"
import axios from "axios"
import RazorpayCheckout from "react-native-razorpay"
import { OCP_APIM_SUBSCRIPTION_KEY } from "@env"
import { getDeviceID } from "../../utils/sharedData"

const App = () => {
  const [deviceId, setDeviceId] = useState("")
  const [selectedPlan, setSelectedPlan] = useState("")
  const [remainingDays, setRemainingDays] = useState(0)
  const [expiryDate, setExpiryDate] = useState(null)
  const [benefits, setBenefits] = useState([])
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("") // Fetched from the database
  const [contact, setContact] = useState("") // Fetched from the database
  const [activeSubscription, setActiveSubscription] = useState(null)

  const subscriptionKey = OCP_APIM_SUBSCRIPTION_KEY;

  const plans = [
    { title: "1 Month", price: 99, savings: 0, planId: "plan_PsKJglEJR7Cxdl" },
    { title: "3 Months", price: 349, savings: 248, planId: "plan_2" },
    { title: "6 Months", price: 599, savings: 595, planId: "plan_3" },
    { title: "1 Year", price: 999, savings: 1389, planId: "plan_4" },
  ]

  useEffect(() => {
    const fetchDeviceID = async () => {
      try {
        const d = await getDeviceID()
        const id = d
        if (id) {
          setDeviceId(id)
        } else {
          Alert.alert("Error", "Failed to retrieve device ID.")
        }
      } catch (error) {
        console.error("Error fetching device ID:", error)
        Alert.alert("Error", "Failed to retrieve device ID.")
      }
    }
    fetchDeviceID()
  }, [])

  useEffect(() => {
    const fetchUserDetailsAndSubscription = async () => {
      if (!deviceId) return

      try {
        const userDetailsUrl = "https://tw-central-apim.azure-api.net/user-service-twt/getUserDetails"
        const userResponse = await fetchApi(userDetailsUrl, { deviceId })
        const { email: userEmail, mobile: userContact } = userResponse
        setEmail(userEmail)
        setContact(userContact)

        const subscriptionUrl = "https://tw-central-apim.azure-api.net/user-service-twt/getActiveSubscription"
        const subscriptionResponse = await fetchApi(subscriptionUrl, { deviceId })
        if (subscriptionResponse.subscription) {
          setActiveSubscription(subscriptionResponse.subscription)
        }
      } catch (error) {
        console.error("Error fetching user details and subscription:", error)
        Alert.alert("Error", "Failed to fetch user details and subscription.")
      }
    }

    fetchUserDetailsAndSubscription()
  }, [deviceId])

   // Fetch Expiry Date from API
  const fetchExpiryDate = useCallback(async () => {
    if (!deviceId) return;
    setLoading(true);
    try {
      const orderUrl = "https://tw-central-apim.azure-api.net/user-service-twt/get-expiry-date";
        console.log("Fetching expiry date from:", orderUrl);

        const response = await fetch(orderUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Ocp-Apim-Subscription-Key": subscriptionKey,
            },
            body: JSON.stringify({ deviceId }) // Ensure the body is correctly formatted
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

      const data = await response.json();
      console.log("Expiry Date Response:", data);
     
       if (!data || !("expiryDate" in data) || data.expiryDate === null) {
            console.warn("Expiry date is missing or null.");
            setRemainingDays(0);
            setExpiryDate("Not available");
            return;
        }

        const expiryDateObj = new Date(data.expiryDate);
        const currentDate = new Date();
        const timeDifference = expiryDateObj.getTime() - currentDate.getTime();
        const remainingDays = Math.ceil(timeDifference / (1000 * 3600 * 24));

        setExpiryDate(expiryDateObj.toISOString().split("T")[0]);
        setRemainingDays(remainingDays);
    } catch (error) {
        console.error("Error fetching expiry date:", error.message);
        Alert.alert("Error", "Failed to fetch expiry date.");
    } finally {
        setLoading(false);
    }
}, [deviceId]);

  useEffect(() => {
    fetchExpiryDate()
  }, [fetchExpiryDate])

  useEffect(() => {
    setBenefits([
      "Store Audio & Video on cloud for 30 days",
      "Use feature of Geo-fencing",
      "Store Location for up to 30 days",
    ])
  }, [])

  const handlePayment = async () => {
    if (!deviceId) {
      Alert.alert("Error", "Device ID not available.")
      return
    }

    if (!selectedPlan) {
      Alert.alert("Error", "Please select a subscription plan.")
      return
    }

    setLoading(true)
    try {
      const selectedPlanData = plans.find((plan) => plan.title === selectedPlan)
      const orderUrl = "https://tw-central-apim.azure-api.net/user-service-twt/createSubscription"
      const requestData = {
        planId: selectedPlanData.planId,
        userId: deviceId,
      }
      const { data } = await axios.post(orderUrl, requestData, {
        headers: {
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": subscriptionKey,
        },
      })

      console.log("Backend Response:", data)

      if (!data || !data.subscriptionId) {
        throw new Error("Invalid response from backend: Missing subscriptionId")
      }

      console.log("Subscription ID received:", data.subscriptionId)

      initPayment(data.subscriptionId, selectedPlanData, email, contact)

      // Refresh subscription details after successful payment
      const subscriptionUrl = "https://tw-central-apim.azure-api.net/user-service-twt/getActiveSubscription"
      const subscriptionResponse = await fetchApi(subscriptionUrl, { deviceId })
      console.log("Active Subscription Response:", subscriptionResponse);
      if (subscriptionResponse.subscription) {
        setActiveSubscription(subscriptionResponse.subscription)
      }

      // Refresh expiry date
      await fetchExpiryDate()
    } catch (error) {
      console.error("Error during payment:", error)
      Alert.alert("Error", "Failed to process payment.")
    } finally {
      setLoading(false)
    }
  }

  const initPayment = (subscriptionId, selectedPlanData) => {
    console.log("Initiating Razorpay Payment for Subscription:", subscriptionId)

    if (!RazorpayCheckout) {
      console.error("Error: RazorpayCheckout is null. Ensure Razorpay is correctly installed.")
      Alert.alert("Payment Error", "Razorpay SDK not initialized properly.")
      return
    }

    const options = {
      key: "rzp_test_rdNX8CbJc3598j",
      subscription_id: subscriptionId,
      name: "Smartwatch Mobile",
      description: "Auto-Renewable Subscription",
      theme: {
        color: "#4A90E2",
      },
      prefill: { email, contact },
    }

    RazorpayCheckout.open(options)
      .then(async (response) => {
        console.log("Payment Success:", response)

        console.log("Device ID:", deviceId)
        console.log("Selected Plan Data:", selectedPlanData)
        console.log("Email:", email)
        console.log("Contact:", contact)

        if (!deviceId || !selectedPlanData || !selectedPlanData.planId || !selectedPlanData.title) {
          console.error("Error: Missing required data for storing subscription.")
          Alert.alert("Error", "Missing required data for storing subscription.")
          return
        }

        const requestBody = {
          subscriptionId: subscriptionId,
          deviceId: deviceId,
          planId: selectedPlanData.planId,
          planName: selectedPlanData.title,
          razorpayOrderId: response.razorpay_subscription_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
          email: email,
          contact: contact,
        }

        console.log("Storing subscription with data:", requestBody)

        try {
          const storeUrl = "https://tw-central-apim.azure-api.net/user-service-twt/store-subscription"
          const res = await axios.post(storeUrl, requestBody, {
            headers: {
              "Content-Type": "application/json",
              "Ocp-Apim-Subscription-Key": subscriptionKey,
            },
          })

          console.log("Subscription stored successfully:", res.data)
          Alert.alert("Success", "Subscription stored successfully!")
        } catch (error) {
          console.error("Error storing subscription:", error.response ? error.response.data : error.message)
          Alert.alert("Error", "Failed to store subscription.")
        }
      })
      .catch((error) => {
        console.error("Razorpay Payment Failed:", error)
        Alert.alert("Payment Failed", error.description || "An error occurred")
      })
  }

  const cancelSubscription = async () => {
    if (!activeSubscription) {
      Alert.alert("Error", "No active subscription found.")
      return
    }

    try {
      const cancelUrl = "https://tw-central-apim.azure-api.net/user-service-twt/cancelSubscription"
      await fetchApi(cancelUrl, { subscriptionId: activeSubscription.id })

      // Refresh subscription details
      const subscriptionUrl = "https://tw-central-apim.azure-api.net/user-service-twt/getActiveSubscription"
      const subscriptionResponse = await fetchApi(subscriptionUrl, { deviceId })
      if (subscriptionResponse.subscription) {
        setActiveSubscription(subscriptionResponse.subscription)
      } else {
        setActiveSubscription(null)
      }

      // Refresh expiry date
      await fetchExpiryDate()

      Alert.alert(
        "Success",
        "Your subscription has been cancelled successfully. You will still have access to the subscription until the expiry date.",
      )
    } catch (error) {
      console.error("Error cancelling subscription:", error)
      Alert.alert("Error", "Failed to cancel subscription.")
    }
  }

  const fetchApi = async (url, body) => {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": subscriptionKey,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    return response.json()
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Subscription Manager</Text>
        </View>

        {/* Subscription Status */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Subscription Status</Text>
          <View style={styles.statusContainer}>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Remaining Days</Text>
              <Text style={styles.statusValue}>{loading ? "Loading..." : remainingDays}</Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Expiry Date</Text>
              <Text style={styles.statusValue}>{expiryDate}</Text>
            </View>
          </View>
        </View>

        {/* Benefits */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Benefits</Text>
          {benefits.map((benefit, index) => (
            <Text key={index} style={styles.benefitText}>
              • {benefit}
            </Text>
          ))}
        </View>

        {/* My Subscriptions */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>My Subscriptions</Text>
          {activeSubscription ? (
            <>
              <Text style={styles.subscriptionDetail}>Plan: {activeSubscription.planName}</Text>
              <Text style={styles.subscriptionDetail}>Status: {activeSubscription.status}</Text>
              <Text style={styles.subscriptionDetail}>
                Expiry Date: {moment(activeSubscription.expiryDate).format("MMMM DD, YYYY")}
              </Text>
              {activeSubscription.status === "Active" && (
                <TouchableOpacity style={styles.cancelButton} onPress={cancelSubscription}>
                  <Text style={styles.cancelButtonText}>Cancel Subscription</Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <Text style={styles.subscriptionDetail}>No active subscription</Text>
          )}
        </View>

        {/* Subscription Plans */}
        <Text style={styles.sectionTitle}>Choose Your Plan</Text>
        <View style={styles.cardContainer}>
          {plans.map((plan) => (
            <TouchableOpacity
              key={plan.planId}
              style={[styles.card, selectedPlan === plan.title && styles.selectedCard]}
              onPress={() => setSelectedPlan(plan.title)}
            >
              <Text style={styles.cardTitle}>{plan.title}</Text>
              <Text style={styles.cardPrice}>₹{plan.price}</Text>
              {plan.savings > 0 && <Text style={styles.cardSavings}>Save ₹{plan.savings}</Text>}
            </TouchableOpacity>
          ))}
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handlePayment} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.submitButtonText}>Subscribe Now</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8E7E8",
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statusItem: {
    alignItems: "center",
  },
  statusLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  statusValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 5,
  },
  benefitText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 10,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  card: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCard: {
    backgroundColor: "#e1c6c7",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  cardPrice: {
    fontSize: 14,
    color: "#4A90E2",
    marginBottom: 5,
  },
  cardSavings: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#4A90E2",
    borderRadius: 5,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#FF4D4D",
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 10,
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  subscriptionDetail: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
})

export default App