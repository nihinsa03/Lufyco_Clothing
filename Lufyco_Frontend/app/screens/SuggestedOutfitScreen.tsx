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

import api from "../api/api";
// import { ClothingItem } from "../models";
// MOCK_PRODUCTS import removed
import { Platform } from "react-native";

// AI Backend URL
const AI_API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';

// ... (keep props and emoji map)

const SuggestedOutfitScreen: React.FC<Props> = ({ route, navigation }) => {
  const { mood, weather, occasion } = route.params;
  // Removed unused state
  // const [closetItems, setClosetItems] = React.useState<ClothingItem[]>([]);

  const [generatedOutfit, setGeneratedOutfit] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [retry, setRetry] = React.useState(0);

  React.useEffect(() => {
    generateLook();
  }, [retry, mood, weather, occasion]);

  const generateLook = async () => {
    setLoading(true);
    try {
      // 1. Fetch User's Closet from Node.js Backend
      const closetRes = await api.get('/closet');
      const userCloset = closetRes.data;

      if (!userCloset || userCloset.length === 0) {
        setGeneratedOutfit([]);
        setLoading(false);
        return;
      }

      // 2. Prepare Request for AI Backend
      // We need to pass the closet items to the Python backend so it can pick from them.
      // In a real production app, the Python backend might fetch directly from DB or receive IDs.
      // Here we send the current items array.

      // Temperature heuristic from Weather string (e.g. "Sunny 25°F" or just condition)
      // Let's assume weather string might be complex, so we passed condition.
      // For accurate temp, we should have passed it from previous screen.
      // Defaulting to 20°C if unknown.
      let temp = 20;

      const payload = {
        weather: weather,
        temperature: temp,
        occasion: occasion.toLowerCase(),
        mood: mood,
        closet_items: userCloset.map((item: any) => ({
          id: item._id,
          name: item.name,
          category: item.category,
          tags: item.notes ? JSON.parse(item.notes || "[]") : []
        }))
      };

      // 3. Call AI Backend
      const response = await fetch(`${AI_API_URL}/recommend-outfit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('AI Rec Failed');

      const recommendation = await response.json();

      // 4. Convert Recommendation to Display Format
      const outfit = [];
      if (recommendation.top) outfit.push(recommendation.top);
      if (recommendation.bottom) outfit.push(recommendation.bottom);
      if (recommendation.shoes) outfit.push(recommendation.shoes);

      setGeneratedOutfit(outfit);

    } catch (e) {
      console.error("Rec Error", e);
      // Fallback or show error
      setGeneratedOutfit([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    // In a real app, POST /api/outfits
    // Here we simulate saving and going back
    alert("Outfit Saved!");
    navigation.navigate("AIStylist");
  };

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
            {generatedOutfit.length === 0 ? (
              <Text style={{ padding: 20 }}>No items found in closet to match this.</Text>
            ) : (
              generatedOutfit.map((item, idx) => (
                <View key={idx} style={styles.outfitItem}>
                  <Image
                    source={item.image && item.image.startsWith('http') ? { uri: item.image } : require("../../assets/images/clothing.png")}
                    style={styles.outfitImg}
                  />
                  <Text style={styles.outfitLabel}>{item.name}</Text>
                </View>
              ))
            )}
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
          <TouchableOpacity style={[styles.actionBtn, styles.actionGhost]} onPress={() => setRetry(r => r + 1)}>
            <Text style={[styles.actionText, { color: "#111" }]}>Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.actionPrimary]} onPress={handleSave}>
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
