import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";
import api from "../api/api";

type Props = NativeStackScreenProps<RootStackParamList, "AddToClosetPreview">;

const PALETTE = [
  // Neutrals
  { hex: "#000000", label: "Black" },
  { hex: "#FFFFFF", label: "White" },
  { hex: "#F5F5F5", label: "Off-white" },
  { hex: "#808080", label: "Gray" },
  // Reds
  { hex: "#FF0000", label: "Red" },
  { hex: "#8B0000", label: "Dark Red" },
  { hex: "#800000", label: "Maroon" },
  { hex: "#A52A2A", label: "Brown" },
  // Blues
  { hex: "#0000FF", label: "Blue" },
  { hex: "#000080", label: "Navy" },
  // Others
  { hex: "#00FF00", label: "Green" },
  { hex: "#008080", label: "Teal" },
  { hex: "#FFFF00", label: "Yellow" },
  { hex: "#FF8C00", label: "Orange" },
  { hex: "#FFC0CB", label: "Pink" },
  { hex: "#800080", label: "Purple" },
];

const CATEGORIES = [
  "Men's Wear", "Women's Wear", "Kids' Wear", "Foot Wear",
  "Beauty Products", "Jewellery", "Accessories",
  "Tops", "Bottoms", "Dresses", "Outerwear",
];

