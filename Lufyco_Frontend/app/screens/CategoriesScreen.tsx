import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, SafeAreaView, Dimensions, ScrollView, Platform, StatusBar } from "react-native";
import { useShopStore } from '../store/useShopStore';
import { useNavigation } from '@react-navigation/native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Category } from '../types';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

// Sidebar categories data with actual product images
const SIDEBAR_ITEMS = [
  { id: 'men', name: "Men's Wear", image: require('../../assets/images/categories/men/mens_wear_hero.png') },
  { id: 'women', name: "Women's Wear", image: require('../../assets/images/categories/women/womens_wear_hero.png') },
  { id: 'kids', name: "Kids' Wear", image: require('../../assets/images/categories/kids_wear_hero.png') },
  { id: 'footwear', name: "Footwear", image: require('../../assets/images/categories/footwear/footwear_hero_new.jpg') },
  { id: 'jewellery', name: "Jewellery", image: require('../../assets/images/categories/jewellery/jewellery.png') },
  { id: 'beauty', name: "Beauty Products", image: require('../../assets/images/categories/beauty/beauty_hero_new.jpg') },
  { id: 'accessories', name: "Accessories", image: require('../../assets/images/categories/accessories/handbag_hero.png') },
];

// Map sidebar ID to store categories filter or specific subcategories
const getSubCategories = (sidebarId: string, storeCategories: Category[]) => {
  switch (sidebarId) {
    case 'men':
      return storeCategories.filter(c => c.gender === 'men');
    case 'women':
      return storeCategories.filter(c => c.gender === 'women');
    case 'footwear':
      return storeCategories.filter(c =>
        c.id.includes('shoes') || c.id.includes('heels') || c.name.toLowerCase().includes('shoe')
      );
    case 'kids':
      return storeCategories.filter(c =>
        ['cat_tshirts', 'cat_jeans', 'cat_dresses', 'cat_sports_shoes', 'cat_jackets', 'cat_sweater'].includes(c.id)
      );
    case 'beauty':
      return storeCategories.filter(c =>
        ['cat_skincare', 'cat_makeup', 'cat_haircare', 'cat_nailpolish', 'cat_perfume'].includes(c.id)
      );
    case 'jewellery':
      return storeCategories.filter(c =>
        ['cat_necklaces', 'cat_rings', 'cat_earrings', 'cat_bracelets'].includes(c.id)
      );
    case 'accessories':
      return storeCategories.filter(c =>
        ['cat_handbags', 'cat_watches', 'cat_belts', 'cat_sunglasses'].includes(c.id)
      );
    default:
      return storeCategories;
  }
};

