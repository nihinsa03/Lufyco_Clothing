import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, SafeAreaView, Dimensions, ScrollView } from 'react-native';
import { useShopStore } from '../store/useShopStore';
import { useNavigation } from '@react-navigation/native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { mockCategories, Category } from '../data/mockData';

const { width } = Dimensions.get('window');

// Sidebar categories data with actual product images
const SIDEBAR_ITEMS = [
  { id: 'men', name: "Men's Wear", image: require('../../assets/images/categories/men/shirts.png') },
  { id: 'women', name: "Women's Wear", image: require('../../assets/images/categories/women/dresses.jpg') },
  { id: 'kids', name: "Kids's Wear", image: require('../../assets/images/categories/women/kurtas.jpg') }, // Using kurtas as placeholder for kids
  { id: 'footwear', name: "Foot Wear", image: require('../../assets/images/categories/men/casual-shoes.jpg') },
  { id: 'beauty', name: "Beauty Products", image: require('../../assets/images/categories/women/perfume.jpg') },
  { id: 'jewellery', name: "Jewellery", image: require('../../assets/images/categories/jewellery/jewellery.png') },
  { id: 'accessories', name: "Accessories", image: require('../../assets/images/categories/women/handbags.jpg') },
];

// Map sidebar ID to mockCategories filter or specific subcategories
const getSubCategories = (sidebarId: string) => {
  switch (sidebarId) {
    case 'men':
      return mockCategories.filter(c => c.gender === 'men');
    case 'women':
      return mockCategories.filter(c => c.gender === 'women');
    case 'footwear':
      return mockCategories.filter(c =>
        c.id.includes('shoes') || c.id.includes('heels') || c.name.toLowerCase().includes('shoe')
      );
    case 'kids':
      // Show a curated mix for kids
      return mockCategories.filter(c =>
        ['cat_tshirts', 'cat_jeans', 'cat_dresses', 'cat_sports_shoes', 'cat_jackets', 'cat_sweater'].includes(c.id)
      );
    case 'beauty':
      return mockCategories.filter(c =>
        ['cat_skincare', 'cat_makeup', 'cat_haircare', 'cat_nailpolish', 'cat_perfume'].includes(c.id)
      );
    case 'jewellery':
      return mockCategories.filter(c =>
        ['cat_necklaces', 'cat_rings', 'cat_earrings', 'cat_bracelets'].includes(c.id)
      );
    case 'accessories':
      return mockCategories.filter(c =>
        ['cat_handbags', 'cat_watches', 'cat_belts', 'cat_sunglasses'].includes(c.id)
      );
    default:
      return mockCategories;
  }
};

const CategoriesScreen = () => {
  const { setFilter, resetFilters } = useShopStore();
  const navigation = useNavigation<any>();
  const [selectedCategory, setSelectedCategory] = useState<string>('men');

  const subCategories = getSubCategories(selectedCategory);

  // Split into grid items (first 4 = 2 rows) and slider items (the rest)
  const gridItems = subCategories.slice(0, 4);
  const sliderItems = subCategories.slice(4);

  const handleSubCategoryPress = (catId: string) => {
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
    navigation.navigate('CategoryProducts');
  };

  const renderSidebarItem = ({ item }: { item: any }) => {
    const isActive = selectedCategory === item.id;
    return (
      <TouchableOpacity
        style={[styles.sidebarItem, isActive && styles.sidebarItemActive]}
        onPress={() => setSelectedCategory(item.id)}
      >
        <View style={styles.imageBox}>
          <Image
            source={item.image}
            style={styles.sidebarImage}
            resizeMode="cover"
          />
        </View>
        <Text style={styles.sidebarText}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderGridItem = (item: Category) => (
    <TouchableOpacity key={item.id} style={styles.subCategoryItem} onPress={() => handleSubCategoryPress(item.id)}>
      <View style={styles.subCategoryImageContainer}>
        <Image source={item.image} style={styles.subCategoryImage} resizeMode="cover" />
      </View>
      <Text style={styles.subCategoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderSliderItem = (item: Category) => (
    <TouchableOpacity key={item.id} style={styles.sliderItem} onPress={() => handleSubCategoryPress(item.id)}>
      <View style={styles.sliderImageContainer}>
        <Image source={item.image} style={styles.sliderImage} resizeMode="cover" />
      </View>
      <Text style={styles.sliderName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 15 }}>
            <Feather name="arrow-left" size={24} color="#111" />
          </TouchableOpacity>
          <Text style={styles.title}>Categories</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <Feather name="bell" size={22} color="#111" style={{ marginRight: 15 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <Feather name="heart" size={22} color="#111" style={{ marginRight: 15 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <Feather name="user" size={22} color="#111" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.contentContainer}>
        {/* Left Sidebar */}
        <View style={styles.sidebar}>
          <FlatList
            data={SIDEBAR_ITEMS}
            keyExtractor={item => item.id}
            renderItem={renderSidebarItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 10 }}
          />
        </View>

        {/* Right Content Area */}
        <View style={styles.mainContent}>
          {subCategories.length > 0 ? (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 15 }}>
              {/* Grid: First 2 rows (4 items) */}
              <View style={styles.gridContainer}>
                {gridItems.map(item => renderGridItem(item))}
              </View>

              {/* Horizontal Slider: Remaining items */}
              {sliderItems.length > 0 && (
                <View style={styles.sliderSection}>
                  <Text style={styles.sliderSectionTitle}>More</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingVertical: 5 }}
                  >
                    {sliderItems.map(item => renderSliderItem(item))}
                  </ScrollView>
                </View>
              )}
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
  safe: { flex: 1, backgroundColor: "#fff" },
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

  // Slider section
  sliderSection: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  sliderSectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
    marginBottom: 10,
  },
  sliderItem: {
    width: 100,
    marginRight: 12,
    alignItems: 'center',
  },
  sliderImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 6,
    backgroundColor: '#F9FAFB',
  },
  sliderImage: { width: '100%', height: '100%' },
  sliderName: { fontSize: 11, fontWeight: '500', color: '#4B5563', textAlign: 'center' },

  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { marginTop: 10, color: '#999', fontSize: 14 },
});

export default CategoriesScreen;
