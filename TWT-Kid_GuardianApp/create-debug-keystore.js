const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define paths
const projectRoot = __dirname;
const androidAppDir = path.join(projectRoot, 'android', 'app');
const keystorePath = path.join(androidAppDir, 'debug.keystore');

// Check if directory exists, create it if not
if (!fs.existsSync(androidAppDir)) {
  console.log(`Creating directory: ${androidAppDir}`);
  fs.mkdirSync(androidAppDir, { recursive: true });
}

// Check if keystore exists
if (fs.existsSync(keystorePath)) {
  console.log('Debug keystore already exists');
} else {
  console.log('Creating new debug keystore...');
  const keytoolCmd = `keytool -genkeypair -v -keystore "${keystorePath}" -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US"`;
  
  try {
    execSync(keytoolCmd, { stdio: 'inherit' });
    console.log('Debug keystore created successfully');
  } catch (error) {
    console.error('Failed to create debug keystore:', error.message);
    process.exit(1);
  }
}

// Print SHA-1 fingerprint
try {
  console.log('Getting SHA-1 fingerprint...');
  const output = execSync(`keytool -list -v -keystore "${keystorePath}" -alias androiddebugkey -storepass android -keypass android`, { encoding: 'utf8' });
  
  const sha1Match = output.match(/SHA1: (.*?)\n/);
  if (sha1Match && sha1Match[1]) {
    console.log('SHA-1 Fingerprint:', sha1Match[1]);
    console.log('Use this fingerprint in your Google Cloud Console for OAuth credentials');
  }
} catch (error) {
  console.error('Failed to get SHA-1 fingerprint:', error.message);
}
