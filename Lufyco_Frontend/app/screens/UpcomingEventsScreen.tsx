import React, { useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Modal, TextInput, ScrollView, Platform, StatusBar, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { useTheme } from "../context/ThemeContext";
import { useEventsStore, EventCard } from "../store/useEventsStore";

type Props = NativeStackScreenProps<RootStackParamList, "UpcomingEvents">;



const UpcomingEventsScreen: React.FC<Props> = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const { events, addEvent, updateEvent, deleteEvent } = useEventsStore();

  // Edit modal state
  const [editVisible, setEditVisible] = useState(false);
  const [editTarget, setEditTarget] = useState<EventCard | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");

  // Add modal state
  const [addVisible, setAddVisible] = useState(false);
  const [addTitle, setAddTitle] = useState("");
  const [addDate, setAddDate] = useState("");
  const [addTime, setAddTime] = useState("");

  const openEdit = (event: EventCard) => {
    setEditTarget(event);
    setEditTitle(event.title);
    setEditDate(event.dateLine);
    setEditTime(event.time);
    setEditVisible(true);
  };

  const saveEdit = () => {
    if (!editTarget) return;
    if (!editTitle.trim()) { Alert.alert("Required", "Event title cannot be empty."); return; }
    updateEvent(editTarget.id, {
      title: editTitle,
      dateLine: editDate,
      time: editTime
    });
    setEditVisible(false);
  };

  const saveAdd = () => {
    if (!addTitle.trim()) { Alert.alert("Required", "Event title cannot be empty."); return; }
    addEvent({
      title: addTitle,
      dateLine: addDate || "TBD",
      time: addTime || "TBD",
      outfit: [],
    });
    setAddTitle(""); setAddDate(""); setAddTime("");
    setAddVisible(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert("Delete Event", "Remove this event?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteEvent(id) }
    ]);
  };

  const inputStyle = [styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.hBtn}>
          <Feather name="arrow-left" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Upcoming Events</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Events */}
      <FlatList
        data={events}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 16, paddingTop: 12 }}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="calendar" size={48} color={colors.textMuted} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No upcoming events yet</Text>
            <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>Tap + to add your first event</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: isDark ? colors.card : "#D9D9D9" }]}>
            {/* Top row */}
            <View style={styles.cardTop}>
              <View>
                <Text style={[styles.eventTitle, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.eventDate, { color: colors.textSecondary }]}>{item.dateLine}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Text style={[styles.eventTime, { color: colors.text }]}>{item.time}</Text>
                <TouchableOpacity onPress={() => openEdit(item)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Feather name="edit-3" size={18} color={colors.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Feather name="trash-2" size={18} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: isDark ? colors.border : "rgba(0,0,0,0.15)" }]} />

            {/* Planned Outfit */}
            <View style={styles.rowHeader}>
              <Text style={[styles.planLabel, { color: colors.text }]}>Planned Outfit</Text>
            </View>

            {item.outfit.length > 0 ? (
              <View style={styles.outfitRow}>
                {item.outfit.map((o) => (
                  <View key={o.label} style={styles.outfitItem}>
                    <Image source={o.image} style={styles.outfitImg} />
                    <Text style={[styles.outfitText, { color: colors.text }]}>{o.label}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={[styles.noOutfitText, { color: colors.textMuted }]}>No outfit planned yet</Text>
            )}
          </View>
        )}
      />

      {/* Floating add button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setAddVisible(true)}
        accessibilityRole="button"
        accessibilityLabel="Add event"
      >
        <View style={styles.fabInner}>
          <Feather name="plus" size={30} color="#fff" />
        </View>
      </TouchableOpacity>

      {/* ── Edit Modal ── */}
      <Modal visible={editVisible} transparent animationType="slide" onRequestClose={() => setEditVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Event</Text>
              <TouchableOpacity onPress={() => setEditVisible(false)}>
                <Feather name="x" size={22} color={colors.text} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>Event Name</Text>
            <TextInput style={inputStyle} value={editTitle} onChangeText={setEditTitle} placeholder="e.g. Office Meeting" placeholderTextColor={colors.textMuted} />
            <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>Date</Text>
            <TextInput style={inputStyle} value={editDate} onChangeText={setEditDate} placeholder="e.g. Fri, Aug 8" placeholderTextColor={colors.textMuted} />
            <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>Time</Text>
            <TextInput style={inputStyle} value={editTime} onChangeText={setEditTime} placeholder="e.g. 10:00 AM" placeholderTextColor={colors.textMuted} />
            <TouchableOpacity style={styles.saveBtn} onPress={saveEdit}>
              <Text style={styles.saveBtnText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── Add Modal ── */}
      <Modal visible={addVisible} transparent animationType="slide" onRequestClose={() => setAddVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Add New Event</Text>
              <TouchableOpacity onPress={() => setAddVisible(false)}>
                <Feather name="x" size={22} color={colors.text} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>Event Name</Text>
            <TextInput style={inputStyle} value={addTitle} onChangeText={setAddTitle} placeholder="e.g. Birthday Party" placeholderTextColor={colors.textMuted} />
            <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>Date</Text>
            <TextInput style={inputStyle} value={addDate} onChangeText={setAddDate} placeholder="e.g. Mon, Dec 25" placeholderTextColor={colors.textMuted} />
            <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>Time</Text>
            <TextInput style={inputStyle} value={addTime} onChangeText={setAddTime} placeholder="e.g. 7:00 PM" placeholderTextColor={colors.textMuted} />
            <TouchableOpacity style={styles.saveBtn} onPress={saveAdd}>
              <Text style={styles.saveBtnText}>Add Event</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 10,
    justifyContent: "space-between",
    borderBottomWidth: 1,
  },
  hBtn: { padding: 4 },
  headerTitle: { fontSize: 22, fontWeight: "700" },

  card: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  eventTitle: { fontSize: 18, fontWeight: "800" },
  eventDate: { marginTop: 2, fontWeight: "600" },
  eventTime: { fontWeight: "700" },

  divider: { height: 1, marginVertical: 10 },

  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  planLabel: { fontWeight: "800" },

  outfitRow: { flexDirection: "row" },
  outfitItem: { alignItems: "center", marginRight: 18 },
  outfitImg: { width: 96, height: 96, borderRadius: 12, backgroundColor: "#eee" },
  outfitText: { marginTop: 8, fontWeight: "700" },

  noOutfitText: { fontSize: 13, fontStyle: 'italic', marginBottom: 8 },

  emptyContainer: { alignItems: 'center', marginTop: 80, gap: 10 },
  emptyText: { fontSize: 16, fontWeight: '700' },
  emptySubtext: { fontSize: 13 },

  fab: { position: "absolute", right: 18, bottom: 96 },
  fabInner: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#0A58FF",
    alignItems: "center",
    justifyContent: "center",
  },

  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalBox: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '700' },
  modalLabel: { fontSize: 13, fontWeight: '600', marginBottom: 6, marginTop: 10 },
  input: {
    height: 46, borderWidth: 1, borderRadius: 10,
    paddingHorizontal: 14, fontSize: 15, marginBottom: 4,
  },
  saveBtn: {
    backgroundColor: '#0A58FF', borderRadius: 14, height: 52,
    alignItems: 'center', justifyContent: 'center', marginTop: 20,
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

export default UpcomingEventsScreen;
