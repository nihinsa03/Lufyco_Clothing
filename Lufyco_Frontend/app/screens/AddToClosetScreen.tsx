import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "AddToCloset">;

const AddToClosetScreen: React.FC<Props> = ({ navigation }) => {
  const [processing, setProcessing] = React.useState(false);

  const ensurePermission = async (kind: "camera" | "gallery") => {
    if (kind === "camera") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      return status === "granted";
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      return status === "granted";
    }
  };

  const handleProcess = (uri: string) => {
    setProcessing(true);
    // Simulate API/Processing delay
    setTimeout(() => {
      setProcessing(false);
      navigation.navigate("AddToClosetPreview", { uri });
    }, 2000);
  };

  const openCamera = async () => {
    const ok = await ensurePermission("camera");
    if (!ok) return Alert.alert("Permission needed", "Please allow camera access.");
    const res = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
      allowsEditing: true,
      aspect: [4, 5],
    });
    if (!res.canceled && res.assets?.length) {
      handleProcess(res.assets[0].uri);
    }
  };

  const openGallery = async () => {
    const ok = await ensurePermission("gallery");
    if (!ok) return Alert.alert("Permission needed", "Please allow photo library access.");
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
      allowsEditing: true,
      aspect: [4, 5],
    });
    if (!res.canceled && res.assets?.length) {
      handleProcess(res.assets[0].uri);
    }
  };

  if (processing) {
    return (
      <SafeAreaView style={[styles.safe, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 20 }}>Processing...</Text>
        {/* Simple loading indicator visual matching prompt requirements */}
        <View style={{ width: 200, height: 10, backgroundColor: '#eee', borderRadius: 5 }}>
          <View style={{ width: '50%', height: '100%', backgroundColor: '#111', borderRadius: 5 }} />
        </View>
      </SafeAreaView>
    );
  }

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

      {/* Upload Card */}
      <View style={styles.cardWrap}>
        <View style={styles.card}>
          <View style={styles.badge} />

          <View style={styles.bigIconWrap}>
            <View style={styles.bigIconBg}>
              <Feather name="camera" size={30} color="#5B8DFF" />
            </View>
          </View>

          <Text style={styles.title}>Upload clothing item</Text>
          <Text style={styles.sub}>
            Take a photo or select{"\n"}an image from your gallery
          </Text>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionBtn} onPress={openCamera}>
              <Feather name="camera" size={18} color="#fff" />
              <Text style={styles.actionText}>Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn} onPress={openGallery}>
              <Feather name="upload" size={18} color="#fff" />
              <Text style={styles.actionText}>Gallery</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.badge} />
        </View>
      </View>

      {/* Bottom tab (static visual only) */}
      <View style={styles.bottomBar}>
        {[
          { key: "home", label: "Home", icon: "home", onPress: () => navigation.navigate("Home") },
          { key: "stylist", label: "AI Stylist", icon: "grid", onPress: () => navigation.navigate("AIStylist") },
          { key: "cart", label: "My Cart", icon: "shopping-cart", onPress: () => navigation.navigate("MyCart") },
          { key: "wish", label: "Wishlist", icon: "heart", onPress: () => navigation.navigate("Wishlist") },
          { key: "profile", label: "Profile", icon: "user", onPress: () => navigation.navigate("Profile") },
        ].map((t) => (
          <TouchableOpacity key={t.key} style={styles.tabBtn} onPress={t.onPress}>
            <Feather name={t.icon as any} size={22} color={t.key === 'stylist' ? "#1E90FF" : "#777"} />
            <Text style={[styles.tabLabel, { color: t.key === 'stylist' ? "#1E90FF" : "#777" }]}>{t.label}</Text>
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
  card: {
    backgroundColor: "#DEDEDE",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  badge: {
    height: 6,
    width: 60,
    borderRadius: 6,
    backgroundColor: "#D8C6FF",
    alignSelf: "flex-start",
    marginVertical: 6,
  },
  bigIconWrap: { alignItems: "center", marginTop: 6, marginBottom: 10 },
  bigIconBg: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#E7F1FF",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { textAlign: "center", fontSize: 20, fontWeight: "800", color: "#111" },
  sub: { textAlign: "center", color: "#444", marginTop: 6, lineHeight: 20 },

  actionsRow: { flexDirection: "row", justifyContent: "space-evenly", marginTop: 16 },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#111",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  actionText: { color: "#fff", fontWeight: "700" },

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

export default AddToClosetScreen;
