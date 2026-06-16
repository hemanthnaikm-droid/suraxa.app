import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Modal, SafeAreaView,
} from 'react-native';
import { C, INIT_NOTIFS } from '../utils/theme';
import { fbAuth, signOut, db, collection, getDocs, onAuthStateChanged } from '../utils/firebase';
import { SOSModule }        from '../modules/SOSModule';
import { LocationModule }   from '../modules/LocationModule';
import { AIModule }         from '../modules/AIModule';
import { VoiceModule }      from '../modules/VoiceModule';
import { ContactsModule }   from '../modules/ContactsModule';
import { HelplinesModule, SafeRouteModule, CommunityModule } from '../modules/OtherModules';
import { ToastContainer, useToast } from '../components/UI';

const FEATURES = [
  { id: 'sos',       icon: '🆘', label: 'SOS Alert',       sub: 'Instant emergency alert', color: C.red,    glyph: '🚨' },
  { id: 'location',  icon: '📍', label: 'Live Location',   sub: 'Real GPS sharing',        color: C.cyan,   glyph: '🛰️' },
  { id: 'ai',        icon: '🤖', label: 'Suraksha AI',     sub: 'Claude safety assistant', color: C.purple, glyph: '💬' },
  { id: 'contacts',  icon: '👥', label: 'Contacts',        sub: 'Firebase synced',         color: C.blue,   glyph: '📋' },
  { id: 'helplines', icon: '📞', label: 'Helplines',       sub: 'India emergency numbers', color: '#f97316',glyph: '📲' },
  { id: 'voice',     icon: '🎙️', label: 'Voice Recorder', sub: 'Audio evidence',          color: C.green,  glyph: '🎵' },
  { id: 'route',     icon: '🗺️', label: 'Safe Route',     sub: 'AI-verified path',        color: '#0ea5e9',glyph: '🛣️' },
  { id: 'community', icon: '👥', label: 'Community',       sub: 'Safety reports',          color: '#a855f7',glyph: '📢' },
];

