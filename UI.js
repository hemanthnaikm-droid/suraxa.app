import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, Linking, Modal, KeyboardAvoidingView, Platform,
} from 'react-native';
import { C } from '../utils/theme';
import { Spinner, Divider, Hint, EmptyState } from '../components/UI';
import {
  db, fbAuth, collection, addDoc, deleteDoc, doc, serverTimestamp,
} from '../utils/firebase';

export function ContactsModule({ contacts, setContacts, addToast, onClose }) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName]         = useState('');
  const [phone, setPhone]       = useState('');
  const [rel, setRel]           = useState('');
  const [saving, setSaving]     = useState(false);

  const saveContact = async () => {
    if (!name.trim() || !phone.trim()) {
      addToast('⚠️ Missing Info', 'Name and phone are required.', 'error'); return;
    }
    if (contacts.length >= 5) {
      addToast('⚠️ Limit Reached', 'Maximum 5 emergency contacts allowed.', 'error'); return;
    }
    setSaving(true);
    try {
      const uid = fbAuth.currentUser?.uid;
      const docRef = await addDoc(collection(db, 'users', uid, 'contacts'), {
        name: name.trim(), phone: phone.trim(), relationship: rel.trim() || 'Contact',
        createdAt: serverTimestamp(),
      });
      setContacts(c => [...c, { id: docRef.id, name: name.trim(), phone: phone.trim(), relationship: rel.trim() || 'Contact' }]);
      addToast('✅ Contact Added', `${name.trim()} saved to Firebase.`, 'success');
      setName(''); setPhone(''); setRel(''); setShowForm(false);
    } catch {
      addToast('⚠️ Error', 'Could not save contact. Check connection.', 'error');
    }
    setSaving(false);
  };

  const deleteContact = async (id, cname) => {
    try {
      const uid = fbAuth.currentUser?.uid;
      await deleteDoc(doc(db, 'users', uid, 'contacts', id));
      setContacts(c => c.filter(x => x.id !== id));
      addToast('🗑️ Removed', `${cname} removed from contacts.`, 'info');
    } catch {
      addToast('⚠️ Error', 'Could not remove contact.', 'error');
    }
  };

  const COLORS = [C.blue, C.cyan, C.purple, C.amber, C.green];
  const initials = (n) => n.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <ScrollView style={ms.wrap} contentContainerStyle={ms.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={ms.header}>
        <View style={[ms.headerIcon, { backgroundColor: 'rgba(37,99,235,0.2)' }]}>
          <Text style={{ fontSize: 22 }}>👥</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={ms.headerTitle}>Emergency Contacts</Text>
          <Text style={ms.headerSub}>Firebase synced · {contacts.length}/5 contacts</Text>
        </View>
        <TouchableOpacity style={ms.closeBtn} onPress={onClose}>
          <Text style={{ color: '#fff', fontSize: 16 }}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Add button */}
      {contacts.length < 5 && !showForm && (
        <TouchableOpacity style={ms.addBtn} onPress={() => setShowForm(true)} activeOpacity={0.85}>
          <Text style={ms.addBtnText}>+ Add Emergency Contact</Text>
        </TouchableOpacity>
      )}

      {/* Form */}
      {showForm && (
        <View style={ms.formCard}>
          <Text style={ms.formTitle}>New Emergency Contact</Text>
          {[
            { label: 'Full Name *', val: name, set: setName, placeholder: 'e.g. Priya Sharma', kb: 'default', cap: 'words' },
            { label: 'Phone Number *', val: phone, set: setPhone, placeholder: '+91 98765 43210', kb: 'phone-pad', cap: 'none' },
            { label: 'Relationship', val: rel, set: setRel, placeholder: 'Mother, Friend, Sister…', kb: 'default', cap: 'words' },
          ].map(f => (
            <View key={f.label} style={{ marginBottom: 12 }}>
              <Text style={ms.label}>{f.label}</Text>
              <TextInput
                style={ms.input}
                placeholder={f.placeholder}
                placeholderTextColor="rgba(255,255,255,0.25)"
                value={f.val}
                onChangeText={f.set}
                keyboardType={f.kb}
                autoCapitalize={f.cap}
              />
            </View>
          ))}
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity style={[ms.formBtn, { flex: 1, backgroundColor: C.blue }]} onPress={saveContact} disabled={saving} activeOpacity={0.85}>
              {saving ? <Spinner /> : <Text style={ms.formBtnText}>Save Contact</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={[ms.formBtn, { flex: 1, backgroundColor: 'rgba(255,255,255,0.08)' }]} onPress={() => setShowForm(false)} activeOpacity={0.8}>
              <Text style={ms.formBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Divider />

      {/* Contacts list */}
      <Text style={ms.sectionLabel}>YOUR CONTACTS ({contacts.length})</Text>

      {contacts.length === 0
        ? <EmptyState icon="👥" text="No contacts yet" sub="Add up to 5 trusted people who'll be alerted in an emergency" />
        : contacts.map((c, i) => (
          <View key={c.id} style={ms.contactCard}>
            <View style={[ms.avatar, { backgroundColor: COLORS[i % COLORS.length] + '33', borderColor: COLORS[i % COLORS.length] + '55' }]}>
              <Text style={[ms.avatarText, { color: COLORS[i % COLORS.length] }]}>{initials(c.name)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={ms.cName}>{c.name}</Text>
              <Text style={ms.cPhone}>{c.phone}</Text>
              {c.relationship ? <Text style={ms.cRel}>{c.relationship}</Text> : null}
            </View>
            <TouchableOpacity style={ms.callBtn} onPress={() => Linking.openURL(`tel:${c.phone}`)} activeOpacity={0.8}>
              <Text style={{ fontSize: 16 }}>📞</Text>
            </TouchableOpacity>
            <TouchableOpacity style={ms.callBtn} onPress={() => deleteContact(c.id, c.name)} activeOpacity={0.8}>
              <Text style={{ fontSize: 16 }}>🗑️</Text>
            </TouchableOpacity>
          </View>
        ))
      }

      <Hint>Tap 📞 to call directly. Contacts are saved to Firebase and restored on every login.</Hint>
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

  addBtn:     { backgroundColor: C.blue, borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginBottom: 10, shadowColor: C.blue, shadowOpacity: 0.35, shadowRadius: 8, elevation: 4 },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  formCard:  { backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 14, padding: 14, marginBottom: 10 },
  formTitle: { fontSize: 14, fontWeight: '700', color: '#fff', marginBottom: 14 },
  label:     { fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 5, fontWeight: '500' },
  input:     { backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', borderRadius: 9, paddingHorizontal: 12, paddingVertical: 10, color: '#fff', fontSize: 14 },
  formBtn:   { borderRadius: 9, paddingVertical: 11, alignItems: 'center' },
  formBtnText:{ color: '#fff', fontWeight: '700', fontSize: 13 },

  sectionLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 10 },

  contactCard: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: 12, marginBottom: 8 },
  avatar:      { width: 42, height: 42, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  avatarText:  { fontSize: 14, fontWeight: '800' },
  cName:       { fontSize: 14, fontWeight: '700', color: '#fff', marginBottom: 2 },
  cPhone:      { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 1 },
  cRel:        { fontSize: 10, color: 'rgba(255,255,255,0.3)' },
  callBtn:     { width: 36, height: 36, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center' },
});
