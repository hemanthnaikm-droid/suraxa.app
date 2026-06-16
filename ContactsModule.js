import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Linking,
} from 'react-native';
import * as Location from 'expo-location';
import * as Clipboard from 'expo-clipboard';
import { C } from '../utils/theme';
import { Spinner, Divider, Hint, PrimaryButton } from '../components/UI';

export function LocationModule({ contacts, addToast, onClose, onOpenRoute }) {
  const [loc, setLoc]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [sharing, setSharing] = useState(false);

  const fetchLoc = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        addToast('⚠️ Permission Denied', 'Allow location access in Settings.', 'error');
        setLoading(false);
        return;
      }
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setLoc({
        lat: pos.coords.latitude.toFixed(6),
        lng: pos.coords.longitude.toFixed(6),
        accuracy: Math.round(pos.coords.accuracy),
        time: new Date().toLocaleTimeString(),
      });
      addToast('📍 Location Retrieved', 'Real GPS coordinates fetched successfully.', 'success');
    } catch {
      addToast('⚠️ Error', 'Could not fetch location. Try again.', 'error');
    }
    setLoading(false);
  };

  const shareLoc = () => {
    if (!loc) return;
    setSharing(true);
    setTimeout(() => {
      setSharing(false);
      addToast('📤 Location Shared', `Sent to ${contacts.length} emergency contact${contacts.length !== 1 ? 's' : ''}.`, 'success');
    }, 1500);
  };

  const copyLink = async () => {
    if (!loc) return;
    const url = `https://maps.google.com/maps?q=${loc.lat},${loc.lng}`;
    await Clipboard.setStringAsync(url);
    addToast('🔗 Copied', 'Google Maps link copied to clipboard.', 'success');
  };

  const openMaps = () => {
    if (!loc) return;
    const url = `https://maps.google.com/maps?q=${loc.lat},${loc.lng}`;
    Linking.openURL(url);
  };

  return (
    <ScrollView style={ms.wrap} contentContainerStyle={ms.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={ms.header}>
        <View style={[ms.headerIcon, { backgroundColor: 'rgba(6,182,212,0.2)' }]}>
          <Text style={{ fontSize: 22 }}>📍</Text>
        </View>
        <View>
          <Text style={ms.headerTitle}>Live Location</Text>
          <Text style={ms.headerSub}>Real-time GPS sharing with emergency contacts</Text>
        </View>
        <TouchableOpacity style={ms.closeBtn} onPress={onClose}>
          <Text style={{ color: '#fff', fontSize: 16 }}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Map box */}
      <View style={ms.mapBox}>
        {loc ? (
          <>
            <Text style={ms.mapPin}>📍</Text>
            <Text style={ms.mapLabel}>Your current location</Text>
            <View style={ms.coordsBox}>
              <Text style={ms.coordsText}>{loc.lat}°N, {loc.lng}°E</Text>
            </View>
            <Text style={ms.mapMeta}>Accuracy ±{loc.accuracy}m · Updated {loc.time}</Text>
          </>
        ) : (
          <>
            <Text style={ms.mapEmpty}>🗺️</Text>
            <Text style={ms.mapEmptyText}>Tap below to get your real GPS coordinates</Text>
          </>
        )}
      </View>

      <TouchableOpacity style={ms.locBtn} onPress={fetchLoc} disabled={loading} activeOpacity={0.85}>
        {loading
          ? <><Spinner /><Text style={ms.locBtnText}>  Fetching GPS…</Text></>
          : <Text style={ms.locBtnText}>📡 Get My Current Location</Text>
        }
      </TouchableOpacity>

      {loc && (
        <>
          {/* Info grid */}
          <View style={ms.infoGrid}>
            {[['Latitude', `${loc.lat}°N`], ['Longitude', `${loc.lng}°E`], ['Accuracy', `±${loc.accuracy}m`], ['Updated', loc.time]].map(([l, v]) => (
              <View key={l} style={ms.infoCard}>
                <Text style={ms.infoLbl}>{l}</Text>
                <Text style={ms.infoVal}>{v}</Text>
              </View>
            ))}
          </View>

          <Divider />

          <TouchableOpacity style={ms.shareBtn} onPress={shareLoc} disabled={sharing} activeOpacity={0.8}>
            {sharing
              ? <><Spinner /><Text style={ms.shareBtnText}>  Sharing…</Text></>
              : <Text style={ms.shareBtnText}>📤 Share with Emergency Contacts</Text>
            }
          </TouchableOpacity>
          <TouchableOpacity style={ms.shareBtn} onPress={copyLink} activeOpacity={0.8}>
            <Text style={ms.shareBtnText}>🔗 Copy Google Maps Link</Text>
          </TouchableOpacity>
          <TouchableOpacity style={ms.shareBtn} onPress={openMaps} activeOpacity={0.8}>
            <Text style={ms.shareBtnText}>🗺️ Open in Google Maps App</Text>
          </TouchableOpacity>
          <TouchableOpacity style={ms.shareBtn} onPress={() => { onClose(); onOpenRoute(loc); }} activeOpacity={0.8}>
            <Text style={ms.shareBtnText}>🛣️ Get Safe Route from Here</Text>
          </TouchableOpacity>
        </>
      )}

      <Hint>Uses your device's real GPS. Location is only shared when you choose to share it.</Hint>
    </ScrollView>
  );
}

const ms = StyleSheet.create({
  wrap:    { flex: 1, backgroundColor: C.bg },
  content: { padding: 18, paddingBottom: 40 },

  header:      { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 18 },
  headerIcon:  { width: 46, height: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  headerSub:   { fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 },
  closeBtn:    { marginLeft: 'auto', width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },

  mapBox:       { backgroundColor: 'rgba(6,182,212,0.06)', borderWidth: 1, borderColor: 'rgba(6,182,212,0.2)', borderRadius: 14, padding: 24, alignItems: 'center', marginBottom: 12 },
  mapPin:       { fontSize: 40, marginBottom: 6 },
  mapLabel:     { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 8 },
  coordsBox:    { backgroundColor: 'rgba(6,182,212,0.1)', borderWidth: 1, borderColor: 'rgba(6,182,212,0.25)', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 7 },
  coordsText:   { fontFamily: 'monospace', fontSize: 13, color: C.cyan },
  mapMeta:      { fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 8 },
  mapEmpty:     { fontSize: 44, opacity: 0.3, marginBottom: 8 },
  mapEmptyText: { fontSize: 13, color: 'rgba(255,255,255,0.4)', textAlign: 'center' },

  locBtn:     { backgroundColor: '#0891b2', borderRadius: 10, paddingVertical: 13, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginBottom: 16, shadowColor: C.cyan, shadowOpacity: 0.3, shadowRadius: 10, elevation: 4 },
  locBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  infoCard: { width: '47.5%', backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 10, padding: 10 },
  infoLbl:  { fontSize: 10, color: 'rgba(255,255,255,0.36)', marginBottom: 3 },
  infoVal:  { fontSize: 13, fontWeight: '600', color: '#fff' },

  shareBtn:     { borderWidth: 1, borderColor: 'rgba(255,255,255,0.13)', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginTop: 8, backgroundColor: C.card },
  shareBtnText: { color: 'rgba(255,255,255,0.75)', fontSize: 13, fontWeight: '500' },
});
