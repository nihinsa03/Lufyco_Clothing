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

const AddToClosetPreviewScreen: React.FC<Props> = ({ route, navigation }) => {
  const { uri } = route.params;
  const [status, setStatus] = React.useState<"idle" | "saving" | "processed" | "error">("idle");

  const [name, setName] = React.useState("New Upload");
  const [category, setCategory] = React.useState("Tops");
  const [color, setColor] = React.useState("#000000");
  const [extracting, setExtracting] = React.useState(true);

  React.useEffect(() => {
    const extractDetails = async () => {
      try {
        const formData = new FormData();
        const filename = uri.split('/').pop() || 'photo.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        formData.append('image', { uri, name: filename, type } as any);

        const res = await api.post('/ai/extract-details', formData);

        if (res.data) {
          if (res.data.category) setCategory(res.data.category);
          if (res.data.color) setColor(res.data.color);
        }
      } catch (err) {
        console.warn("Failed to extract details", err);
      } finally {
        setExtracting(false);
      }
    };
    extractDetails();
  }, [uri]);

  const handleSave = async () => {
    try {
      setStatus("saving");
      const payload = {
        name,
        category,
        image: uri,
        color,
      };

      console.log("Saving to closet:", JSON.stringify(payload).substring(0, 200));
      const res = await api.post("/closet", payload);
      console.log("Save response:", res.data);

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

      <View style={styles.cardWrap}>
        <View style={styles.previewCard}>
          <Image source={{ uri }} style={styles.previewImage} />

          {extracting ? (
            <View style={styles.extractingWrap}>
              <ActivityIndicator size="small" color="#2563EB" />
              <Text style={styles.extractingText}>Analyzing item...</Text>
            </View>
          ) : (
            <View style={styles.detailsForm}>
              <Text style={styles.label}>Name</Text>
              <TextInput style={styles.input} value={name} onChangeText={setName} />

              <Text style={styles.label}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                {["Men's Wear", "Women's Wear", "Kids' Wear", "Foot Wear", "Beauty Products", "Jewellery", "Accessories", "Tops", "Bottoms", "Dresses", "Outerwear"].map(cat => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.catChip, category === cat && styles.catChipActive]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text style={[styles.catChipText, category === cat && styles.catChipTextActive]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.label}>Color</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                {["#000000", "#FFFFFF", "#FF0000", "#0000FF", "#00FF00", "#FFFF00", "#808080", "#FFC0CB", "#A52A2A", "#800080"].map(c => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.colorDotBtn, color === c && styles.colorDotBtnActive]}
                    onPress={() => setColor(c)}
                  >
                    <View style={[styles.colorDot, { backgroundColor: c }]} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <View style={styles.btnRow}>
            {status === "idle" && (
              <>
                <TouchableOpacity style={styles.blackBtn} onPress={handleSave}>
                  <Text style={styles.blackBtnText}>Add to Closet</Text>
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
                <Text style={styles.blackBtnText}>Processing...</Text>
              </TouchableOpacity>
            )}

            {status === "processed" && (
              <>
                <View style={[styles.blackBtn, { backgroundColor: "#10b981", opacity: 0.8 }]}>
                  <Text style={styles.blackBtnText}>Processed</Text>
                </View>
                <TouchableOpacity style={[styles.blackBtn, { backgroundColor: "#111" }]} onPress={() => navigation.navigate("MyCloset")}>
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

      {/* Bottom bar (static visual only) */}
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
  safe: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 10,
    justifyContent: "space-between",
  },
  hIcon: { padding: 4 },
  headerTitle: { fontSize: 24, fontWeight: "700" },

  cardWrap: { paddingHorizontal: 16, marginTop: 8 },
  previewCard: {
    backgroundColor: "#DEDEDE",
    borderRadius: 16,
    padding: 12,
  },
  previewImage: {
    width: "100%",
    height: 230,
    borderRadius: 12,
    backgroundColor: "#eee",
  },
  extractingWrap: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    paddingVertical: 20,
  },
  extractingText: {
    marginLeft: 8, fontSize: 14, color: "#4B5563", fontWeight: "500",
  },
  detailsForm: {
    marginTop: 16,
  },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: {
    height: 40, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8,
    paddingHorizontal: 12, fontSize: 14, color: '#111', marginBottom: 12,
    backgroundColor: '#fff'
  },
  catChip: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, backgroundColor: '#E5E7EB', marginRight: 8, height: 32, justifyContent: 'center'
  },
  catChipActive: { backgroundColor: '#2563EB' },
  catChipText: { fontSize: 12, fontWeight: '600', color: '#4B5563' },
  catChipTextActive: { color: '#fff' },
  colorDotBtn: {
    padding: 2, borderRadius: 16, marginRight: 8, height: 32, width: 32, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'transparent'
  },
  colorDotBtnActive: {
    borderColor: '#2563EB'
  },
  colorDot: {
    width: 24, height: 24, borderRadius: 12, borderWidth: 1, borderColor: '#ccc'
  },
  btnRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 16 },
  blackBtn: {
    flex: 1,
    backgroundColor: "#111",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginHorizontal: 6,
  },
  blackBtnText: { color: "#fff", fontWeight: "700" },

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
