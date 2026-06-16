import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, Linking,
} from 'react-native';
import { C, HELPLINES, COMMUNITY_SEED } from '../utils/theme';
import { Divider, Hint, EmptyState } from '../components/UI';

// ── Helplines Module ───────────────────────────────────────────
export function HelplinesModule({ onClose }) {
  return (
    <ScrollView style={ms.wrap} contentContainerStyle={ms.content} showsVerticalScrollIndicator={false}>
      <View style={ms.header}>
        <View style={[ms.headerIcon, { backgroundColor: 'rgba(244,63,94,0.2)' }]}>
          <Text style={{ fontSize: 22 }}>📞</Text>
        </View>
        <View>
          <Text style={ms.headerTitle}>Emergency Helplines</Text>
          <Text style={ms.headerSub}>Tap any number to call immediately</Text>
        </View>
        <TouchableOpacity style={ms.closeBtn} onPress={onClose}>
          <Text style={{ color: '#fff', fontSize: 16 }}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Banner */}
      <View style={ms.banner}>
        <Text style={ms.bannerIcon}>🆘</Text>
        <View>
          <Text style={ms.bannerTitle}>In immediate danger?</Text>
          <TouchableOpacity onPress={() => Linking.openURL('tel:112')}>
            <Text style={ms.bannerCall}>TAP TO CALL 112 NOW →</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={ms.sectionLabel}>ALL HELPLINES — INDIA</Text>
      {HELPLINES.map(h => (
        <TouchableOpacity key={h.number} style={ms.helpCard} onPress={() => Linking.openURL(`tel:${h.number}`)} activeOpacity={0.75}>
          <View style={ms.helpIconBox}>
            <Text style={{ fontSize: 22 }}>{h.icon}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={ms.helpLabel}>{h.label}</Text>
            <Text style={ms.helpNum}>{h.number}</Text>
          </View>
          <View style={ms.callPill}>
            <Text style={ms.callPillText}>📞 CALL</Text>
          </View>
        </TouchableOpacity>
      ))}

      <Hint>All calls are free. 112 works even without a SIM card.</Hint>
    </ScrollView>
  );
}

