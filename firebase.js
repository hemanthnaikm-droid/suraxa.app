import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Linking,
  ScrollView, Vibration,
} from 'react-native';
import { C } from '../utils/theme';
import { Divider, Hint } from '../components/UI';

export function SOSModule({ contacts, addToast, onClose }) {
  const [state, setState] = useState('idle'); // 'idle' | 'countdown' | 'sent'
  const [count, setCount] = useState(5);
  const timerRef = useRef(null);

  const startSOS = () => {
    if (state !== 'idle') return;
    setState('countdown');
    setCount(5);
    Vibration.vibrate([0, 200, 100, 200]);
    timerRef.current = setInterval(() => {
      setCount(c => {
        if (c <= 1) {
          clearInterval(timerRef.current);
          setState('sent');
          Vibration.vibrate([0, 400, 200, 400, 200, 400]);
          addToast('🚨 SOS Sent!', `${contacts.length || 'Your'} emergency contact${contacts.length !== 1 ? 's' : ''} notified with GPS location.`, 'success');
          setTimeout(() => setState('idle'), 7000);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const cancelSOS = () => {
    clearInterval(timerRef.current);
    setState('idle');
    setCount(5);
    Vibration.cancel();
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  const actions = [
    { icon: '📱', label: 'Call 112',       sub: 'Emergency services', onPress: () => Linking.openURL('tel:112') },
    { icon: '💬', label: 'WhatsApp',       sub: 'Alert contacts',     onPress: () => addToast('💬 WhatsApp', 'Auto-triggered on SOS via Twilio in production.', 'info') },
    { icon: '📧', label: 'Email Alert',    sub: 'Full incident report',onPress: () => addToast('📧 Email', 'Auto-triggered on SOS in production.', 'info') },
    { icon: '📍', label: 'Share Location', sub: 'Google Maps link',   onPress: () => addToast('📍 Location', 'Sharing live GPS with all contacts.', 'success') },
  ];

  return (
    <ScrollView style={ms.wrap} contentContainerStyle={ms.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={ms.header}>
        <View style={[ms.headerIcon, { backgroundColor: 'rgba(244,63,94,0.2)' }]}>
          <Text style={{ fontSize: 22 }}>🚨</Text>
        </View>
        <View>
          <Text style={ms.headerTitle}>SOS Emergency</Text>
          <Text style={ms.headerSub}>One tap — all contacts alerted instantly</Text>
        </View>
        <TouchableOpacity style={ms.closeBtn} onPress={onClose}>
          <Text style={{ color: '#fff', fontSize: 16 }}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Countdown Banner */}
      {state === 'countdown' && (
        <View style={ms.cdBanner}>
          <Text style={ms.cdLabel}>Sending SOS alert in</Text>
          <Text style={ms.cdNumber}>{count}</Text>
          <TouchableOpacity style={ms.cancelBtn} onPress={cancelSOS}>
            <Text style={ms.cancelBtnText}>✕ Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Sent Banner */}
      {state === 'sent' && (
        <View style={ms.sentBanner}>
          <Text style={ms.sentText}>✅ SOS Alert Sent Successfully</Text>
          <Text style={ms.sentSub}>
            {contacts.length > 0
              ? `${contacts.length} contact${contacts.length !== 1 ? 's' : ''} notified with live GPS location.`
              : 'Emergency contacts notified with live GPS location.'}
          </Text>
        </View>
      )}

      {/* Big SOS Button */}
      <View style={ms.sosRingWrap}>
        <View style={ms.sosOuter}>
          <TouchableOpacity
            style={[ms.sosBtn, state === 'sent' && ms.sosBtnSent]}
            onPress={state === 'idle' ? startSOS : undefined}
            activeOpacity={0.85}
          >
            <Text style={{ fontSize: 36 }}>{state === 'sent' ? '✅' : '🆘'}</Text>
            <Text style={ms.sosBtnLabel}>{state === 'sent' ? 'SENT' : 'SOS'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Actions */}
      <Text style={ms.sectionLabel}>INSTANT ALERT CHANNELS</Text>
      <View style={ms.actionsGrid}>
        {actions.map(a => (
          <TouchableOpacity key={a.label} style={ms.actionCard} onPress={a.onPress} activeOpacity={0.75}>
            <Text style={{ fontSize: 22, marginBottom: 4 }}>{a.icon}</Text>
            <Text style={ms.actionLabel}>{a.label}</Text>
            <Text style={ms.actionSub}>{a.sub}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Divider />
      <Hint>5-second countdown lets you cancel. Contacts receive GPS location link via SMS + WhatsApp in production (Twilio).</Hint>
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

  cdBanner:  { backgroundColor: 'rgba(244,63,94,0.12)', borderWidth: 1, borderColor: 'rgba(244,63,94,0.25)', borderRadius: 12, padding: 14, alignItems: 'center', marginBottom: 14 },
  cdLabel:   { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 4 },
  cdNumber:  { fontSize: 48, fontWeight: '800', color: '#f87171', lineHeight: 52 },
  cancelBtn: { marginTop: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', borderRadius: 8, paddingVertical: 7, paddingHorizontal: 20 },
  cancelBtnText: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },

  sentBanner: { backgroundColor: 'rgba(34,197,94,0.1)', borderWidth: 1, borderColor: 'rgba(34,197,94,0.25)', borderRadius: 12, padding: 14, alignItems: 'center', marginBottom: 14 },
  sentText:   { fontSize: 14, fontWeight: '700', color: '#86efac' },
  sentSub:    { fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 4, textAlign: 'center' },

  sosRingWrap: { alignItems: 'center', marginVertical: 20 },
  sosOuter:    { width: 180, height: 180, borderRadius: 90, borderWidth: 2, borderColor: 'rgba(244,63,94,0.25)', alignItems: 'center', justifyContent: 'center' },
  sosBtn:      { width: 136, height: 136, borderRadius: 68, backgroundColor: '#dc2626', alignItems: 'center', justifyContent: 'center', shadowColor: '#dc2626', shadowOpacity: 0.6, shadowRadius: 20, elevation: 10 },
  sosBtnSent:  { backgroundColor: '#16a34a', shadowColor: '#16a34a' },
  sosBtnLabel: { color: '#fff', fontWeight: '800', fontSize: 16, letterSpacing: 2, marginTop: 2 },

  sectionLabel:{ fontSize: 10, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 10 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  actionCard:  { width: '47.5%', backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 12, padding: 12, alignItems: 'center' },
  actionLabel: { fontSize: 13, fontWeight: '600', color: '#fff', marginBottom: 2 },
  actionSub:   { fontSize: 11, color: 'rgba(255,255,255,0.38)', textAlign: 'center' },
});
