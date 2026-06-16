import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
} from 'react-native';
import { Audio } from 'expo-av';
import { C } from '../utils/theme';
import { Divider, Hint } from '../components/UI';

export function VoiceModule({ addToast, onClose }) {
  const [state, setState]       = useState('idle'); // idle | recording | stopped
  const [seconds, setSeconds]   = useState(0);
  const [recordings, setRecs]   = useState([]);
  const recordingRef            = useRef(null);
  const timerRef                = useRef(null);

  const startRec = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        addToast('⚠️ Permission Denied', 'Allow microphone access in Settings.', 'error');
        return;
      }
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recordingRef.current = recording;
      setState('recording');
      setSeconds(0);
      timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    } catch {
      addToast('⚠️ Error', 'Could not start recording.', 'error');
    }
  };

  const stopRec = async () => {
    clearInterval(timerRef.current);
    try {
      await recordingRef.current?.stopAndUnloadAsync();
      const uri = recordingRef.current?.getURI();
      const dur = seconds;
      setState('stopped');
      const newRec = {
        id: Date.now(),
        uri,
        duration: dur,
        name: `Evidence_${new Date().toLocaleTimeString().replace(/:/g, '-')}.m4a`,
        time: new Date().toLocaleTimeString(),
      };
      setRecs(r => [newRec, ...r]);
      addToast('🎙️ Recording Saved', `${formatTime(dur)} of audio evidence captured.`, 'success');
      setState('idle');
      setSeconds(0);
    } catch {
      addToast('⚠️ Error', 'Could not stop recording.', 'error');
      setState('idle');
    }
  };

  const playRec = async (rec) => {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: rec.uri });
      await sound.playAsync();
      addToast('▶️ Playing', rec.name, 'info');
    } catch {
      addToast('⚠️ Playback Error', 'Could not play this recording.', 'error');
    }
  };

  const deleteRec = (id) => {
    setRecs(r => r.filter(x => x.id !== id));
    addToast('🗑️ Deleted', 'Recording removed.', 'info');
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <ScrollView style={ms.wrap} contentContainerStyle={ms.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={ms.header}>
        <View style={[ms.headerIcon, { backgroundColor: 'rgba(34,197,94,0.2)' }]}>
          <Text style={{ fontSize: 22 }}>🎙️</Text>
        </View>
        <View>
          <Text style={ms.headerTitle}>Voice Recorder</Text>
          <Text style={ms.headerSub}>Capture audio evidence secretly</Text>
        </View>
        <TouchableOpacity style={ms.closeBtn} onPress={onClose}>
          <Text style={{ color: '#fff', fontSize: 16 }}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Recording area */}
      <View style={ms.recBox}>
        <View style={[ms.recCircle, state === 'recording' && ms.recCircleActive]}>
          <Text style={{ fontSize: 36 }}>{state === 'recording' ? '⏺' : '🎙️'}</Text>
        </View>
        {state === 'recording' ? (
          <>
            <View style={ms.liveRow}>
              <View style={ms.liveDot} />
              <Text style={ms.liveText}>RECORDING</Text>
            </View>
            <Text style={ms.timer}>{formatTime(seconds)}</Text>
          </>
        ) : (
          <Text style={ms.recIdle}>Ready to record</Text>
        )}

        {state === 'recording' ? (
          <TouchableOpacity style={ms.stopBtn} onPress={stopRec} activeOpacity={0.8}>
            <Text style={ms.stopBtnText}>⏹ Stop Recording</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={ms.startBtn} onPress={startRec} activeOpacity={0.85}>
            <Text style={ms.startBtnText}>⏺ Start Recording</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tips */}
      <View style={ms.tipsBox}>
        {['Recording saves automatically to app storage', 'Use as evidence — timestamped & preserved', 'Keep phone in pocket — mic still works'].map(t => (
          <View key={t} style={ms.tipRow}>
            <Text style={ms.tipDot}>•</Text>
            <Text style={ms.tipText}>{t}</Text>
          </View>
        ))}
      </View>

      <Divider />

      {/* Saved recordings */}
      <Text style={ms.sectionLabel}>SAVED RECORDINGS ({recordings.length})</Text>
      {recordings.length === 0 ? (
        <View style={ms.emptyWrap}>
          <Text style={ms.emptyIcon}>🎙️</Text>
          <Text style={ms.emptyText}>No recordings yet</Text>
          <Text style={ms.emptySub}>Start recording to capture evidence</Text>
        </View>
      ) : (
        recordings.map(r => (
          <View key={r.id} style={ms.recItem}>
            <View style={ms.recItemIcon}>
              <Text style={{ fontSize: 18 }}>🎵</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={ms.recName}>{r.name}</Text>
              <Text style={ms.recMeta}>{formatTime(r.duration)} · {r.time}</Text>
            </View>
            <TouchableOpacity style={ms.recBtn} onPress={() => playRec(r)}>
              <Text style={{ fontSize: 16 }}>▶️</Text>
            </TouchableOpacity>
            <TouchableOpacity style={ms.recBtn} onPress={() => deleteRec(r.id)}>
              <Text style={{ fontSize: 16 }}>🗑️</Text>
            </TouchableOpacity>
          </View>
        ))
      )}

      <Hint>Recordings stored locally on device. Share as evidence via WhatsApp or email from your file manager.</Hint>
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

  recBox:        { alignItems: 'center', backgroundColor: 'rgba(34,197,94,0.05)', borderWidth: 1, borderColor: 'rgba(34,197,94,0.15)', borderRadius: 16, padding: 24, marginBottom: 14 },
  recCircle:     { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(34,197,94,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 12, borderWidth: 2, borderColor: 'rgba(34,197,94,0.2)' },
  recCircleActive:{ borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.2)' },
  liveRow:       { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  liveDot:       { width: 8, height: 8, borderRadius: 4, backgroundColor: '#f43f5e' },
  liveText:      { fontSize: 11, fontWeight: '700', color: '#f43f5e', letterSpacing: 1 },
  timer:         { fontSize: 40, fontWeight: '800', color: '#22c55e', marginBottom: 16 },
  recIdle:       { fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 16 },
  startBtn:      { backgroundColor: '#16a34a', borderRadius: 10, paddingVertical: 11, paddingHorizontal: 28, shadowColor: '#22c55e', shadowOpacity: 0.4, shadowRadius: 8, elevation: 4 },
  startBtnText:  { color: '#fff', fontWeight: '700', fontSize: 14 },
  stopBtn:       { backgroundColor: '#dc2626', borderRadius: 10, paddingVertical: 11, paddingHorizontal: 28 },
  stopBtnText:   { color: '#fff', fontWeight: '700', fontSize: 14 },

  tipsBox:  { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 12, padding: 12, marginBottom: 14 },
  tipRow:   { flexDirection: 'row', gap: 6, marginBottom: 5 },
  tipDot:   { color: '#22c55e', fontWeight: '700' },
  tipText:  { fontSize: 12, color: 'rgba(255,255,255,0.5)', flex: 1 },

  sectionLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 10 },
  emptyWrap:    { alignItems: 'center', paddingVertical: 24 },
  emptyIcon:    { fontSize: 32, opacity: 0.3, marginBottom: 6 },
  emptyText:    { color: 'rgba(255,255,255,0.4)', fontSize: 13 },
  emptySub:     { color: 'rgba(255,255,255,0.22)', fontSize: 11, marginTop: 4 },

  recItem:     { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 10, padding: 10, marginBottom: 8 },
  recItemIcon: { width: 38, height: 38, borderRadius: 10, backgroundColor: 'rgba(34,197,94,0.1)', alignItems: 'center', justifyContent: 'center' },
  recName:     { fontSize: 12, fontWeight: '600', color: '#fff', marginBottom: 2 },
  recMeta:     { fontSize: 11, color: 'rgba(255,255,255,0.38)' },
  recBtn:      { width: 34, height: 34, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center' },
});