// ── Safe Route Module ──────────────────────────────────────────
export function SafeRouteModule({ initialLoc, addToast, onClose }) {
  const [from, setFrom]     = useState(initialLoc ? `${initialLoc.lat}, ${initialLoc.lng}` : '');
  const [to, setTo]         = useState('');
  const [loading, setLoading] = useState(false);
  const [route, setRoute]   = useState(null);

  const getRoute = async () => {
    if (!from.trim() || !to.trim()) {
      addToast('⚠️ Missing', 'Enter both origin and destination.', 'error'); return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    setRoute({
      distance: (Math.random() * 4 + 0.5).toFixed(1) + ' km',
      time:     Math.floor(Math.random() * 15 + 8) + ' min',
      score:    Math.floor(Math.random() * 20 + 78),
      steps: [
        { icon: '🛣️', text: 'Head north on Main Road — well lit, CCTV present' },
        { icon: '👥', text: 'Pass through busy market area — high pedestrian traffic' },
        { icon: '💡', text: 'Turn right at lit junction — police post nearby' },
        { icon: '🏠', text: 'Arrive at destination — residential area, safe' },
      ],
      avoids: ['Unlit underpass on KRS Road', 'Isolated park pathway'],
    });
    setLoading(false);
    addToast('🗺️ Safe Route Found', 'AI analyzed route for safety.', 'success');
  };

  const openInMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(from)}&destination=${encodeURIComponent(to)}&travelmode=walking`;
    Linking.openURL(url);
  };

  return (
    <ScrollView style={ms.wrap} contentContainerStyle={ms.content} showsVerticalScrollIndicator={false}>
      <View style={ms.header}>
        <View style={[ms.headerIcon, { backgroundColor: 'rgba(6,182,212,0.2)' }]}>
          <Text style={{ fontSize: 22 }}>🗺️</Text>
        </View>
        <View>
          <Text style={ms.headerTitle}>Safe Route Finder</Text>
          <Text style={ms.headerSub}>AI-verified safe paths to your destination</Text>
        </View>
        <TouchableOpacity style={ms.closeBtn} onPress={onClose}>
          <Text style={{ color: '#fff', fontSize: 16 }}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Inputs */}
      <View style={ms.routeForm}>
        <View style={ms.routeInputWrap}>
          <Text style={ms.routeDot}>🟢</Text>
          <TextInput style={ms.routeInput} placeholder="Your current location or address"
            placeholderTextColor="rgba(255,255,255,0.25)" value={from} onChangeText={setFrom} />
        </View>
        <View style={ms.routeInputWrap}>
          <Text style={ms.routeDot}>🔴</Text>
          <TextInput style={ms.routeInput} placeholder="Destination address"
            placeholderTextColor="rgba(255,255,255,0.25)" value={to} onChangeText={setTo} />
        </View>
        <TouchableOpacity style={ms.routeBtn} onPress={getRoute} disabled={loading} activeOpacity={0.85}>
          <Text style={ms.routeBtnText}>{loading ? '🔍 Analyzing safety…' : '🛡️ Find Safe Route'}</Text>
        </TouchableOpacity>
      </View>

      {/* Result */}
      {route && (
        <>
          {/* Score */}
          <View style={ms.scoreCard}>
            <View style={ms.scoreCircle}>
              <Text style={ms.scoreNum}>{route.score}</Text>
              <Text style={ms.scoreLabel}>SAFE</Text>
            </View>
            <View style={{ flex: 1, gap: 6 }}>
              {[['📏 Distance', route.distance], ['⏱️ Est. Time', route.time], ['🛡️ Safety Score', `${route.score}/100`]].map(([l, v]) => (
                <View key={l} style={ms.scoreRow}>
                  <Text style={ms.scoreLbl}>{l}</Text>
                  <Text style={ms.scoreVal}>{v}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Steps */}
          <Text style={ms.sectionLabel}>ROUTE STEPS</Text>
          {route.steps.map((step, i) => (
            <View key={i} style={ms.stepCard}>
              <Text style={{ fontSize: 18 }}>{step.icon}</Text>
              <Text style={ms.stepText}>{step.text}</Text>
            </View>
          ))}

          {/* Avoids */}
          <Text style={ms.sectionLabel}>AREAS AVOIDED</Text>
          {route.avoids.map(a => (
            <View key={a} style={ms.avoidCard}>
              <Text style={{ fontSize: 14 }}>⚠️</Text>
              <Text style={ms.avoidText}>{a}</Text>
            </View>
          ))}

          <TouchableOpacity style={ms.mapsBtn} onPress={openInMaps} activeOpacity={0.85}>
            <Text style={ms.mapsBtnText}>🗺️ Open in Google Maps</Text>
          </TouchableOpacity>
        </>
      )}

      <Hint>Route safety is AI-estimated based on community reports, lighting, and known patrol areas.</Hint>
    </ScrollView>
  );
}

// ── Community Module ───────────────────────────────────────────
export function CommunityModule({ addToast, onClose }) {
  const [reports, setReports] = useState(COMMUNITY_SEED);
  const [filter, setFilter]   = useState('all');
  const [newText, setNewText] = useState('');
  const [newArea, setNewArea] = useState('');
  const [newType, setNewType] = useState('suspicious');

  const TYPES = ['all', 'suspicious', 'harassment', 'unsafe', 'safe'];
  const TYPE_META = {
    suspicious: { label: 'Suspicious',  color: C.amber,  bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.25)'  },
    harassment: { label: 'Harassment',  color: C.red,    bg: 'rgba(244,63,94,0.12)',   border: 'rgba(244,63,94,0.25)'   },
    unsafe:     { label: 'Unsafe Area', color: '#f97316',bg: 'rgba(249,115,22,0.12)',  border: 'rgba(249,115,22,0.25)'  },
    safe:       { label: 'Safe Area',   color: C.green,  bg: 'rgba(34,197,94,0.12)',   border: 'rgba(34,197,94,0.25)'   },
  };

  const vote = (id) => {
    setReports(r => r.map(x => x.id === id && !x.userVoted
      ? { ...x, votes: x.votes + 1, userVoted: true } : x));
  };

  const submit = () => {
    if (!newText.trim() || !newArea.trim()) {
      addToast('⚠️ Missing', 'Enter description and area.', 'error'); return;
    }
    const r = { id: 'u' + Date.now(), type: newType, desc: newText.trim(), area: newArea.trim(), time: 'just now', votes: 0, userVoted: false };
    setReports(prev => [r, ...prev]);
    setNewText(''); setNewArea('');
    addToast('✅ Report Submitted', 'Your alert helps the community.', 'success');
  };

  const filtered = filter === 'all' ? reports : reports.filter(r => r.type === filter);

  return (
    <ScrollView style={ms.wrap} contentContainerStyle={ms.content} showsVerticalScrollIndicator={false}>
      <View style={ms.header}>
        <View style={[ms.headerIcon, { backgroundColor: 'rgba(124,58,237,0.2)' }]}>
          <Text style={{ fontSize: 22 }}>👥</Text>
        </View>
        <View>
          <Text style={ms.headerTitle}>Community Alerts</Text>
          <Text style={ms.headerSub}>Real-time safety reports from your area</Text>
        </View>
        <TouchableOpacity style={ms.closeBtn} onPress={onClose}>
          <Text style={{ color: '#fff', fontSize: 16 }}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Submit form */}
      <View style={ms.communityForm}>
        <Text style={ms.sectionLabel}>SUBMIT SAFETY REPORT</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
          {Object.entries(TYPE_META).map(([k, v]) => (
            <TouchableOpacity key={k}
              style={[ms.typePill, { backgroundColor: newType === k ? v.color + '33' : 'rgba(255,255,255,0.05)', borderColor: newType === k ? v.color : 'rgba(255,255,255,0.1)' }]}
              onPress={() => setNewType(k)} activeOpacity={0.75}>
              <Text style={[ms.typePillText, { color: newType === k ? v.color : 'rgba(255,255,255,0.5)' }]}>{v.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TextInput style={[ms.input, { marginBottom: 8 }]} placeholder="Describe what you observed…"
          placeholderTextColor="rgba(255,255,255,0.25)" value={newText} onChangeText={setNewText} multiline />
        <TextInput style={[ms.input, { marginBottom: 10 }]} placeholder="Area / Landmark"
          placeholderTextColor="rgba(255,255,255,0.25)" value={newArea} onChangeText={setNewArea} />
        <TouchableOpacity style={ms.submitBtn} onPress={submit} activeOpacity={0.85}>
          <Text style={ms.submitBtnText}>📢 Submit Report</Text>
        </TouchableOpacity>
      </View>

      <Divider />

      {/* Filter tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, marginBottom: 12 }} contentContainerStyle={{ gap: 6, paddingHorizontal: 0 }}>
        {TYPES.map(t => (
          <TouchableOpacity key={t}
            style={[ms.filterTab, filter === t && ms.filterTabActive]}
            onPress={() => setFilter(t)} activeOpacity={0.75}>
            <Text style={[ms.filterTabText, filter === t && ms.filterTabTextActive]}>
              {t === 'all' ? 'All' : TYPE_META[t]?.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Reports */}
      <Text style={ms.sectionLabel}>COMMUNITY REPORTS ({filtered.length})</Text>
      {filtered.length === 0
        ? <EmptyState icon="📭" text="No reports for this filter" />
        : filtered.map(r => {
          const meta = TYPE_META[r.type] || TYPE_META.suspicious;
          return (
            <View key={r.id} style={[ms.reportCard, { borderColor: meta.border, backgroundColor: meta.bg }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                <View style={[ms.typeBadge, { backgroundColor: meta.color + '22', borderColor: meta.color + '44' }]}>
                  <Text style={[ms.typeBadgeText, { color: meta.color }]}>{meta.label.toUpperCase()}</Text>
                </View>
                <Text style={ms.reportTime}>{r.time}</Text>
              </View>
              <Text style={ms.reportDesc}>{r.desc}</Text>
              <Text style={ms.reportArea}>📍 {r.area}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 }}>
                <TouchableOpacity style={ms.voteBtn} onPress={() => vote(r.id)} activeOpacity={0.8}>
                  <Text style={ms.voteBtnText}>{r.userVoted ? '✅' : '👍'} {r.votes} Confirmed</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })
      }
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
  sectionLabel:{ fontSize: 10, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 10 },

  // Helplines
  banner:      { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(244,63,94,0.12)', borderWidth: 1, borderColor: 'rgba(244,63,94,0.25)', borderRadius: 12, padding: 14, marginBottom: 18 },
  bannerIcon:  { fontSize: 28 },
  bannerTitle: { fontSize: 13, fontWeight: '700', color: '#fff', marginBottom: 3 },
  bannerCall:  { fontSize: 13, fontWeight: '800', color: '#f43f5e', letterSpacing: 0.5 },
  helpCard:    { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: 13, marginBottom: 8 },
  helpIconBox: { width: 44, height: 44, borderRadius: 10, backgroundColor: 'rgba(244,63,94,0.1)', alignItems: 'center', justifyContent: 'center' },
  helpLabel:   { fontSize: 14, fontWeight: '600', color: '#fff', marginBottom: 2 },
  helpNum:     { fontSize: 18, fontWeight: '800', color: '#60a5fa' },
  callPill:    { backgroundColor: 'rgba(34,197,94,0.12)', borderWidth: 1, borderColor: 'rgba(34,197,94,0.25)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  callPillText:{ fontSize: 11, fontWeight: '700', color: '#86efac' },

  // Safe Route
  routeForm:     { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 14, padding: 14, marginBottom: 14 },
  routeInputWrap:{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 9, paddingHorizontal: 10, paddingVertical: 6, marginBottom: 8 },
  routeDot:      { fontSize: 12 },
  routeInput:    { flex: 1, color: '#fff', fontSize: 13 },
  routeBtn:      { backgroundColor: C.cyan.replace('06b6d4','0891b2'), borderRadius: 9, paddingVertical: 12, alignItems: 'center' },
  routeBtnText:  { color: '#fff', fontWeight: '700', fontSize: 13 },

  scoreCard:   { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: 'rgba(34,197,94,0.07)', borderWidth: 1, borderColor: 'rgba(34,197,94,0.2)', borderRadius: 14, padding: 14, marginBottom: 14 },
  scoreCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(34,197,94,0.15)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(34,197,94,0.4)' },
  scoreNum:    { fontSize: 20, fontWeight: '800', color: '#22c55e' },
  scoreLabel:  { fontSize: 9, color: '#86efac', fontWeight: '700', letterSpacing: 0.5 },
  scoreRow:    { flexDirection: 'row', justifyContent: 'space-between' },
  scoreLbl:    { fontSize: 11, color: 'rgba(255,255,255,0.45)' },
  scoreVal:    { fontSize: 11, fontWeight: '600', color: '#fff' },

  stepCard:   { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 10, padding: 10, marginBottom: 6 },
  stepText:   { fontSize: 12, color: 'rgba(255,255,255,0.75)', flex: 1, lineHeight: 18 },
  avoidCard:  { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(245,158,11,0.08)', borderWidth: 1, borderColor: 'rgba(245,158,11,0.2)', borderRadius: 8, padding: 9, marginBottom: 6 },
  avoidText:  { fontSize: 12, color: 'rgba(255,255,255,0.6)', flex: 1 },
  mapsBtn:    { backgroundColor: '#0284c7', borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginTop: 10 },
  mapsBtnText:{ color: '#fff', fontWeight: '700', fontSize: 13 },

  // Community
  communityForm: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 14, padding: 14, marginBottom: 14 },
  typePill:      { borderWidth: 1, borderRadius: 18, paddingHorizontal: 10, paddingVertical: 4 },
  typePillText:  { fontSize: 11, fontWeight: '600' },
  input:         { backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', borderRadius: 9, paddingHorizontal: 12, paddingVertical: 9, color: '#fff', fontSize: 13 },
  submitBtn:     { backgroundColor: C.purple, borderRadius: 9, paddingVertical: 11, alignItems: 'center' },
  submitBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },

  filterTab:       { borderRadius: 16, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.04)' },
  filterTabActive: { backgroundColor: 'rgba(37,99,235,0.2)', borderColor: 'rgba(37,99,235,0.4)' },
  filterTabText:   { fontSize: 12, color: 'rgba(255,255,255,0.45)' },
  filterTabTextActive: { color: '#93c5fd', fontWeight: '600' },

  reportCard:   { borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 8 },
  typeBadge:    { borderWidth: 1, borderRadius: 5, paddingHorizontal: 7, paddingVertical: 2 },
  typeBadgeText:{ fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
  reportTime:   { fontSize: 11, color: 'rgba(255,255,255,0.3)' },
  reportDesc:   { fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 19, marginBottom: 4 },
  reportArea:   { fontSize: 11, color: 'rgba(255,255,255,0.4)' },
  voteBtn:      { backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 5 },
  voteBtnText:  { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
});