const CategoriesScreen = () => {
  const { setFilter, resetFilters, categories } = useShopStore();
  const navigation = useNavigation<any>();
  const [selectedCategory, setSelectedCategory] = useState<string>('men');
  const { colors, isDark } = useTheme();



  const subCategories = getSubCategories(selectedCategory, categories);

  // All items in the grid
  const gridItems = subCategories;

  const handleSubCategoryPress = (catId: string, catName: string) => {
    // Single atomic update: reset all flags + set the category in one go
    // This prevents the persisted store from overriding partial updates
    setFilter({
      query: '',
      newArrivals: false,
      popularThisWeek: false,
      priceDropping: false,
      discountOnly: false,
      popularity: false,
      priceLowToHigh: false,
      priceHighToLow: false,
      priceMin: undefined,
      priceMax: undefined,
      categoryId: catId,
    });

    let searchParams: any = { title: catName, category: catName };

    // Map the selectedCategory to correct gender or category filters for the ProductListing
    if (selectedCategory === 'men') searchParams = { gender: 'Men', search: catName, title: catName };
    else if (selectedCategory === 'women') searchParams = { gender: 'Women', search: catName, title: catName };
    else if (selectedCategory === 'kids') searchParams = { gender: 'Kids', search: catName, title: catName };
    else if (selectedCategory === 'footwear') searchParams = { category: 'Shoes', search: catName, title: catName };
    else searchParams = { search: catName, title: catName };

    navigation.navigate('ProductListing', searchParams);
  };

  const renderSidebarItem = ({ item }: { item: any }) => {
    const isActive = selectedCategory === item.id;
    return (
      <TouchableOpacity
        style={[styles.sidebarItem, isActive && { backgroundColor: isDark ? '#1E293B' : '#F0F7FF' }]}
        onPress={() => setSelectedCategory(item.id)}
      >
        <View style={[styles.imageBox, { backgroundColor: colors.iconBg }]}>
          <Image
            source={item.image}
            style={styles.sidebarImage}
            resizeMode="contain"
          />
        </View>
        <Text style={[styles.sidebarText, { color: colors.textSecondary }]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderGridItem = (item: Category) => (
    <TouchableOpacity key={item.id} style={styles.subCategoryItem} onPress={() => handleSubCategoryPress(item.id, item.name)}>
      <View style={[styles.subCategoryImageContainer, { backgroundColor: colors.iconBg }]}>
        <Image source={typeof item.image === 'string' ? { uri: item.image } : item.image} style={styles.subCategoryImage} resizeMode="cover" />
      </View>
      <Text style={[styles.subCategoryName, { color: colors.text }]}>{item.name}</Text>
    </TouchableOpacity>
  );



  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 15 }}>
            <Feather name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Categories</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <Feather name="bell" size={22} color={colors.text} style={{ marginRight: 15 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <Feather name="heart" size={22} color={colors.text} style={{ marginRight: 15 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <Feather name="user" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.contentContainer}>
        {/* Left Sidebar */}
        <View style={[styles.sidebar, { backgroundColor: colors.card, borderColor: isDark ? '#1E3A8A' : '#3B82F6' }]}>
          <FlatList
            data={SIDEBAR_ITEMS}
            keyExtractor={item => item.id}
            renderItem={renderSidebarItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 10 }}
          />
        </View>

        {/* Right Content Area */}
        <View style={[styles.mainContent, { backgroundColor: colors.background }]}>
          {subCategories.length > 0 ? (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 15 }}>
              <View style={styles.gridContainer}>
                {subCategories.map(item => renderGridItem(item))}
              </View>
            </ScrollView>
          ) : (
            <View style={styles.emptyState}>
              <Feather name="package" size={40} color="#ccc" />
              <Text style={styles.emptyText}>No items found</Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" , paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, alignItems: 'center',
    borderBottomWidth: 1, borderBottomColor: '#F3F4F6', backgroundColor: '#fff'
  },
  title: { fontSize: 20, fontWeight: '600', color: '#111' },
  headerRight: { flexDirection: 'row' },

  contentContainer: { flex: 1, flexDirection: 'row' },

  // Sidebar
  sidebar: {
    width: 90,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#3B82F6', // Blue border like Figma
    borderRadius: 20,
    margin: 10
  },
  sidebarItem: { alignItems: 'center', paddingVertical: 15, width: '100%' },
  sidebarItemActive: { backgroundColor: '#F0F7FF' }, // Light blue background for active

  imageBox: {
    width: 56,
    height: 56,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 6,
    backgroundColor: '#F3F4F6'
  },
  sidebarImage: { width: '100%', height: '100%' },

  sidebarText: { fontSize: 10, textAlign: 'center', color: '#4B5563', fontWeight: '500', paddingHorizontal: 4 },

  // Main Content
  mainContent: { flex: 1, backgroundColor: '#fff' },

  // Grid (first 2 rows)
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  subCategoryItem: { width: '47%', marginBottom: 15, alignItems: 'center' },
  subCategoryImageContainer: { width: '100%', aspectRatio: 1, borderRadius: 12, overflow: 'hidden', marginBottom: 8, backgroundColor: '#F9FAFB' },
  subCategoryImage: { width: '100%', height: '100%' },
  subCategoryName: { fontSize: 13, fontWeight: '500', color: '#111', textAlign: 'center' },

  // Sections (like Men's Wear Casual/Work layout)
  section: { marginBottom: 22 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 12, color: '#111' },
  sectionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  sectionItem: {
    width: "30%",
    marginRight: "3.3%", // ≈ 3 items per row
    marginBottom: 20,
    alignItems: "center",
  },
  sectionItemImage: {
    width: 80,
    height: 90,
    borderRadius: 10,
    resizeMode: "cover",
    backgroundColor: '#F9FAFB',
  },
  sectionItemName: {
    fontSize: 10,
    marginTop: 8,
    textAlign: "center",
    fontWeight: "600",
    color: '#333',
    textTransform: 'uppercase'
  },


  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { marginTop: 10, color: '#999', fontSize: 14 },
});

export default CategoriesScreen;
