# Carpool App - Mobile Wrapper

This directory contains the React Native project that wraps your existing web application for Android (and iOS).

## Prerequisites

- **Node.js** (which you already have)
- **Expo Go** app on your physical Android device (install from Play Store) OR **Android Studio** emulator.

## Configuration

1. **Set your URL**:  
   Open `mobile/App.js` and update the `DEPLOYED_URL` constant with your actual deployed web app URL (e.g., `https://your-app.netlify.app`).  
   *Currently set to:* `https://google.com` (Placeholder)

2. **App Details**:  
   You can customize the app name, icon, and package name in `mobile/app.json`.

## Running the App

1. Navigate to the `mobile` directory:
   ```bash
   cd mobile
   ```

2. Start the development server:
   ```bash
   npx expo start
   ```

3. **To test on your phone**:
   - Scan the QR code shown in the terminal using the **Expo Go** app on Android (or Camera app on iOS).
   
4. **To test on Emulator**:
   - Press `a` in the terminal to open on Android Emulator (if set up).

## Building for Free Distribution (Direct APK)

To let users download the app for free without using the Play Store (saving you the $25 fee), you can build a standalone **APK** file.

1. Generate the APK:
   ```bash
   eas build -p android --profile preview
   ```
   
2. Wait for the build to finish. Expo will provide a link to download the `.apk` file.

3. Share this file with your users (via website, Google Drive, WhatsApp, etc.).
   *Note: Users will need to allow "Install from Unknown Sources" on their device.*

## Building for Play Store (Official)

To publish on the Google Play Store (requires $25 one-time developer fee):

1. Generate the App Bundle (AAB):
   ```bash
   eas build -p android
   ```

2. Upload the `.aab` file to the [Google Play Console](https://play.google.com/console).
