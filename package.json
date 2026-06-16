import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, KeyboardAvoidingView, Platform, Modal,
} from 'react-native';
import { C } from '../utils/theme';
import { Spinner } from '../components/UI';
import {
  fbAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  updateProfile, formatFirebaseError,
} from '../utils/firebase';

// ── Landing Page ───────────────────────────────────────────────
export function LandingScreen({ onAuth }) {
  const features = [
    { icon: '🆘', title: 'SOS Alert',      desc: 'One tap to alert all contacts' },
    { icon: '📍', title: 'Live Location',  desc: 'Real GPS sharing instantly' },
    { icon: '🤖', title: 'Claude AI',      desc: 'Expert safety guidance' },
    { icon: '👥', title: 'Contacts',       desc: 'Firebase synced always' },
    { icon: '🗺️', title: 'Safe Route',    desc: 'AI-verified navigation' },
    { icon: '🎙️', title: 'Voice Recorder',desc: 'Audio evidence capture' },
  ];

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.landingContent} showsVerticalScrollIndicator={false}>
      {/* Badge */}
      <View style={s.badge}>
        <View style={s.bdot} />
        <Text style={s.badgeText}>WOMEN'S SAFETY PLATFORM</Text>
      </View>

      {/* Hero */}
      <Text style={s.heroTitle}>Your Safety,{'\n'}<Text style={s.heroCyan}>Our Priority</Text></Text>
      <Text style={s.heroSub}>
        AI-powered protection with real-time GPS, emergency contacts, and Claude AI — all in one app.
      </Text>

      {/* CTA Buttons */}
      <TouchableOpacity style={s.btnPrimary} onPress={() => onAuth('signup')} activeOpacity={0.85}>
        <Text style={s.btnPrimaryText}>🛡️ Get Protected — Free</Text>
      </TouchableOpacity>
      <TouchableOpacity style={s.btnGhost} onPress={() => onAuth('login')} activeOpacity={0.8}>
        <Text style={s.btnGhostText}>Sign In to Account</Text>
      </TouchableOpacity>

      {/* Feature grid */}
      <View style={s.featGrid}>
        {features.map(f => (
          <View key={f.title} style={s.featCard}>
            <Text style={s.featIcon}>{f.icon}</Text>
            <Text style={s.featTitle}>{f.title}</Text>
            <Text style={s.featDesc}>{f.desc}</Text>
          </View>
        ))}
      </View>

      {/* Stats */}
      <View style={s.statsRow}>
        {[['12+', 'Safety Features'], ['Real', 'Firebase Auth'], ['Claude', 'AI Powered'], ['100%', 'Free']].map(([n, l]) => (
          <View key={l} style={s.stat}>
            <Text style={s.statN}>{n}</Text>
            <Text style={s.statL}>{l}</Text>
          </View>
        ))}
      </View>

      <Text style={s.footer}>Built with 💙 for women's safety · India</Text>
    </ScrollView>
  );
}

