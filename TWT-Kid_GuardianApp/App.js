{
  "expo": {
    "scheme": "acme",
    "icon": "twt.png",
    "web": {
      "bundler": "metro"
    },
    "android": {
      "package": "com.trustedweartech.TwKidsApp",
      "config": {
        "googleMaps": {
          "apiKey": "AIzaSyD6TwSr3061DpOM1hvm9mc6qdltueFYUsM"
        }
      },
      "permissions": [
        "android.permission.BLUETOOTH",
        "android.permission.BLUETOOTH_ADMIN",
        "android.permission.BLUETOOTH_CONNECT"
      ]
    },
    "name": "TW Kid",
    "slug": "kids-smartwatch-mobile-ui",
    "ios": {
      "bundleIdentifier": "com.trustedweartech.TwKidsApp"
    },
    "plugins": [
      "react-native-ble-plx",
      "expo-sqlite"
    ],
    "extra": {
      "eas": {
        "projectId": "3d6b0705-136e-4ce2-a4ac-573f9d7f088d"
      }
    },
    "owner": "prateekpathak"
  }
}
