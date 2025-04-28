# Trustedwear Tech Kids Guardian Application

A React Native mobile application for smartwatch integration, safety monitoring, and parental controls.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
  - [Environment Variables](#environment-variables)
  - [Google Drive Integration](#google-drive-integration)
- [Running the App](#running-the-app)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [Advanced Configuration](#advanced-configuration)
- [Contributing](#contributing)

## Introduction

The Trustedwear Tech Kids Guardian App is designed to work with compatible smartwatches to provide parents with monitoring capabilities while giving children an age-appropriate interface. The app uses React Native with Expo Router for seamless navigation between screens.

## Features

- **Profile Management**: Create and manage guardian and child profiles
- **Location Tracking**: Real-time location monitoring of connected smartwatches
- **Contact Management**: Control approved contacts for communication
- **Health Monitoring**: Track activity, sleep, and health metrics
- **Google Drive Integration**: Back up and sync app data to Google Drive
- **Storage Management**: Control what data is stored and where
- **SOS Alerts**: Emergency notification system with nominated contacts
- **Bluetooth Configuration**: Easy pairing with compatible devices

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or newer)
- [npm](https://www.npmjs.com/) (v6 or newer) or [Yarn](https://yarnpkg.com/) (v1.22 or newer)
- [React Native CLI](https://reactnative.dev/docs/environment-setup)
- [Android Studio](https://developer.android.com/studio) (for Android development)
- [Xcode](https://developer.apple.com/xcode/) (for iOS development, Mac only)
- [Git](https://git-scm.com/)

## Installation

Follow these steps to get your development environment set up:

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/trustedwear-tech-guardian.git
   cd /D:/WWW/Trustedwear-Tech/Smartwatch-Mobile/TWT-Kid_GuardianApp
   ```

2. **Install dependencies**

   ```bash
   # Using npm
   npm install

   # Or using Yarn
   yarn install
   ```

3. **Install pods (iOS only)**

   ```bash
   cd ios
   pod install
   cd ..
   ```

## Configuration

### Environment Variables

1. Create a `.env` file in the root directory of the project:

   ```bash
   touch .env
   ```

2. Add the following variables to the `.env` file:

   ```
   OCP_APIM_SUBSCRIPTION_KEY=YOUR_API_KEY_HERE
   GOOGLE_WEB_CLIENT_ID=YOUR_GOOGLE_WEB_CLIENT_ID_HERE
   ```

### Google Drive Integration

To set up Google Drive integration:

1. **Create a Google Cloud Platform project**
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one - Trustedwear-Tech
   - Enable the Google Drive API for your project - [Google Drive API](https://console.cloud.google.com/apis/library/drive.googleapis.com)

2. **Configure OAuth consent screen**
   - Navigate to APIs & Services > OAuth consent screen - TWT-Kid_GuardianApp
   - Select the appropriate user type (External or Internal) - External
   - Enter required application information
   - Add scopes: `.../auth/drive.file` and `.../auth/drive.appdata`
   - Add test users if using External user type

3. **Create credentials**
   - Navigate to APIs & Services > Credentials
   - Click Create credentials > OAuth client ID
   - Application type: Web application for configuration
   - Add authorized redirect URIs: `com.trustedweartech.GuardianApp:/oauth2redirect`
   - Copy the generated Web client ID

4. **Configure Android signing**
   - For Android, you need to add the SHA-1 fingerprint to your credentials
   - Generate signing certificate fingerprint:
     ```bash
     cd android && ./gradlew signingReport
     ```
   - Copy the SHA-1 fingerprint and add it to your OAuth client in Google Cloud Console

5. **Update .env file**
   - Replace `YOUR_GOOGLE_WEB_CLIENT_ID_HERE` with your actual Web client ID in the `.env` file

## Google Drive Integration Setup

To install and configure Google Drive integration:

1. **Add required dependencies**:
   ```bash
   npm install @react-native-google-signin/google-signin react-native-fs
   # or with yarn
   yarn add @react-native-google-signin/google-signin react-native-fs
   ```

2. **Configure Android build files**:
   - Ensure the debug.keystore is located in `/android/app/debug.keystore`
   - Get SHA-1 fingerprint:
     ```
     cd android && ./gradlew signingReport
     ```
   - Add this fingerprint in Google Cloud Console under Credentials

3. **Create icon asset**:
   - Download or create a Google Drive icon
   - Save it to `/asset/icon/google-drive.png`

## Troubleshooting Drive Integration

- **SVG Loading Issues**: 
  If you encounter problems with SVG images, replace with PNG files
  
- **Google Sign-In Errors**:
  - Verify your SHA-1 fingerprint matches the one in Google Cloud Console
  - Ensure your GOOGLE_WEB_CLIENT_ID is correct in .env file
  - Try revoking Google Drive permissions and signing in again

- **Unable to fetch storage info**:
  - Check network connectivity
  - Verify access token hasn't expired (automatic refresh should handle this)
  - Ensure the Drive API is enabled in Google Cloud Console

## Running the App

### For Android:

## Troubleshooting

### Missing Keystore Error

If you encounter a "Missing keystore" error when running `./gradlew signingReport`:

#### Option 1: Create the debug keystore using our script

## Run this script before building:

node uninstall-app.js
npx react-native run-android

## Run this script to create or check your debug keystore:

node create-debug-keystore.js

## After implementing these changes, try running the app again:

npx react-native run-android