export function DashboardScreen({ user, addToast: parentToast }) {
  const { toasts, addToast } = useToast();
  const [active, setActive]   = useState(null);
  const [contacts, setContacts] = useState([]);
  const [notifs, setNotifs]   = useState(INIT_NOTIFS);
  const [showNotifs, setShowNotifs] = useState(false);
  const [routeInitLoc, setRouteInitLoc] = useState(null);
  const unread = notifs.filter(n => !n.read).length;

  // Load contacts from Firebase
  useEffect(() => {
    const uid = user?.uid;
    if (!uid) return;
    getDocs(collection(db, 'users', uid, 'contacts')).then(snap => {
      setContacts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }).catch(() => {});
  }, [user]);

  const openModule = (id) => setActive(id);
  const closeModule = () => { setActive(null); setRouteInitLoc(null); };

  const openRouteFromLoc = (loc) => {
    setRouteInitLoc(loc);
    setActive('route');
  };

  const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, read: true })));

  const renderModule = () => {
    const props = { contacts, setContacts, addToast, onClose: closeModule };
    switch (active) {
      case 'sos':       return <SOSModule {...props} />;
      case 'location':  return <LocationModule {...props} onOpenRoute={openRouteFromLoc} />;
      case 'ai':        return <AIModule onClose={closeModule} />;
      case 'contacts':  return <ContactsModule {...props} />;
      case 'helplines': return <HelplinesModule onClose={closeModule} addToast={addToast} />;
      case 'voice':     return <VoiceModule {...props} />;
      case 'route':     return <SafeRouteModule initialLoc={routeInitLoc} addToast={addToast} onClose={closeModule} />;
      case 'community': return <CommunityModule addToast={addToast} onClose={closeModule} />;
      default: return null;
    }
  };

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';

  return (
    <SafeAreaView style={ds.safeArea}>
      {/* Top Nav */}
      <View style={ds.navbar}>
        <View style={ds.navLogo}>
          <Text style={ds.navLogoText}>🛡️ Suraksha</Text>
          <View style={ds.navBadge}><Text style={ds.navBadgeText}>PROTECTED</Text></View>
        </View>
        <View style={ds.navRight}>
          {/* Notifications */}
          <TouchableOpacity style={ds.navBtn} onPress={() => setShowNotifs(true)}>
            <Text style={{ fontSize: 18 }}>🔔</Text>
            {unread > 0 && (
              <View style={ds.nBadge}><Text style={ds.nBadgeText}>{unread}</Text></View>
            )}
          </TouchableOpacity>
          {/* Sign Out */}
          <TouchableOpacity style={ds.navBtn} onPress={() => signOut(fbAuth)}>
            <Text style={{ fontSize: 16 }}>🚪</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={ds.scroll} contentContainerStyle={ds.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Welcome */}
        <View style={ds.welcomeCard}>
          <View style={ds.wcLeft}>
            <Text style={ds.wcHello}>Hello, {displayName.split(' ')[0]} 👋</Text>
            <Text style={ds.wcSub}>Your safety shield is active</Text>
          </View>
          <View style={ds.wcStatus}>
            <View style={ds.wcDot} />
            <Text style={ds.wcStatusText}>SAFE</Text>
          </View>
        </View>

        {/* Quick SOS */}
        <TouchableOpacity style={ds.quickSOS} onPress={() => openModule('sos')} activeOpacity={0.85}>
          <View style={ds.sosInner}>
            <Text style={{ fontSize: 28 }}>🆘</Text>
            <View>
              <Text style={ds.sosTitle}>SOS EMERGENCY</Text>
              <Text style={ds.sosSub}>Tap to alert all contacts</Text>
            </View>
          </View>
          <Text style={ds.sosArrow}>→</Text>
        </TouchableOpacity>

        {/* Stats */}
        <View style={ds.statsRow}>
          {[['👥', contacts.length.toString(), 'Contacts'], ['🛡️', '24/7', 'Protection'], ['🔥', 'Live', 'GPS Ready'], ['🤖', 'AI', 'Active']].map(([icon, val, lbl]) => (
            <View key={lbl} style={ds.statCard}>
              <Text style={{ fontSize: 18, marginBottom: 2 }}>{icon}</Text>
              <Text style={ds.statVal}>{val}</Text>
              <Text style={ds.statLbl}>{lbl}</Text>
            </View>
          ))}
        </View>

        {/* Feature Grid */}
        <Text style={ds.gridLabel}>SAFETY FEATURES</Text>
        <View style={ds.grid}>
          {FEATURES.map(f => (
            <TouchableOpacity key={f.id} style={ds.featCard} onPress={() => openModule(f.id)} activeOpacity={0.8}>
              <View style={[ds.featIconBox, { backgroundColor: f.color + '22' }]}>
                <Text style={{ fontSize: 24 }}>{f.icon}</Text>
              </View>
              <Text style={ds.featLabel}>{f.label}</Text>
              <Text style={ds.featSub}>{f.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Safety tip */}
        <View style={ds.tipCard}>
          <Text style={ds.tipTitle}>💡 Safety Tip of the Day</Text>
          <Text style={ds.tipText}>Always share your live location with a trusted contact before travelling alone at night. Use the Live Location feature to do this instantly.</Text>
        </View>
      </ScrollView>

      {/* Module Modal */}
      <Modal visible={!!active} animationType="slide" transparent onRequestClose={closeModule}>
        <View style={ds.moduleModal}>
          <View style={ds.moduleHandle} />
          {renderModule()}
        </View>
      </Modal>

      {/* Notifications Modal */}
      <Modal visible={showNotifs} animationType="slide" transparent onRequestClose={() => setShowNotifs(false)}>
        <View style={ds.moduleModal}>
          <View style={ds.moduleHandle} />
          <View style={ds.nHeader}>
            <Text style={ds.nTitle}>Notifications</Text>
            <TouchableOpacity onPress={markAllRead}><Text style={ds.nMarkAll}>Mark all read</Text></TouchableOpacity>
            <TouchableOpacity style={ds.closeBtn} onPress={() => setShowNotifs(false)}>
              <Text style={{ color: '#fff', fontSize: 16 }}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ padding: 18, gap: 8 }}>
            {notifs.map(n => (
              <View key={n.id} style={[ds.notifCard, !n.read && ds.notifUnread]}>
                <View style={{ flex: 1 }}>
                  <Text style={ds.notifTitle}>{n.title}</Text>
                  <Text style={ds.notifBody}>{n.body}</Text>
                  <Text style={ds.notifTime}>{n.time}</Text>
                </View>
                {!n.read && <View style={ds.unreadDot} />}
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>

      <ToastContainer toasts={toasts} />
    </SafeAreaView>
  );
}

const ds = StyleSheet.create({
  safeArea:  { flex: 1, backgroundColor: C.bg },

  navbar:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.07)' },
  navLogo:      { flexDirection: 'row', alignItems: 'center', gap: 8 },
  navLogoText:  { fontSize: 18, fontWeight: '800', color: '#fff' },
  navBadge:     { backgroundColor: 'rgba(34,197,94,0.15)', borderWidth: 1, borderColor: 'rgba(34,197,94,0.3)', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  navBadgeText: { fontSize: 9, fontWeight: '700', color: '#86efac', letterSpacing: 0.5 },
  navRight:     { flexDirection: 'row', gap: 6 },
  navBtn:       { width: 36, height: 36, borderRadius: 9, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center' },
  nBadge:       { position: 'absolute', top: -2, right: -2, width: 14, height: 14, borderRadius: 7, backgroundColor: C.red, alignItems: 'center', justifyContent: 'center' },
  nBadgeText:   { fontSize: 8, fontWeight: '800', color: '#fff' },

  scroll:        { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40, gap: 12 },

  welcomeCard: { backgroundColor: 'rgba(37,99,235,0.12)', borderWidth: 1, borderColor: 'rgba(37,99,235,0.25)', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  wcLeft:      { flex: 1 },
  wcHello:     { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 2 },
  wcSub:       { fontSize: 12, color: 'rgba(255,255,255,0.45)' },
  wcStatus:    { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(34,197,94,0.12)', borderWidth: 1, borderColor: 'rgba(34,197,94,0.25)', borderRadius: 8, paddingHorizontal: 9, paddingVertical: 5 },
  wcDot:       { width: 6, height: 6, borderRadius: 3, backgroundColor: '#22c55e' },
  wcStatusText:{ fontSize: 11, fontWeight: '700', color: '#86efac' },

  quickSOS:  { backgroundColor: 'rgba(220,38,38,0.12)', borderWidth: 1.5, borderColor: 'rgba(220,38,38,0.3)', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sosInner:  { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sosTitle:  { fontSize: 16, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
  sosSub:    { fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2 },
  sosArrow:  { fontSize: 22, color: 'rgba(220,38,38,0.8)' },

  statsRow: { flexDirection: 'row', gap: 8 },
  statCard: { flex: 1, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 12, padding: 10, alignItems: 'center' },
  statVal:  { fontSize: 16, fontWeight: '800', color: '#fff' },
  statLbl:  { fontSize: 9, color: 'rgba(255,255,255,0.35)', marginTop: 1 },

  gridLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' },
  grid:      { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  featCard:  { width: '47.5%', backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 14, padding: 13 },
  featIconBox:{ width: 46, height: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  featLabel: { fontSize: 13, fontWeight: '700', color: '#fff', marginBottom: 2 },
  featSub:   { fontSize: 11, color: 'rgba(255,255,255,0.38)', lineHeight: 16 },

  tipCard:  { backgroundColor: 'rgba(245,158,11,0.08)', borderWidth: 1, borderColor: 'rgba(245,158,11,0.2)', borderRadius: 12, padding: 14 },
  tipTitle: { fontSize: 13, fontWeight: '700', color: '#fbbf24', marginBottom: 5 },
  tipText:  { fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 19 },

  moduleModal: { flex: 1, backgroundColor: C.bg, marginTop: 60, borderTopLeftRadius: 20, borderTopRightRadius: 20, borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  moduleHandle:{ width: 36, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'center', marginTop: 10, marginBottom: 4 },

  nHeader:  { flexDirection: 'row', alignItems: 'center', padding: 18, paddingBottom: 10, gap: 8 },
  nTitle:   { fontSize: 18, fontWeight: '700', color: '#fff', flex: 1 },
  nMarkAll: { fontSize: 12, color: '#60a5fa' },
  closeBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },

  notifCard:   { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 8 },
  notifUnread: { borderColor: 'rgba(37,99,235,0.3)', backgroundColor: 'rgba(37,99,235,0.07)' },
  notifTitle:  { fontSize: 13, fontWeight: '700', color: '#fff', marginBottom: 2 },
  notifBody:   { fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 18, marginBottom: 4 },
  notifTime:   { fontSize: 10, color: 'rgba(255,255,255,0.28)' },
  unreadDot:   { width: 8, height: 8, borderRadius: 4, backgroundColor: C.blue },
});
