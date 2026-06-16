import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { C } from '../utils/theme';
import { Spinner } from '../components/UI';
import { callClaudeAI } from '../utils/ai';

const INIT_AI = [{
  role: 'bot',
  text: "Hello! I'm Suraksha AI 🛡️\n\nI'm powered by Claude (Anthropic) to provide expert safety guidance. Ask me about:\n• Being followed or feeling unsafe\n• Harassment or assault situations\n• Safe routes and night travel\n• Emergency helplines\n• How to use Suraksha features\n\nWhat can I help you with today?",
}];

const QUICK = ['I think I\'m being followed', 'I feel unsafe right now', 'Emergency helpline numbers', 'Safe route home at night'];

export function AIModule({ onClose }) {
  const [msgs, setMsgs]   = useState(INIT_AI);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [msgs, typing]);

  const send = async (text) => {
    const t = (text || input).trim();
    if (!t || typing) return;
    setInput('');
    const next = [...msgs, { role: 'user', text: t }];
    setMsgs(next);
    setTyping(true);
    const reply = await callClaudeAI(next);
    setMsgs(m => [...m, { role: 'bot', text: reply }]);
    setTyping(false);
  };

  return (
    <KeyboardAvoidingView style={ms.wrap} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
      <View style={ms.header}>
        <View style={[ms.headerIcon, { backgroundColor: 'rgba(124,58,237,0.2)' }]}>
          <Text style={{ fontSize: 22 }}>🤖</Text>
        </View>
        <View>
          <Text style={ms.headerTitle}>Suraksha AI</Text>
          <Text style={ms.headerSub}>Powered by Claude · Safety guidance</Text>
        </View>
        <TouchableOpacity style={ms.closeBtn} onPress={onClose}>
          <Text style={{ color: '#fff', fontSize: 16 }}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Quick prompts */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={ms.quickScroll} contentContainerStyle={{ gap: 6, paddingHorizontal: 18 }}>
        {QUICK.map(q => (
          <TouchableOpacity key={q} style={ms.quickBtn} onPress={() => send(q)} activeOpacity={0.75}>
            <Text style={ms.quickBtnText}>{q}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Messages */}
      <ScrollView ref={scrollRef} style={ms.msgs} contentContainerStyle={{ padding: 14, gap: 10 }} showsVerticalScrollIndicator={false}>
        {msgs.map((m, i) => (
          <View key={i} style={[ms.msgRow, m.role === 'user' && ms.msgRowUser]}>
            <View style={[ms.avatar, m.role === 'bot' ? ms.avatarBot : ms.avatarUser]}>
              <Text style={{ fontSize: 11 }}>{m.role === 'bot' ? '🤖' : '👤'}</Text>
            </View>
            <View style={[ms.bubble, m.role === 'bot' ? ms.bubbleBot : ms.bubbleUser]}>
              <Text style={ms.bubbleText}>{m.text}</Text>
            </View>
          </View>
        ))}

        {typing && (
          <View style={ms.msgRow}>
            <View style={[ms.avatar, ms.avatarBot]}>
              <Text style={{ fontSize: 11 }}>🤖</Text>
            </View>
            <View style={[ms.bubble, ms.bubbleBot, { paddingVertical: 14 }]}>
              <View style={{ flexDirection: 'row', gap: 4 }}>
                {[0, 1, 2].map(i => (
                  <View key={i} style={ms.typingDot} />
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <View style={ms.inputRow}>
        <TextInput
          style={ms.input}
          placeholder="Ask about safety…"
          placeholderTextColor="rgba(255,255,255,0.25)"
          value={input}
          onChangeText={setInput}
          multiline
          onSubmitEditing={() => send()}
        />
        <TouchableOpacity style={ms.sendBtn} onPress={() => send()} disabled={!input.trim() || typing} activeOpacity={0.8}>
          {typing ? <Spinner size="small" /> : <Text style={{ fontSize: 18 }}>➤</Text>}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const ms = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: C.bg },

  header:      { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 18, paddingBottom: 10 },
  headerIcon:  { width: 46, height: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  headerSub:   { fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 },
  closeBtn:    { marginLeft: 'auto', width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },

  quickScroll: { flexGrow: 0, marginBottom: 8 },
  quickBtn:    { backgroundColor: 'rgba(124,58,237,0.15)', borderWidth: 1, borderColor: 'rgba(124,58,237,0.3)', borderRadius: 18, paddingHorizontal: 12, paddingVertical: 6 },
  quickBtnText:{ fontSize: 12, color: 'rgba(255,255,255,0.75)' },

  msgs: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' },

  msgRow:     { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  msgRowUser: { flexDirection: 'row-reverse' },
  avatar:     { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 },
  avatarBot:  { backgroundColor: C.purple },
  avatarUser: { backgroundColor: C.blue },
  bubble:     { maxWidth: '80%', padding: 10, borderRadius: 12 },
  bubbleBot:  { backgroundColor: 'rgba(255,255,255,0.07)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderTopLeftRadius: 4 },
  bubbleUser: { backgroundColor: 'rgba(37,99,235,0.25)', borderWidth: 1, borderColor: 'rgba(37,99,235,0.35)', borderTopRightRadius: 4 },
  bubbleText: { fontSize: 13, color: 'rgba(255,255,255,0.92)', lineHeight: 20 },

  typingDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.4)' },

  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, padding: 14, paddingTop: 10, borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  input:    { flex: 1, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', borderRadius: 12, paddingHorizontal: 13, paddingVertical: 10, color: '#fff', fontSize: 14, maxHeight: 100 },
  sendBtn:  { width: 44, height: 44, borderRadius: 12, backgroundColor: C.purple, alignItems: 'center', justifyContent: 'center', shadowColor: C.purple, shadowOpacity: 0.4, shadowRadius: 8, elevation: 4 },
});
