import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { fbAuth, onAuthStateChanged } from './src/utils/firebase';
import { LandingScreen, AuthModal }  from './src/screens/AuthScreens';
import { DashboardScreen }           from './src/screens/DashboardScreen';
import { C } from './src/utils/theme';

export default function App() {
  const [user, setUser]         = useState(undefined); // undefined = loading
  const [authMode, setAuthMode] = useState(null);      // null | 'login' | 'signup'

  useEffect(() => {
    const unsub = onAuthStateChanged(fbAuth, u => setUser(u || null));
    return unsub;
  }, []);

  // Loading
  if (user === undefined) {
    return (
      <View style={s.loadingWrap}>
        <StatusBar style="light" />
      </View>
    );
  }

  // Authenticated
  if (user) {
    return (
      <View style={s.root}>
        <StatusBar style="light" />
        <DashboardScreen user={user} />
      </View>
    );
  }

  // Not authenticated
  return (
    <View style={s.root}>
      <StatusBar style="light" />
      <LandingScreen onAuth={(mode) => setAuthMode(mode)} />
      {authMode && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onSuccess={(u) => { setUser(u); setAuthMode(null); }}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root:        { flex: 1, backgroundColor: C.bg },
  loadingWrap: { flex: 1, backgroundColor: C.bg },
});
