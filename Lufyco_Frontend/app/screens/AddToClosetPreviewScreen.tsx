import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "AddToClosetPreview">;

const AddToClosetPreviewScreen: React.FC<Props> = ({ route, navigation }) => {
  const { uri } = route.params;

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
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={styles.blackBtn}
              onPress={() => {
                // TODO: save to closet here, then navigate as you need
                navigation.navigate("MyCloset");
              }}
            >
              <Text style={styles.blackBtnText}>Processed</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.blackBtn}
              onPress={() => navigation.replace("AddToCloset")}
            >
              <Text style={styles.blackBtnText}>Re try</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Bottom bar (static visual only) */}
      <View style={styles.bottomBar}>
        {[
          { label: "Home", icon: "home", onPress: () => navigation.navigate("Home") },
          { label: "AI Stylist", icon: "grid", onPress: () => navigation.navigate("AISylist" as any) },
          { label: "My Cart", icon: "shopping-cart", onPress: () => {} },
          { label: "Wishlist", icon: "heart", onPress: () => {} },
          { label: "Profile", icon: "user", onPress: () => {} },
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
  btnRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
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
