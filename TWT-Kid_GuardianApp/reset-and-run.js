const { execSync } = require('child_process');
const os = require('os');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

console.log(`${colors.cyan}=== Trustedwear App Reset & Run Utility ===${colors.reset}\n`);

// Check if we're running on Windows
const isWindows = os.platform() === 'win32';

// Define execution steps with Windows-specific command adjustments
const steps = [
  {
    name: 'Checking connected devices',
    command: 'adb devices',
  },
  {
    name: 'Uninstalling previous app version',
    command: 'adb uninstall com.trustedweartech.GuardianApp',
    ignoreErrors: true,
  },
  {
    name: 'Uninstalling debug app version',
    command: 'adb uninstall com.trustedweartech.GuardianApp.debug',
    ignoreErrors: true,
  },
  {
    name: 'Cleaning Android build',
    command: isWindows 
      ? 'cd android && gradlew.bat clean' 
      : 'cd android && ./gradlew clean',
  },
  {
    name: 'Creating debug keystore',
    command: 'node create-debug-keystore.js',
  },
  {
    name: 'Running Android app',
    command: 'npx react-native run-android',
  },
];

// Execute each step
let step = 1;
for (const task of steps) {
  try {
    console.log(`${colors.yellow}[${step}/${steps.length}] ${task.name}...${colors.reset}`);
    execSync(task.command, { stdio: 'inherit', shell: isWindows ? 'cmd.exe' : '/bin/bash' });
    console.log(`${colors.green}✓ ${task.name} completed successfully${colors.reset}\n`);
  } catch (error) {
    if (task.ignoreErrors) {
      console.log(`${colors.yellow}⚠ ${task.name} had non-critical errors, continuing...${colors.reset}\n`);
    } else {
      console.error(`${colors.red}✗ Error during ${task.name}:${colors.reset}`);
      console.error(error.message);
      process.exit(1);
    }
  }
  step++;
}

console.log(`${colors.green}=== All steps completed, app should be running! ===${colors.reset}`);
