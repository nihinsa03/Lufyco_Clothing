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

// import api from "../api/api";
// import { ClothingItem } from "../models";
import { MOCK_PRODUCTS } from "../data/mockProducts";

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

  const generateLook = () => {
    setLoading(true);

    // 1. Filter by Occasion & Weather logic
    let relevantItems = [...MOCK_PRODUCTS];

    // Simple heuristic for weather:
    // If 'Rain', avoid white/light shoes? Or maybe just suggest Jackets.
    // If 'Snow', suggest Outerwear.
    // If 'Sunny', suggest T-Shirts/Dresses.

    const isCold = weather.includes("Rain") || weather.includes("Snow") || weather.includes("Fog") || weather.includes("Cloud");
    const isHot = weather.includes("Sunny") || weather.includes("Clear");

    // -- Gender assumption: For now, let's mix or pick based on a user profile if we had one.
    // Since we don't have gender in props, let's just use all relevant items or maybe filter if we knew.
    // For demo, let's just use all MOCK_PRODUCTS.

    // 2. Pick categories based on Occasion
    let relevantTops = relevantItems.filter(i => i.subCategory === 'Tops' || i.type === 'T-Shirt' || i.type === 'Shirt' || i.type === 'Blouse' || i.type === 'Hoodie' || i.type === 'Sweater');
    let relevantBottoms = relevantItems.filter(i => i.subCategory === 'Bottoms' || i.type === 'Jeans' || i.type === 'Pants' || i.type === 'Skirt' || i.type === 'Shorts');
    let relevantShoes = relevantItems.filter(i => i.category === 'Shoes');
    let relevantOuterwear = relevantItems.filter(i => i.subCategory === 'Outerwear' || i.type === 'Jacket');
    let relevantDresses = relevantItems.filter(i => i.subCategory === 'Dresses' || i.type === 'Dress');

    // Refine by Occasion
    if (occasion === "Office") {
      relevantTops = relevantTops.filter(i => i.type !== 'T-Shirt' && i.type !== 'Hoodie'); // Formal-ish
      relevantBottoms = relevantBottoms.filter(i => i.type !== 'Shorts');
      relevantDresses = relevantDresses.filter(i => i.name.includes("Summer") === false); // Avoid beach dresses
    } else if (occasion === "Party") {
      // Maybe prioritize Dresses for women, cool shirts for men
    } else if (occasion === "Gym") {
      // ...
    }

    // Refine by Weather
    if (isCold) {
      // Prefer hoodies/sweaters if available, else standard tops + jacket
      const warmTops = relevantTops.filter(i => i.type === 'Hoodie' || i.type === 'Sweater');
      if (warmTops.length > 0) relevantTops = warmTops;
    } else if (isHot) {
      // Prefer T-Shirts, Shorts, Skirts
      relevantOuterwear = []; // No jackets
      relevantTops = relevantTops.filter(i => i.type === 'T-Shirt' || i.type === 'Blouse');
      relevantBottoms = relevantBottoms.filter(i => i.type === 'Shorts' || i.type === 'Skirt' || i.type === 'Jeans');
    }

    // 3. Assemble Outfit
    const outfit: any[] = [];
    const random = (arr: any[]) => arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : null;

    // Decide structure: Dress vs Top/Bottom
    // 50/50 chance if both valid, or logic based. 
    // Let's just do Top/Bottom for simplicity unless it's a "Dress" occasion/preference.
    const useDress = relevantDresses.length > 0 && Math.random() > 0.7; // 30% chance for dress if available

    if (useDress) {
      const dress = random(relevantDresses);
      if (dress) outfit.push(dress);
    } else {
      const top = random(relevantTops);
      const bottom = random(relevantBottoms);
      if (top) outfit.push(top);
      if (bottom) outfit.push(bottom);
    }

    // Always add shoes
    const shoe = random(relevantShoes);
    if (shoe) outfit.push(shoe);

    // Add jacket if cold and not already picked (though our mock logic is simple)
    if (isCold && relevantOuterwear.length > 0) {
      const jacket = random(relevantOuterwear);
      // Avoid duplicate types if any
      if (jacket && !outfit.find(i => i._id === jacket._id)) {
        outfit.push(jacket);
      }
    }

    setTimeout(() => {
      setGeneratedOutfit(outfit);
      setLoading(false);
    }, 600);
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
