import React, { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import DatePicker from "react-native-ui-datepicker";
import dayjs, { Dayjs } from "dayjs";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "PlanMyLook">;

const moods = [
  { key: "Happy", label: "Happy", emoji: "😊" },
  { key: "Chill", label: "Chill", emoji: "😌" },
  { key: "Confident", label: "Confident", emoji: "😎" },
  { key: "Trendy", label: "Trendy", emoji: "✨" },
  { key: "Edgy", label: "Edgy", emoji: "🎸" },
  { key: "Elegant", label: "Elegant", emoji: "🍸" },
];

const occasions = ["Casual", "Office", "Party", "Date", "Wedding", "Gym"] as const;
const timeNeeds = ["Now", "Future"] as const;

const formatDateTime = (d: Dayjs) => d.format("DD MMM YYYY | hh:mm A");

const Chip = ({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.chip, selected ? styles.chipActive : styles.chipInactive]}
  >
    <Text style={[styles.chipText, selected && styles.chipTextActive]}>{label}</Text>
  </TouchableOpacity>
);

const MoodTile = ({
  emoji,
  label,
  selected,
  onPress,
}: {
  emoji: string;
  label: string;
  selected: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.moodTile, selected && styles.moodTileActive]}
  >
    <View style={styles.emojiWrap}>
      <Text style={styles.emoji}>{emoji}</Text>
    </View>
    <Text style={styles.moodLabel}>{label}</Text>
  </TouchableOpacity>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <Text style={styles.sectionTitle}>{children}</Text>
);

