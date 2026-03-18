import React from "react";
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Platform, StatusBar } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
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
import AsyncStorage from "@react-native-async-storage/async-storage";

// ... (keep props and emoji map)

const SuggestedOutfitScreen: React.FC<Props> = ({ route, navigation }) => {
  const { mood, weather, occasion } = route.params;
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors, isDark);

  const [generatedOutfit, setGeneratedOutfit] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [history, setHistory] = React.useState<any[][]>([]);
  const [currentIndex, setCurrentIndex] = React.useState(-1);

  React.useEffect(() => {
    generateLook();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mood, weather, occasion]);

  const handleRegenerate = () => {
    // Slice off any future history if we are currently undo'd
    setHistory(prev => prev.slice(0, currentIndex + 1));
    generateLook();
  };

  const generateLook = () => {
    setLoading(true);

    let relevantItems = [...MOCK_PRODUCTS];

    const w = weather.toLowerCase();
    const isCold = w.includes("rain") || w.includes("snow") || w.includes("fog") || w.includes("cloud") || w.includes("cool");
    const isHot = w.includes("sun") || w.includes("clear") || w.includes("warm") || w.includes("hot");

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
      setHistory(prev => {
        const newHistory = [...prev, outfit];
        setCurrentIndex(newHistory.length - 1);
        return newHistory;
      });
      setGeneratedOutfit(outfit);
      setLoading(false);
    }, 600);
  };

  const handleUndo = () => {
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      setGeneratedOutfit(history[prevIdx]);
    }
  };

  const handleRedo = () => {
    if (currentIndex < history.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setGeneratedOutfit(history[nextIdx]);
    }
  };

  const handleSave = async () => {
    try {
      const existingStr = await AsyncStorage.getItem('saved_looks');
      const existing = existingStr ? JSON.parse(existingStr) : [];
      const newLook = {
        id: Date.now().toString(),
        mood, weather, occasion,
        items: generatedOutfit,
        date: new Date().toISOString()
      };
      await AsyncStorage.setItem('saved_looks', JSON.stringify([newLook, ...existing]));
      alert("Outfit Saved!");
      navigation.navigate("AIStylist");
    } catch (e) {
      console.error(e);
      alert("Failed to save outfit");
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 8 }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Feather name="arrow-left" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Suggested Outfit</Text>
        {/* Button to view saved looks */}
        <TouchableOpacity onPress={() => navigation.navigate('SavedLooks')} style={{ paddingLeft: 8 }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Feather name="bookmark" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Selection pill */}
        <View style={[styles.pill, { backgroundColor: isDark ? colors.border : "#DFF6FF" }]}>
          <Text style={styles.pillEmoji}>{moodEmoji[mood] ?? "🙂"}</Text>
          <Text style={[styles.pillText, { color: colors.text }]}>
            {mood} + {weather} + {occasion}
          </Text>
        </View>

        {/* Your Suggested Outfit */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Suggested Outfit</Text>
        <View style={[styles.outfitCard, { backgroundColor: colors.card }]}>
          <View style={styles.outfitRow}>
            {generatedOutfit.length === 0 ? (
              <Text style={{ padding: 20, color: colors.textSecondary }}>No items found in closet to match this.</Text>
            ) : (
              generatedOutfit.map((item, idx) => (
                <View key={idx} style={styles.outfitItem}>
                  <Image
                    source={item.image && item.image.startsWith('http') ? { uri: item.image } : require("../../assets/images/clothing.png")}
                    style={styles.outfitImg}
                  />
                  <Text style={[styles.outfitLabel, { color: colors.text }]}>{item.name}</Text>
                </View>
              ))
            )}
          </View>
        </View>

        {/* Complete your look */}
        <Text style={[styles.sectionTitle, { marginTop: 12, color: colors.text }]}>Complete Your Look</Text>

        {/* Watch row */}
        <View style={[styles.suggestionRow, { backgroundColor: colors.card }]}>
          <Image
            source={require("../../assets/images/categories/men/watches.jpg")}
            style={styles.suggestionImg}
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[styles.suggestionTitle, { color: colors.text }]}>Brown Leather Watch</Text>
            <Text style={[styles.suggestionSub, { color: colors.textSecondary }]}>Complements casual style</Text>
          </View>
          <TouchableOpacity style={styles.cartBtn}>
            <Feather name="shopping-cart" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Perfume row */}
        <View style={[styles.suggestionRow, { backgroundColor: colors.card }]}>
          <Image
            source={require("../../assets/images/categories/men/perfume.jpg")}
            style={styles.suggestionImg}
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[styles.suggestionTitle, { color: colors.text }]}>Black Night Perfume</Text>
            <Text style={[styles.suggestionSub, { color: colors.textSecondary }]}>Complements casual style</Text>
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
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionGhost, { backgroundColor: isDark ? colors.border : '#F1F1F1' }, { flex: 0.5, marginRight: 5, opacity: currentIndex > 0 ? 1 : 0.4 }]}
            onPress={handleUndo}
            disabled={currentIndex <= 0}
          >
            <Feather name="corner-up-left" size={20} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.actionGhost, { backgroundColor: isDark ? colors.border : '#F1F1F1' }, { flex: 1, marginHorizontal: 5 }]}
            onPress={handleRegenerate}
          >
            <Feather name="thumbs-down" size={20} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.actionGhost, { backgroundColor: isDark ? colors.border : '#F1F1F1' }, { flex: 1, marginHorizontal: 5 }]}
            onPress={handleRegenerate}
          >
            <Feather name="repeat" size={20} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.actionGhost, { backgroundColor: isDark ? colors.border : '#F1F1F1' }, { flex: 0.5, marginLeft: 5, opacity: currentIndex < history.length - 1 ? 1 : 0.4 }]}
            onPress={handleRedo}
            disabled={currentIndex >= history.length - 1}
          >
            <Feather name="corner-up-right" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
        <View style={[styles.actionsRow, { marginTop: 10 }]}>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.text }, { flex: 1, marginLeft: 0 }]} onPress={handleSave}>
            <Text style={[styles.actionText, { color: colors.background }]}>Save This Look</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = (colors: any, dark: boolean) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background , paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
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
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  outfitRow: { flexDirection: "row", justifyContent: "flex-start" },
  outfitItem: { alignItems: "center", marginRight: 24 },
  outfitImg: { width: 130, height: 110, borderRadius: 10, resizeMode: "cover" },
  outfitLabel: { marginTop: 8, fontWeight: "700" },

  suggestionRow: {
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  suggestionImg: { width: 64, height: 64, borderRadius: 10, resizeMode: "cover" },
  suggestionTitle: { fontWeight: "800", fontSize: 16 },
  suggestionSub: { marginTop: 2 },

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
    marginRight: 10,
  },
  actionText: { fontWeight: "800", fontSize: 16 },
});

export default SuggestedOutfitScreen;
