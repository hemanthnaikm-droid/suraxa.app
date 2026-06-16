import React, { useState, useCallback, useRef } from 'react';
import SOSTrigger from "./SOSTrigger';
import {
  View, Text, TouchableOpacity, ActivityIndicator,
  StyleSheet, Animated,
} from 'react-native';
import { C } from '../utils/theme';

// ── Spinner ────────────────────────────────────────────────────
export function Spinner({ color = '#fff', size = 'small' }) {
  return <ActivityIndicator color={color} size={size} />;
}

// ── Icon Box ───────────────────────────────────────────────────
export function IconBox({ icon, color }) {
  return (
    <View style={[styles.iconBox, { backgroundColor: color + '33' }]}>
      <Text style={styles.iconBoxText}>{icon}</Text>
    </View>
  );
}

// ── Section Label ──────────────────────────────────────────────
export function SectionLabel({ children, style }) {
  return <Text style={[styles.sectionLabel, style]}>{children}</Text>;
}

// ── Card ───────────────────────────────────────────────────────
export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

// ── Primary Button ─────────────────────────────────────────────
export function PrimaryButton({ label, onPress, disabled, loading, color = C.blue, style }) {
  return (
    <TouchableOpacity
      style={[styles.primaryBtn, { backgroundColor: color, opacity: disabled ? 0.6 : 1 }, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading
        ? <Spinner />
        : <Text style={styles.primaryBtnText}>{label}</Text>
      }
    </TouchableOpacity>
  );
}

// ── Ghost Button ───────────────────────────────────────────────
export function GhostButton({ label, onPress, style }) {
  return (
    <TouchableOpacity style={[styles.ghostBtn, style]} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.ghostBtnText}>{label}</Text>
    </TouchableOpacity>
  );
}

// ── Divider ────────────────────────────────────────────────────
export function Divider({ style }) {
  return <View style={[styles.divider, style]} />;
}

// ── Empty State ────────────────────────────────────────────────
export function EmptyState({ icon, text, sub }) {
  return (
    <View style={styles.emptyWrap}>
      <Text style={styles.emptyIcon}>{icon}</Text>
      <Text style={styles.emptyText}>{text}</Text>
      {sub ? <Text style={styles.emptySub}>{sub}</Text> : null}
    </View>
  );
}

// ── Toggle ─────────────────────────────────────────────────────
export function Toggle({ on, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.toggle, { backgroundColor: on ? C.blue : 'rgba(255,255,255,0.14)' }]}
      activeOpacity={0.8}
    >
      <View style={[styles.toggleThumb, { left: on ? 21 : 3 }]} />
    </TouchableOpacity>
  );
}

// ── Toast system ───────────────────────────────────────────────
export function useToast() {
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((title, message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, title, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);
  return { toasts, addToast };
}

export function ToastContainer({ toasts }) {
  const borderColor = { success: '#22c55e', error: '#f43f5e', info: '#3b82f6' };
  if (!toasts.length) return null;
  return (
    <View style={styles.toastWrap} pointerEvents="none">
      {toasts.map(t => (
        <View key={t.id} style={[styles.toast, { borderColor: borderColor[t.type] + '80' }]}>
          <Text style={styles.toastTitle}>{t.title}</Text>
          <Text style={styles.toastMsg}>{t.message}</Text>
        </View>
      ))}
    </View>
  );
}

// ── Tag ────────────────────────────────────────────────────────
export function Tag({ label, type = 'ai' }) {
  const colors = {
    ai:  { bg: 'rgba(124,58,237,0.18)', border: 'rgba(124,58,237,0.3)', text: '#c4b5fd' },
    new: { bg: 'rgba(34,197,94,0.18)',  border: 'rgba(34,197,94,0.3)',  text: '#86efac' },
  };
  const c = colors[type] || colors.ai;
  return (
    <View style={[styles.tag, { backgroundColor: c.bg, borderColor: c.border }]}>
      <Text style={[styles.tagText, { color: c.text }]}>{label}</Text>
    </View>
  );
}
// ── SOS Trigger ─────────────────────────────────────────────────
// Add this inside your main component's return, before closing tag
// Change pattern to whatever the user selects in settings:
// "up-down-up" | "down-up-down" | "up-up-up" | "down-down-down"

<SOSTrigger
  pattern={userSelectedPattern}
  onSOS={() => {
    // call your SOS function here
    sendSOSAlert({ userName, location, contacts });
  }}
/>

// ── Hint text ─────────────────────────────────────────────────
export function Hint({ children }) {
  return <Text style={styles.hint}>{children}</Text>;
}

const styles = StyleSheet.create({
  iconBox:      { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  iconBoxText:  { fontSize: 20 },
  sectionLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 10 },
  card:         { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 14, padding: 14 },
  primaryBtn:   { borderRadius: 10, paddingVertical: 12, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center' },
  primaryBtnText:{ color: '#fff', fontWeight: '700', fontSize: 14 },
  ghostBtn:     { borderRadius: 10, paddingVertical: 10, paddingHorizontal: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  ghostBtnText: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '500' },
  divider:      { height: 1, backgroundColor: 'rgba(255,255,255,0.07)', marginVertical: 14 },
  emptyWrap:    { alignItems: 'center', paddingVertical: 28 },
  emptyIcon:    { fontSize: 36, opacity: 0.35, marginBottom: 8 },
  emptyText:    { color: 'rgba(255,255,255,0.4)', fontSize: 13 },
  emptySub:     { color: 'rgba(255,255,255,0.22)', fontSize: 11, marginTop: 5, textAlign: 'center', paddingHorizontal: 16 },
  toggle:       { width: 42, height: 24, borderRadius: 12, position: 'relative' },
  toggleThumb:  { position: 'absolute', width: 18, height: 18, borderRadius: 9, backgroundColor: '#fff', top: 3, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 2, elevation: 2 },
  toastWrap:    { position: 'absolute', top: 68, right: 12, left: 12, zIndex: 999, gap: 8 },
  toast:        { backgroundColor: '#0d1a34', borderWidth: 1, borderRadius: 11, paddingHorizontal: 14, paddingVertical: 10, shadowColor: '#000', shadowOpacity: 0.4, shadowRadius: 12, elevation: 10 },
  toastTitle:   { color: '#fff', fontWeight: '700', fontSize: 13, marginBottom: 2 },
  toastMsg:     { color: 'rgba(255,255,255,0.5)', fontSize: 11 },
  tag:          { borderWidth: 1, borderRadius: 5, paddingHorizontal: 7, paddingVertical: 2 },
  tagText:      { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  hint:         { fontSize: 11, color: 'rgba(255,255,255,0.25)', textAlign: 'center', lineHeight: 17, marginTop: 12, paddingHorizontal: 4 },
});