const PlanMyLookScreen: React.FC<Props> = ({ navigation }) => {
  const [mood, setMood] = useState<string | null>(null);
  const [occasion, setOccasion] = useState<string | null>(null);
  const [timeNeed, setTimeNeed] = useState<"Now" | "Future" | null>(null);

  // Drive the picker with dayjs to avoid click issues
  const [whenDj, setWhenDj] = useState<Dayjs>(dayjs());
  const [pickerOpen, setPickerOpen] = useState(false);

  const isFuture = timeNeed === "Future";

  useEffect(() => {
    if (timeNeed === "Now") {
      setWhenDj(dayjs());
      setPickerOpen(false);
    }
  }, [timeNeed]);

  const dateText = useMemo(() => formatDateTime(whenDj), [whenDj]);

  const handleGenerate = () => {
    const finalMood = mood ?? "Confident";
    const finalOccasion = occasion ?? "Casual";
    const weather = "Sunny";
    // Keep only the params your navigator type allows
    navigation.navigate("SuggestedOutfit", {
      mood: finalMood,
      occasion: finalOccasion,
      weather,
      // If you later add `whenISO` to SuggestedOutfit params, then:
      // whenISO: whenDj.toISOString(),
    } as any);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 8 }}>
          <Feather name="arrow-left" size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Plan My Look</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Mood block */}
        <View style={styles.panel}>
          <SectionTitle>How are you feeling today ?</SectionTitle>

          {/* 2 rows (3 columns then 2 columns) to match UI */}
          {/* 2 rows with 3 columns each */}
          <View style={styles.moodRow}>
            {moods.slice(0, 3).map((m) => (
              <MoodTile
                key={m.key}
                emoji={m.emoji}
                label={m.label}
                selected={mood === m.key}
                onPress={() => setMood(m.key)}
              />
            ))}
          </View>
          <View style={styles.moodRow}>
            {moods.slice(3, 6).map((m) => (
              <MoodTile
                key={m.key}
                emoji={m.emoji}
                label={m.label}
                selected={mood === m.key}
                onPress={() => setMood(m.key)}
              />
            ))}
          </View>
        </View>

        {/* Occasion */}
        <View style={{ paddingHorizontal: 25, marginTop: 12 }}>
          <SectionTitle>What's the occasion?</SectionTitle>
          <View style={styles.rowWrap}>
            {occasions.map((o) => (
              <Chip key={o} label={o} selected={occasion === o} onPress={() => setOccasion(o)} />
            ))}
          </View>
        </View>

        {/* When do you need it */}
        <View style={{ paddingHorizontal: 25, marginTop: 10 }}>
          <SectionTitle>When do you need this outfit?</SectionTitle>
          <View style={styles.rowWrap}>
            {timeNeeds.map((t) => (
              <Chip key={t} label={t} selected={timeNeed === t} onPress={() => setTimeNeed(t)} />
            ))}
          </View>
        </View>

        {/* Date selector */}
        <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
          <Text style={styles.label}>Select Date</Text>

          <View style={styles.dateRow}>
            <View style={[styles.dateBox, !isFuture && styles.dateBoxDisabled]}>
              <Text style={[styles.dateText, !isFuture && styles.dateTextDisabled]}>
                {dateText}
              </Text>
            </View>

            <TouchableOpacity
              disabled={!isFuture}
              onPress={() => setPickerOpen(true)}
              style={[styles.calBtn, !isFuture && { opacity: 0.45 }]}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="calendar-outline" size={22} color="#7c3aed" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Weather */}
        <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
          <SectionTitle>Today’s Weather</SectionTitle>
          <View style={styles.weatherCard}>
            <Ionicons name="sunny-outline" size={26} color="#FF4D4D" />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.weatherMain}>72 F</Text>
              <Text style={styles.weatherSub}>Sunny</Text>
            </View>
          </View>
        </View>

        {/* Generate button */}
        <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
          <TouchableOpacity style={styles.cta} onPress={handleGenerate}>
            <Text style={styles.ctaText}>Generate  My Look</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* FUTURE picker modal */}
      <Modal
        visible={pickerOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setPickerOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setPickerOpen(false)}>
          <View style={styles.modalBackdrop} />
        </TouchableWithoutFeedback>

        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Pick date & time</Text>
            <TouchableOpacity onPress={() => setPickerOpen(false)}>
              <Feather name="x" size={20} />
            </TouchableOpacity>
          </View>

          <DatePicker
            mode="single"
            // Drive with dayjs so day presses work on all builds
            date={whenDj}
            onChange={(params: any) => {
              // params.date may be Dayjs or Date
              const d = params?.date;
              if (!d) return;
              setWhenDj(dayjs.isDayjs(d) ? d : dayjs(d));
            }}
            // Guard: start at today 00:00 so you can tap any future day
            minDate={dayjs().startOf("day")}
            timePicker
          />

          <TouchableOpacity style={[styles.cta, { marginTop: 12 }]} onPress={() => setPickerOpen(false)}>
            <Text style={styles.ctaText}>Done</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 10,
    justifyContent: "space-between",
  },
  headerTitle: { fontSize: 22, fontWeight: "700" },

  panel: {
    borderWidth: 1.5,
    borderColor: "#828e90ff",
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 12,
    marginTop: 6,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2C63FF",
    marginBottom: 10,
  },

  moodRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  moodTile: {
    width: "30%",
    backgroundColor: "#E3E3E3",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  moodTileActive: {
    borderWidth: 2,
    borderColor: "#2C63FF",
    backgroundColor: "#F1F6FF",
  },
  emojiWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#FFE900",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  emoji: { fontSize: 20 },
  moodLabel: { fontWeight: "700" },

  rowWrap: { flexDirection: "row", flexWrap: "wrap" },

  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 12,
    marginBottom: 12,
  },
  chipInactive: { backgroundColor: "#D9D9D9" },
  chipActive: { backgroundColor: "#9DD1FF" },
  chipText: { fontWeight: "700", color: "#111" },
  chipTextActive: { color: "#0C1A3A" },

  label: { fontWeight: "700", marginBottom: 6, color: "#111" },
  dateRow: { flexDirection: "row", alignItems: "center" },
  dateBox: {
    flex: 1,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  dateBoxDisabled: { backgroundColor: "#EEE" },
  dateText: { fontWeight: "700", color: "#111" },
  dateTextDisabled: { color: "#6b7280" },
  calBtn: {
    width: 42,
    height: 42,
    marginLeft: 10,
    borderRadius: 10,
    backgroundColor: "#EDE9FE",
    alignItems: "center",
    justifyContent: "center",
  },

  weatherCard: {
    backgroundColor: "#E2E2E2",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  weatherMain: { fontSize: 16, fontWeight: "700" },
  weatherSub: { color: "#333" },

  cta: {
    backgroundColor: "#111",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  ctaText: { color: "#fff", fontWeight: "800", fontSize: 16 },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  modalCard: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.select({ ios: 28, android: 16 }),
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    // Make it a bottom sheet with enough height for full calendar taps
    maxHeight: "88%",
    minHeight: "60%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  modalTitle: { fontSize: 16, fontWeight: "700" },
});

export default PlanMyLookScreen;