// ── Auth Modal ─────────────────────────────────────────────────
export function AuthModal({ mode, onClose, onSuccess }) {
  const [m, setM]       = useState(mode); // 'login' | 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr]   = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setErr(''); setLoading(true);
    try {
      if (m === 'signup') {
        const cred = await createUserWithEmailAndPassword(fbAuth, email.trim(), pass);
        if (name.trim()) await updateProfile(cred.user, { displayName: name.trim() });
        onSuccess(cred.user);
      } else {
        const cred = await signInWithEmailAndPassword(fbAuth, email.trim(), pass);
        onSuccess(cred.user);
      }
    } catch (e) { setErr(formatFirebaseError(e)); }
    setLoading(false);
  };

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={s.modalOverlay}>
        <View style={s.modalBox}>
          <TouchableOpacity style={s.mClose} onPress={onClose}>
            <Text style={{ color: '#fff', fontSize: 16 }}>✕</Text>
          </TouchableOpacity>

          <Text style={s.modalLogo}>🛡️ Suraksha</Text>
          <Text style={s.modalTitle}>{m === 'signup' ? 'Create Account' : 'Welcome Back'}</Text>
          <Text style={s.modalSub}>{m === 'signup' ? 'Start your safety journey' : 'Sign in to your account'}</Text>

          {err ? <View style={s.errBox}><Text style={s.errText}>{err}</Text></View> : null}

          {m === 'signup' && (
            <View style={s.fg}>
              <Text style={s.label}>Full Name</Text>
              <TextInput style={s.input} placeholder="e.g. Priya Sharma" placeholderTextColor="rgba(255,255,255,0.25)"
                value={name} onChangeText={setName} autoCapitalize="words" />
            </View>
          )}
          <View style={s.fg}>
            <Text style={s.label}>Email Address</Text>
            <TextInput style={s.input} placeholder="you@example.com" placeholderTextColor="rgba(255,255,255,0.25)"
              value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          </View>
          <View style={s.fg}>
            <Text style={s.label}>Password</Text>
            <TextInput style={s.input} placeholder="At least 6 characters" placeholderTextColor="rgba(255,255,255,0.25)"
              value={pass} onChangeText={setPass} secureTextEntry />
          </View>

          <TouchableOpacity style={s.formBtn} onPress={submit} disabled={loading} activeOpacity={0.85}>
            {loading ? <Spinner /> : <Text style={s.formBtnText}>{m === 'signup' ? 'Create Account' : 'Sign In'}</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={s.switchRow} onPress={() => { setM(m === 'signup' ? 'login' : 'signup'); setErr(''); }}>
            <Text style={s.switchText}>
              {m === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
              <Text style={s.switchLink}>{m === 'signup' ? 'Sign In' : 'Sign Up'}</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const s = StyleSheet.create({
  screen:         { flex: 1, backgroundColor: C.bg },
  landingContent: { alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 40 },

  badge:      { flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: 'rgba(37,99,235,0.15)', borderWidth: 1, borderColor: 'rgba(37,99,235,0.35)', paddingHorizontal: 13, paddingVertical: 5, borderRadius: 100, marginBottom: 24 },
  bdot:       { width: 6, height: 6, borderRadius: 3, backgroundColor: C.cyan },
  badgeText:  { color: '#93c5fd', fontSize: 10, fontWeight: '700', letterSpacing: 1 },

  heroTitle:  { fontSize: 34, fontWeight: '800', color: '#fff', textAlign: 'center', lineHeight: 40, marginBottom: 14, letterSpacing: -0.5 },
  heroCyan:   { color: C.cyan },
  heroSub:    { fontSize: 14, color: 'rgba(255,255,255,0.55)', textAlign: 'center', lineHeight: 22, marginBottom: 28, maxWidth: 320 },

  btnPrimary:     { width: '100%', backgroundColor: C.blue, borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginBottom: 10, shadowColor: C.blue, shadowOpacity: 0.5, shadowRadius: 12, elevation: 6 },
  btnPrimaryText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  btnGhost:       { width: '100%', borderRadius: 14, paddingVertical: 13, alignItems: 'center', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)', marginBottom: 28 },
  btnGhostText:   { color: 'rgba(255,255,255,0.85)', fontWeight: '600', fontSize: 14 },

  featGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, width: '100%', marginBottom: 24 },
  featCard: { width: '47%', backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 14, padding: 14 },
  featIcon: { fontSize: 24, marginBottom: 6 },
  featTitle:{ fontSize: 13, fontWeight: '700', color: '#fff', marginBottom: 3 },
  featDesc: { fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 16 },

  statsRow: { flexDirection: 'row', width: '100%', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 14, paddingVertical: 16, marginBottom: 20 },
  stat:     { flex: 1, alignItems: 'center' },
  statN:    { fontSize: 20, fontWeight: '800', color: '#60a5fa' },
  statL:    { fontSize: 10, color: 'rgba(255,255,255,0.38)', marginTop: 2 },

  footer: { fontSize: 11, color: 'rgba(255,255,255,0.2)' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: C.overlay, justifyContent: 'flex-end' },
  modalBox:     { backgroundColor: '#112040', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40, borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  mClose:       { position: 'absolute', top: 16, right: 16, width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  modalLogo:    { textAlign: 'center', fontSize: 18, fontWeight: '800', color: '#fff', marginBottom: 4 },
  modalTitle:   { textAlign: 'center', fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 4 },
  modalSub:     { textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 20 },

  errBox:  { backgroundColor: 'rgba(244,63,94,0.15)', borderWidth: 1, borderColor: 'rgba(244,63,94,0.3)', borderRadius: 8, padding: 10, marginBottom: 14 },
  errText: { fontSize: 12, color: '#fca5a5' },

  fg:    { marginBottom: 14 },
  label: { fontSize: 12, fontWeight: '500', color: 'rgba(255,255,255,0.6)', marginBottom: 6 },
  input: { backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', borderRadius: 10, paddingHorizontal: 13, paddingVertical: 11, color: '#fff', fontSize: 14 },

  formBtn:     { backgroundColor: C.blue, borderRadius: 10, paddingVertical: 13, alignItems: 'center', marginBottom: 14, shadowColor: C.blue, shadowOpacity: 0.4, shadowRadius: 10, elevation: 4 },
  formBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  switchRow:  { alignItems: 'center' },
  switchText: { fontSize: 12, color: 'rgba(255,255,255,0.43)' },
  switchLink: { color: '#60a5fa', fontWeight: '600' },
});
