import React, { useState } from "react"
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, TextInput, ScrollView } from "react-native"
import { Picker } from "@react-native-picker/picker"
import { useRouter } from "expo-router"
import { getCountryCodes } from "../../utils/sharedData"

// A more comprehensive list of country codes with flags
const countryCodes = getCountryCodes();

export default function RegistrationForm(props) {
  const router = useRouter()
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    countryCode: "+91",
    age: "",
    gender: "male",
    email: "",
  })
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const errors = {}
    let isValid = true

    if (!form.name) {
      errors.name = "Name is required"
      isValid = false
    }

    if (!form.email) {
      errors.email = "Email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = "Email is invalid"
      isValid = false
    }

    if (!form.age) {
      errors.age = "Age is required"
      isValid = false
    } else if (!/^\d+$/.test(form.age)) {
      errors.age = "Age must be a number"
      isValid = false
    } else if (Number.parseInt(form.age) < 18 || Number.parseInt(form.age) > 100) {
      errors.age = "Age must be between 18 and 100"
      isValid = false
    }

    if (!form.gender) {
      errors.gender = "Gender is required"
      isValid = false
    }

    if (!form.mobile) {
      errors.mobile = "Mobile number is required"
      isValid = false
    }

    setErrors(errors)
    return isValid
  }

  const handleSubmit = () => {
    if (validateForm()) {
      const formData = {
        ...form,
        mobile: form.mobile,
      }
      props.onSubmit(formData)
    }
  }

return (
  <SafeAreaView style={styles.container}>
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.header}>
        <Text style={styles.title}>{props.title}</Text>
        <Text style={styles.subtitle}>Create an account to continue</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.input}>
          <Text style={styles.inputLabel}>Full name</Text>
          <TextInput
            onChangeText={(name) => setForm({ ...form, name })}
            placeholder="Name"
            placeholderTextColor="#6b7280"
            style={styles.inputControl}
            value={form.name}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        <View style={styles.input}>
          <Text style={styles.inputLabel}>Email address</Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            onChangeText={(email) => setForm({ ...form, email })}
            placeholder="abc@example.com"
            placeholderTextColor="#6b7280"
            style={styles.inputControl}
            value={form.email}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        <View style={styles.input}>
          <Text style={styles.inputLabel}>Age</Text>
          <TextInput
            onChangeText={(age) => setForm({ ...form, age })}
            placeholder="Enter Age"
            placeholderTextColor="#6b7280"
            style={styles.inputControl}
            keyboardType="numeric"
            value={form.age}
          />
          {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}
        </View>

        <View style={styles.input}>
          <Text style={styles.inputLabel}>Gender</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={form.gender}
              onValueChange={(itemValue) => setForm({ ...form, gender: itemValue })}
              style={styles.picker}
            >
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
              <Picker.Item label="Prefer not to say" value="preferNotToSay" />
            </Picker>
          </View>
          {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
        </View>

        <View style={styles.input}>
          <Text style={styles.inputLabel}>Mobile number</Text>

          {/* Country Code Picker */}
          <View style={styles.countryCodeContainer}>
            <Picker
              selectedValue={form.countryCode}
              onValueChange={(itemValue) => setForm({ ...form, countryCode: itemValue })}
              style={styles.countryCodePicker}
            >
              {countryCodes.map((country) => (
                <Picker.Item key={country.code} label={`${country.flag} ${country.code}`} value={country.code} />
              ))}
            </Picker>
          </View>

          {/* Phone Number Input */}
          <TextInput
            style={styles.phoneInput}
            value={form.mobile}
            onChangeText={(mobile) => setForm({ ...form, mobile })}
            keyboardType="phone-pad"
            placeholder="Enter phone number"
            placeholderTextColor="#6b7280"
          />

          {errors.mobile && <Text style={styles.errorText}>{errors.mobile}</Text>}
        </View>

        <View style={styles.formAction}>
          <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
            <Text style={styles.btnText}>{props.button}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          <Text style={styles.formFooter}>
            <Text style={styles.underline}>Help?</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </SafeAreaView>
)}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8E7E8",
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingVertical: 24,
  },
  header: {
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#111827",
  },
  subtitle: {
    fontSize: 18,
    color: "#6b7280",
    marginTop: 8,
  },
  form: {
    paddingHorizontal: 24,
  },
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    color: "#374151",
    marginBottom: 4,
  },
  inputControl: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderColor: "#d1d5db",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: "#111827",
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderColor: "#d1d5db",
    borderWidth: 1,
    overflow: "hidden",
  },
  picker: {
    height: 44,
    fontSize: 16, // Ensure the font size is readable
  },
  phoneInputContainer: {
    flexDirection: "column", // Change to column for vertical layout
    alignItems: "stretch",
  },
  countryCodeContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderColor: "#d1d5db",
    borderWidth: 1,
    marginBottom: 8, // Add margin to separate from the phone input
    overflow: "hidden",
    height: 50, // Match the height of the picker
    width: 150,
  },
  countryCodePicker: {
    height: 44,
    fontSize: 16, // Ensure the font size is readable
  },
  phoneInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderColor: "#d1d5db",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: "#111827",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 4,
  },
  formAction: {
    marginTop: 24,
  },
  btn: {
    backgroundColor: "#FFD1DC",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  btnText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  formFooter: {
    marginTop: 24,
    textAlign: "center",
    color: "#3b82f6",
    fontSize: 16,
  },
  underline: {
    textDecorationLine: "underline",
  },
})

//test