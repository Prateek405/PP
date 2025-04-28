import { GoogleSignin } from '@react-native-google-signin/google-signin';
import RNFS from 'react-native-fs';
import axios from 'axios';
import { Platform } from 'react-native';

// Initialize Google Sign-In
export const initGoogleSignIn = (webClientId) => {
  GoogleSignin.configure({
    scopes: [
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/drive.appdata',
      'https://www.googleapis.com/auth/drive.metadata.readonly', // Add this scope
    ],
    webClientId: webClientId,
    offlineAccess: true,
    forceCodeForRefreshToken: true, // Add this to ensure refresh token
    hostedDomain: '', // Set to empty string for any domain
    androidClientId: Platform.OS === 'android' ? webClientId : undefined, // Add androidClientId for Android
  });
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const userInfo = await GoogleSignin.signIn();
    const tokens = await GoogleSignin.getTokens();
    return {
      user: userInfo.user,
      accessToken: tokens.accessToken,
    };
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
};

// Sign out from Google
export const signOutFromGoogle = async () => {
  try {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
    return true;
  } catch (error) {
    throw error;
  }
};

// Check if user is signed in
export const isSignedInToGoogle = async () => {
  try {
    return await GoogleSignin.isSignedIn();
  } catch (error) {
    return false;
  }
};

// Get current user info
export const getCurrentUser = async () => {
  try {
    const userInfo = await GoogleSignin.getCurrentUser();
    return userInfo;
  } catch (error) {
    return null;
  }
};

// Refresh access token if needed
export const refreshAccessToken = async () => {
  try {
    const tokens = await GoogleSignin.getTokens();
    return tokens.accessToken;
  } catch (error) {
    throw error;
  }
};

// Get Google Drive storage info
export const getDriveStorageInfo = async (accessToken) => {
  try {
    const response = await axios.get(
      'https://www.googleapis.com/drive/v3/about',
      {
        params: {
          fields: 'storageQuota,user',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    
    const { storageQuota, user } = response.data;
    
    // Convert bytes to GB for better readability
    const usedGB = (storageQuota.usage / (1024 * 1024 * 1024)).toFixed(2);
    const totalGB = (storageQuota.limit / (1024 * 1024 * 1024)).toFixed(2);
    const availableGB = (storageQuota.limit - storageQuota.usage) / (1024 * 1024 * 1024).toFixed(2);
    
    // Calculate percentage used
    const percentUsed = ((storageQuota.usage / storageQuota.limit) * 100).toFixed(0);
    
    return {
      totalStorage: `${totalGB} GB`,
      usedStorage: `${usedGB} GB`,
      availableStorage: `${availableGB} GB`,
      percentUsed: parseInt(percentUsed),
      email: user.emailAddress,
      lastSynced: new Date().toLocaleString(),
    };
  } catch (error) {
    throw error;
  }
};

// Upload file to Google Drive
export const uploadFileToDrive = async (accessToken, filePath, fileName, mimeType, folderId = null) => {
  try {
    // Step 1: Get a resumable upload URL
    const initResponse = await axios({
      method: 'POST',
      url: 'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      data: {
        name: fileName,
        mimeType: mimeType,
        parents: folderId ? [folderId] : null,
      },
    });

    const uploadUrl = initResponse.headers.location;

    // Step 2: Read the file content
    const fileContent = await RNFS.readFile(filePath, 'base64');
    
    // Step 3: Upload the file content
    const uploadResponse = await axios({
      method: 'PUT',
      url: uploadUrl,
      headers: {
        'Content-Type': mimeType,
        'Content-Length': fileContent.length,
      },
      data: fileContent,
    });

    return uploadResponse.data;
  } catch (error) {
    throw error;
  }
};

// Download file from Google Drive
export const downloadFileFromDrive = async (accessToken, fileId, destinationPath) => {
  try {
    // Step 1: Get the file metadata
    const fileMetadataResponse = await axios({
      method: 'GET',
      url: `https://www.googleapis.com/drive/v3/files/${fileId}?fields=name`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    const { name } = fileMetadataResponse.data;
    const fullPath = `${destinationPath}/${name}`;
    
    // Step 2: Download the file content
    const downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
    
    const downloadResponse = await RNFS.downloadFile({
      fromUrl: downloadUrl,
      toFile: fullPath,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).promise;

    if (downloadResponse.statusCode === 200) {
      return { success: true, path: fullPath };
    } else {
      throw new Error('Download failed');
    }
  } catch (error) {
    throw error;
  }
};

// Create a folder in Google Drive
export const createFolder = async (accessToken, folderName, parentFolderId = null) => {
  try {
    const response = await axios({
      method: 'POST',
      url: 'https://www.googleapis.com/drive/v3/files',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      data: {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: parentFolderId ? [parentFolderId] : null,
      },
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// List files in Google Drive (with optional folder filter)
export const listFiles = async (accessToken, folderId = null, pageSize = 20) => {
  try {
    let query = '';
    if (folderId) {
      query = `'${folderId}' in parents`;
    }
    
    const response = await axios({
      method: 'GET',
      url: 'https://www.googleapis.com/drive/v3/files',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        q: query,
        pageSize: pageSize,
        fields: 'files(id, name, mimeType, size, createdTime, thumbnailLink)',
      },
    });
    
    return response.data.files;
  } catch (error) {
    throw error;
  }
};

// Delete a file from Google Drive
export const deleteFile = async (accessToken, fileId) => {
  try {
    await axios({
      method: 'DELETE',
      url: `https://www.googleapis.com/drive/v3/files/${fileId}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    return true;
  } catch (error) {
    throw error;
  }
};
