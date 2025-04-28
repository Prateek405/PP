import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import FeatherIcon from "react-native-vector-icons/Feather";
import LinearGradient from "react-native-linear-gradient";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  initGoogleSignIn, 
  signInWithGoogle, 
  signOutFromGoogle, 
  isSignedInToGoogle,
  getDriveStorageInfo,
  getCurrentUser,
  refreshAccessToken
} from '../../utils/googleDriveAPI';
import { GOOGLE_WEB_CLIENT_ID } from '@env';

const StorageSettingScreen = () => {
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [driveInfo, setDriveInfo] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Initialize Google Sign-In
    initGoogleSignIn(GOOGLE_WEB_CLIENT_ID);
    
    // Check if user has already connected to Google Drive
    checkGoogleDriveConnection();
  }, []);

  const checkGoogleDriveConnection = async () => {
    try {
      setLoading(true);
      const isSignedIn = await isSignedInToGoogle();
      
      if (isSignedIn) {
        // Get current user and refresh token
        const userInfo = await getCurrentUser();
        setUser(userInfo?.user || null);
        
        // Get fresh access token
        const accessToken = await refreshAccessToken();
        
        if (accessToken) {
          setConnected(true);
          fetchGoogleDriveInfo(accessToken);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error('Error checking Google Drive connection:', error);
      setLoading(false);
    }
  };

  const connectGoogleDrive = async () => {
    setLoading(true);
    try {
      const { user, accessToken } = await signInWithGoogle();
      
      if (user && accessToken) {
        setUser(user);
        setConnected(true);
        await fetchGoogleDriveInfo(accessToken);
        
        // Store user info in AsyncStorage
        await AsyncStorage.setItem('googleDriveUser', JSON.stringify(user));
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error connecting to Google Drive:', error);
      
      // More descriptive error handling
      let errorMessage = 'Failed to connect to Google Drive. Please try again.';
      
      if (error.code === 'DEVELOPER_ERROR') {
        errorMessage = 'Google Sign-In configuration error. Please verify your Google Cloud Console setup and app credentials.';
      } else if (error.code === 'SIGN_IN_CANCELLED') {
        errorMessage = 'Sign-in was cancelled.';
      } else if (error.response && error.response.status === 403) {
        errorMessage = 'Access to Google Drive is forbidden. Please check your permissions and OAuth setup.';
      }
      
      Alert.alert('Error', errorMessage);
      setLoading(false);
    }
  };

  const fetchGoogleDriveInfo = async (accessToken) => {
    setRefreshing(true);
    try {
      const driveInfoData = await getDriveStorageInfo(accessToken);
      setDriveInfo(driveInfoData);
      setRefreshing(false);
    } catch (error) {
      console.error('Error fetching Google Drive info:', error);
      Alert.alert('Error', 'Failed to fetch Google Drive information.');
      setRefreshing(false);
    }
  };

  const disconnectGoogleDrive = async () => {
    try {
      Alert.alert(
        'Disconnect Google Drive',
        'Are you sure you want to disconnect from Google Drive? This will remove access to your stored files.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Disconnect', 
            style: 'destructive',
            onPress: async () => {
              setLoading(true);
              try {
                // Sign out from Google
                await signOutFromGoogle();
                
                // Clear local storage
                await AsyncStorage.removeItem('googleDriveUser');
                
                // Update state
                setConnected(false);
                setUser(null);
                setDriveInfo(null);
                
                Alert.alert('Success', 'Successfully disconnected from Google Drive.');
              } catch (error) {
                console.error('Error during disconnect:', error);
                Alert.alert('Error', 'Failed to disconnect from Google Drive.');
              } finally {
                setLoading(false);
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error disconnecting from Google Drive:', error);
      Alert.alert('Error', 'Failed to disconnect from Google Drive.');
    }
  };

  const refreshDriveInfo = async () => {
    if (connected) {
      try {
        const accessToken = await refreshAccessToken();
        if (accessToken) {
          fetchGoogleDriveInfo(accessToken);
        }
      } catch (error) {
        console.error('Error refreshing drive info:', error);
      }
    }
  };

  return (
    <LinearGradient
      colors={["#F8E6E6", "#FFBFD4", "#F8E6E6"]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Storage Settings</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <FeatherIcon name="cloud" size={24} color="#FF85A2" />
            <Text style={styles.sectionTitle}>Google Drive Integration</Text>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FF85A2" />
              <Text style={styles.loadingText}>Processing your request...</Text>
            </View>
          ) : connected ? (
            <View>
              <View style={styles.connectedInfo}>
                <View style={styles.accountRow}>
                  <Image 
                    source={require('../../asset/icon/google-drive.svg')}
                    style={styles.driveIcon}
                  />
                  <View>
                    <Text style={styles.connectedText}>Connected to Google Drive</Text>
                    <Text style={styles.emailText}>{user?.email || driveInfo?.email}</Text>
                  </View>
                </View>
                
                {refreshing ? (
                  <ActivityIndicator size="small" color="#FF85A2" />
                ) : (
                  <TouchableOpacity onPress={refreshDriveInfo} style={styles.refreshButton}>
                    <FeatherIcon name="refresh-cw" size={18} color="#FF85A2" />
                  </TouchableOpacity>
                )}
              </View>

              {driveInfo && (
                <View style={styles.storageInfoContainer}>
                  <Text style={styles.infoLabel}>Storage Information</Text>
                  
                  <View style={styles.storageBar}>
                    <View 
                      style={[
                        styles.usedStorage, 
                        {width: `${driveInfo.percentUsed}%`}
                      ]} 
                    />
                  </View>
                  
                  <View style={styles.storageDetails}>
                    <Text style={styles.storageText}>
                      Used: <Text style={styles.storageValue}>
                        {parseFloat(driveInfo.usedStorage).toFixed(2)}
                      </Text>
                    </Text>
                    <Text style={styles.storageText}>
                      Available: <Text style={styles.storageValue}>
                        {parseFloat(driveInfo.availableStorage).toFixed(2)}
                      </Text>
                    </Text>
                    <Text style={styles.storageText}>
                      Total: <Text style={styles.storageValue}>{driveInfo.totalStorage}</Text>
                    </Text>
                  </View>
                  
                  <Text style={styles.lastSyncText}>
                    Last synced: {driveInfo.lastSynced}
                  </Text>
                </View>
              )}

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={disconnectGoogleDrive}
                  style={styles.disconnectButton}
                >
                  <Text style={styles.disconnectButtonText}>Disconnect from Google Drive</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View>
              <Text style={styles.description}>
                Connect to Google Drive to back up your data and access it across devices.
              </Text>
              
              <View style={styles.permissionsContainer}>
                <Text style={styles.permissionsTitle}>App will request permissions to:</Text>
                <View style={styles.permissionItem}>
                  <FeatherIcon name="check" size={16} color="#FF85A2" />
                  <Text style={styles.permissionText}>Create and edit files in your Google Drive</Text>
                </View>
                <View style={styles.permissionItem}>
                  <FeatherIcon name="check" size={16} color="#FF85A2" />
                  <Text style={styles.permissionText}>View and manage app-specific data</Text>
                </View>
                <View style={styles.permissionItem}>
                  <FeatherIcon name="check" size={16} color="#FF85A2" />
                  <Text style={styles.permissionText}>Delete files created by this app</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={connectGoogleDrive}
                style={styles.connectButton}
              >
                <FeatherIcon name="link" size={18} color="#FFFFFF" style={styles.buttonIcon} />
                <Text style={styles.connectButtonText}>Connect to Google Drive</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {connected && (
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <FeatherIcon name="settings" size={24} color="#FF85A2" />
              <Text style={styles.sectionTitle}>Backup Settings</Text>
            </View>

            <TouchableOpacity style={styles.syncButton}>
              <FeatherIcon name="upload-cloud" size={18} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.syncButtonText}>Backup Now</Text>
            </TouchableOpacity>

            <View style={styles.preferenceItem}>
              <Text style={styles.preferenceLabel}>Auto-backup Frequency</Text>
              <Text style={styles.preferenceValue}>Daily</Text>
            </View>

            <View style={styles.preferenceItem}>
              <Text style={styles.preferenceLabel}>Include Media in Backup</Text>
              <Text style={styles.preferenceValue}>Yes</Text>
            </View>

            <View style={styles.preferenceItem}>
              <Text style={styles.preferenceLabel}>Backup over Wi-Fi only</Text>
              <Text style={styles.preferenceValue}>Yes</Text>
            </View>

            <Text style={styles.note}>
              Note: Storage settings can be modified anytime. Your data remains on your device even when not connected to cloud storage.
            </Text>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 16,
    lineHeight: 20,
  },
  permissionsContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  permissionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  permissionText: {
    fontSize: 13,
    color: '#555',
    marginLeft: 8,
  },
  connectButton: {
    backgroundColor: '#FF85A2',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  syncButton: {
    backgroundColor: '#FF85A2',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
  connectButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  syncButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#555',
  },
  connectedInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driveIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  connectedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  emailText: {
    fontSize: 14,
    color: '#666',
  },
  refreshButton: {
    padding: 8,
  },
  storageInfoContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  storageBar: {
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    marginBottom: 12,
    overflow: 'hidden',
  },
  usedStorage: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#FF85A2',
    borderRadius: 6,
  },
  storageDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  storageText: {
    fontSize: 13,
    color: '#666',
  },
  storageValue: {
    fontWeight: '600',
    color: '#333',
  },
  lastSyncText: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    fontStyle: 'italic',
  },
  buttonContainer: {
    marginTop: 12,
  },
  disconnectButton: {
    borderWidth: 1,
    borderColor: '#FF85A2',
    borderRadius: 8,
    padding: 12,
  },
  disconnectButtonText: {
    color: '#FF85A2',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  preferenceLabel: {
    fontSize: 14,
    color: '#333',
  },
  preferenceValue: {
    fontSize: 14,
    color: '#FF85A2',
    fontWeight: '600',
  },
  note: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 12,
    lineHeight: 16,
  },
});

export default StorageSettingScreen;
