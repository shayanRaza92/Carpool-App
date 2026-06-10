import * as React from 'react';
import { StyleSheet, SafeAreaView, StatusBar, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

// TODO: Replace with your actual deployed web app URL
// Example: const DEPLOYED_URL = 'https://my-carpool-app.netlify.app';
const DEPLOYED_URL = 'https://dancing-churros-a22bc1.netlify.app/';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <WebView
        source={{ uri: DEPLOYED_URL }}
        style={styles.webview}
        startInLoadingState={true}
        scalesPageToFit={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
  webview: {
    flex: 1,
  },
});