const AddToClosetPreviewScreen: React.FC<Props> = ({ route, navigation }) => {
  const { uri } = route.params;
  const [status, setStatus] = React.useState<"idle" | "saving" | "processed" | "error">("idle");

  const [name, setName] = React.useState("New Upload");
  const [category, setCategory] = React.useState("Men's Wear");
  const [color, setColor] = React.useState("#000000");
  const [aiColor, setAiColor] = React.useState<string | null>(null); // exact AI-detected hex
  const [extracting, setExtracting] = React.useState(true);
  const [extractError, setExtractError] = React.useState(false);

  React.useEffect(() => {
    const extractDetails = async () => {
      try {
        setExtracting(true);
        setExtractError(false);

        const formData = new FormData();
        const filename = uri.split('/').pop() || 'photo.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;

        formData.append('image', { uri, name: filename, type } as any);

        const res = await api.post('/ai/extract-details', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 20000,
        });

        if (res.data) {
          if (res.data.category) setCategory(res.data.category);
          if (res.data.color) {
            setColor(res.data.color);       // palette-snapped color (for selection)
            setAiColor(res.data.color);     // store as "AI detected"
          }
        }
      } catch (err) {
        console.warn("Failed to extract details", err);
        setExtractError(true);
      } finally {
        setExtracting(false);
      }
    };
    extractDetails();
  }, [uri]);

  const handleSave = async () => {
    try {
      setStatus("saving");
      const payload = { name, category, image: uri, color };
      const res = await api.post("/closet", payload);

      try {
        await api.post("/closet/train", { itemId: res.data._id || res.data.id });
      } catch (err) {
        console.warn("Training endpoint error:", err);
      }

      setStatus("processed");
    } catch (e: any) {
      const errorMsg = e.response?.data?.message || e.message || "Unknown error";
      console.error("Save to closet failed:", errorMsg, e);
      setStatus("error");
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.hIcon}>
          <Feather name="arrow-left" size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add to Closet</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.cardWrap}>
          <View style={styles.previewCard}>
            <Image source={{ uri }} style={styles.previewImage} />

            {/* AI Analysis Banner */}
            {extracting && (
              <View style={styles.aiBanner}>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.aiBannerText}>🤖 AI is detecting color & category...</Text>
              </View>
            )}
            {!extracting && !extractError && (
              <View style={[styles.aiBanner, { backgroundColor: "#10b981" }]}>
                <Feather name="check-circle" size={14} color="#fff" />
                <Text style={styles.aiBannerText}>✅ Auto-detected! You can adjust below.</Text>
              </View>
            )}
            {!extracting && extractError && (
              <View style={[styles.aiBanner, { backgroundColor: "#f59e0b" }]}>
                <Feather name="alert-circle" size={14} color="#fff" />
                <Text style={styles.aiBannerText}>⚠️ AI unavailable — please select manually.</Text>
              </View>
            )}

            {/* Form */}
            <View style={styles.detailsForm}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="e.g. Blue Shirt"
                placeholderTextColor="#9CA3AF"
              />

              {/* Category */}
              <Text style={styles.label}>
                Category
                {!extracting && !extractError && (
                  <Text style={styles.aiTag}> · AI detected</Text>
                )}
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
                {CATEGORIES.map(cat => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.catChip, category === cat && styles.catChipActive]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text style={[styles.catChipText, category === cat && styles.catChipTextActive]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Color */}
              <Text style={styles.label}>
                Color
                {!extracting && !extractError && aiColor && (
                  <Text style={styles.aiTag}> · AI detected</Text>
                )}
              </Text>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
                {/* AI-detected color as first circle */}
                {aiColor && (
                  <View style={styles.aiCircleWrap}>
                    <TouchableOpacity
                      style={[styles.colorDotBtn, color === aiColor && styles.colorDotBtnActive]}
                      onPress={() => setColor(aiColor)}
                    >
                      <View style={[styles.colorDot, { backgroundColor: aiColor }]} />
                    </TouchableOpacity>
                    <Text style={styles.aiCircleLabel}>✨ AI</Text>
                  </View>
                )}
                {/* Standard palette circles */}
                {PALETTE.map(c => (
                  <TouchableOpacity
                    key={c.hex}
                    style={[styles.colorDotBtn, color === c.hex && color !== aiColor && styles.colorDotBtnActive]}
                    onPress={() => setColor(c.hex)}
                  >
                    <View style={[styles.colorDot, { backgroundColor: c.hex }]} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Action Buttons */}
            <View style={styles.btnRow}>
              {status === "idle" && (
                <>
                  <TouchableOpacity
                    style={[styles.blackBtn, extracting && styles.blackBtnDisabled]}
                    onPress={handleSave}
                    disabled={extracting}
                  >
                    {extracting
                      ? <ActivityIndicator size="small" color="#fff" />
                      : <Text style={styles.blackBtnText}>Add to Closet</Text>
                    }
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.blackBtn, { backgroundColor: "#444" }]}
                    onPress={() => navigation.replace("AddToCloset")}
                  >
                    <Text style={styles.blackBtnText}>Retake</Text>
                  </TouchableOpacity>
                </>
              )}

              {status === "saving" && (
                <TouchableOpacity style={[styles.blackBtn, { opacity: 0.7 }]} disabled>
                  <Text style={styles.blackBtnText}>Saving...</Text>
                </TouchableOpacity>
              )}

              {status === "processed" && (
                <>
                  <View style={[styles.blackBtn, { backgroundColor: "#10b981" }]}>
                    <Text style={styles.blackBtnText}>✅ Saved!</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.blackBtn, { backgroundColor: "#111" }]}
                    onPress={() => navigation.navigate("MyCloset")}
                  >
                    <Text style={styles.blackBtnText}>Go to Closet</Text>
                  </TouchableOpacity>
                </>
              )}

              {status === "error" && (
                <>
                  <TouchableOpacity style={[styles.blackBtn, { backgroundColor: "#ef4444" }]} onPress={handleSave}>
                    <Text style={styles.blackBtnText}>Retry</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.blackBtn, { backgroundColor: "#444" }]}
                    onPress={() => navigation.replace("AddToCloset")}
                  >
                    <Text style={styles.blackBtnText}>Retake</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View style={styles.bottomBar}>
        {[
          { label: "Home", icon: "home", onPress: () => navigation.navigate("Home") },
          { label: "AI Stylist", icon: "grid", onPress: () => navigation.navigate("AISylist" as any) },
          { label: "My Cart", icon: "shopping-cart", onPress: () => { } },
          { label: "Wishlist", icon: "heart", onPress: () => { } },
          { label: "Profile", icon: "user", onPress: () => { } },
        ].map((t, i) => (
          <TouchableOpacity key={t.label} style={styles.tabBtn} onPress={t.onPress}>
            <Feather name={t.icon as any} size={22} color={i === 0 ? "#000" : "#777"} />
            <Text style={[styles.tabLabel, { color: i === 0 ? "#000" : "#777" }]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F3F4F6" },
  scroll: { paddingBottom: 100 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 10,
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },
  hIcon: { padding: 4 },
  headerTitle: { fontSize: 22, fontWeight: "700" },

  cardWrap: { paddingHorizontal: 14, marginTop: 12 },
  previewCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  previewImage: {
    width: "100%",
    height: 240,
    borderRadius: 14,
    backgroundColor: "#eee",
  },

  aiBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563EB",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 10,
    gap: 6,
  },
  aiBannerText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 6,
  },

  detailsForm: { marginTop: 16 },

  label: { fontSize: 13, fontWeight: "600", color: "#374151", marginBottom: 6 },
  aiTag: { fontSize: 11, fontWeight: "500", color: "#2563EB" },

  input: {
    height: 42,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#111",
    marginBottom: 14,
    backgroundColor: "#F9FAFB",
  },

  catChip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
    backgroundColor: "#E5E7EB", marginRight: 8,
    justifyContent: "center",
  },
  catChipActive: { backgroundColor: "#2563EB" },
  catChipText: { fontSize: 12, fontWeight: "600", color: "#4B5563" },
  catChipTextActive: { color: "#fff" },

  aiCircleWrap: {
    alignItems: "center",
    marginRight: 8,
  },
  aiCircleLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "#2563EB",
    marginTop: 2,
  },

  colorDotBtn: {
    padding: 2, borderRadius: 18, marginRight: 8, height: 36, width: 36,
    justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: "transparent",
  },
  colorDotBtnActive: { borderColor: "#2563EB" },
  colorDot: {
    width: 26, height: 26, borderRadius: 13, borderWidth: 1, borderColor: "#ccc",
  },

  btnRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 18 },
  blackBtn: {
    flex: 1,
    backgroundColor: "#111",
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
    marginHorizontal: 5,
  },
  blackBtnDisabled: { backgroundColor: "#6B7280", opacity: 0.7 },
  blackBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },

  bottomBar: {
    position: "absolute",
    left: 0, right: 0, bottom: 0,
    height: 84, borderTopWidth: 1, borderColor: "#eee",
    backgroundColor: "#fff", flexDirection: "row",
    alignItems: "center", justifyContent: "space-around", paddingBottom: 8,
  },
  tabBtn: { alignItems: "center" },
  tabLabel: { fontSize: 12, marginTop: 2, fontWeight: "500" },
});

export default AddToClosetPreviewScreen;
