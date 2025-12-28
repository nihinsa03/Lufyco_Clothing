import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

// In AppNavigator add:
// SuggestedOutfit: { mood: string; occasion: string; weather: string };

type Props = NativeStackScreenProps<RootStackParamList, "SuggestedOutfit">;

const moodEmoji: Record<string, string> = {
  Happy: "😊",
  Confident: "😎",
  Sad: "☹️",
  Tired: "😐",
  Excited: "😁",
};

const SuggestedOutfitScreen: React.FC<Props> = ({ route, navigation }) => {
  const { mood, weather, occasion } = route.params;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 8 }}>
          <Feather name="arrow-left" size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Suggested Outfit</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Selection pill */}
        <View style={styles.pill}>
          <Text style={styles.pillEmoji}>{moodEmoji[mood] ?? "🙂"}</Text>
          <Text style={styles.pillText}>
            {mood} + {weather} + {occasion}
          </Text>
        </View>

        {/* Your Suggested Outfit */}
        <Text style={styles.sectionTitle}>Your Suggested Outfit</Text>
        <View style={styles.outfitCard}>
          <View style={styles.outfitRow}>
            <View style={styles.outfitItem}>
              <Image
                source={require("../../assets/images/shirt.png")}
                style={styles.outfitImg}
              />
              <Text style={styles.outfitLabel}>Blue Shirt</Text>
            </View>
            <View style={styles.outfitItem}>
              <Image
                source={require("../../assets/images/shoe.png")}
                style={styles.outfitImg}
              />
              <Text style={styles.outfitLabel}>Casual Shoe</Text>
            </View>
          </View>
        </View>

        {/* Complete your look */}
        <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Complete Your Look</Text>

        {/* Watch row */}
        <View style={styles.suggestionRow}>
          <Image
            source={require("../../assets/images/categories/men/watches.jpg")}
            style={styles.suggestionImg}
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.suggestionTitle}>Brown Leather Watch</Text>
            <Text style={styles.suggestionSub}>Complements casual style</Text>
          </View>
          <TouchableOpacity style={styles.cartBtn}>
            <Feather name="shopping-cart" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Perfume row */}
        <View style={styles.suggestionRow}>
          <Image
            source={require("../../assets/images/categories/men/perfume.jpg")}
            style={styles.suggestionImg}
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.suggestionTitle}>Black Night Perfume</Text>
            <Text style={styles.suggestionSub}>Complements casual style</Text>
          </View>
          <TouchableOpacity style={styles.cartBtn}>
            <Feather name="shopping-cart" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          <Text style={styles.moreLink}>View More Suggestions</Text>
        </TouchableOpacity>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={[styles.actionBtn, styles.actionGhost]}>
            <Text style={[styles.actionText, { color: "#111" }]}>Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.actionPrimary]}>
            <Text style={[styles.actionText, { color: "#fff" }]}>Save This Look</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  headerTitle: { fontSize: 24, fontWeight: "800" },

  pill: {
    marginHorizontal: 16,
    backgroundColor: "#DFF6FF",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  pillEmoji: { fontSize: 18, marginRight: 8 },
  pillText: { fontSize: 16, fontWeight: "700" },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 8,
  },

  outfitCard: {
    marginHorizontal: 16,
    backgroundColor: "#E2E2E2",
    borderRadius: 14,
    padding: 12,
  },
  outfitRow: { flexDirection: "row", justifyContent: "flex-start" },
  outfitItem: { alignItems: "center", marginRight: 24 },
  outfitImg: { width: 130, height: 110, borderRadius: 10, resizeMode: "cover" },
  outfitLabel: { marginTop: 8, fontWeight: "700" },

  suggestionRow: {
    marginHorizontal: 16,
    backgroundColor: "#E2E2E2",
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  suggestionImg: { width: 64, height: 64, borderRadius: 10, resizeMode: "cover" },
  suggestionTitle: { fontWeight: "800", fontSize: 16 },
  suggestionSub: { color: "#333", marginTop: 2 },

  cartBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#2C63FF",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },

  moreLink: {
    color: "#3F51FF",
    fontWeight: "700",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 10,
  },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 6,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  actionGhost: {
    backgroundColor: "#F1F1F1",
    marginRight: 10,
  },
  actionPrimary: {
    backgroundColor: "#111",
    marginLeft: 10,
  },
  actionText: { fontWeight: "800", fontSize: 16 },
});

export default SuggestedOutfitScreen;
