import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, SafeAreaView, Dimensions, ScrollView } from 'react-native';
import { useShopStore } from '../store/useShopStore';
import { useNavigation } from '@react-navigation/native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { mockCategories, Category } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

// Sidebar categories data with actual product images
const SIDEBAR_ITEMS = [
  { id: 'men', name: "Men's Wear", image: require('../../assets/images/categories/men/mens_wear_hero.png') },
  { id: 'women', name: "Women's Wear", image: require('../../assets/images/categories/women/womens_wear_hero.png') },
  { id: 'kids', name: "Kids's Wear", image: require('../../assets/images/categories/kids_wear_hero.png') },
  { id: 'footwear', name: "Foot Wear", image: require('../../assets/images/categories/footwear/footwear_hero_new.jpg') },
  { id: 'beauty', name: "Beauty Products", image: require('../../assets/images/categories/beauty/beauty_hero_new.jpg') },
  { id: 'jewellery', name: "Jewellery", image: require('../../assets/images/categories/jewellery/jewellery.png') },
  { id: 'accessories', name: "Accessories", image: require('../../assets/images/categories/accessories/handbag_hero.png') },
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
  const { colors, isDark } = useTheme();

  // Categories that have sections (multi-row layouts like Casual, Work, Sports)
  const MEN_SECTIONS = [
    {
      title: "Casual Wear",
      items: [
        { id: "cat_casual_shirts", name: "SHIRTS", image: require("../../assets/images/men/casual/shirts.jpg") },
        { id: "cat_casual_jeans", name: "JEANS", image: require("../../assets/images/men/casual/jeans.jpg") },
        { id: "cat_casual_tshirts", name: "TSHIRTS", image: require("../../assets/images/men/casual/tshirts.jpg") },
        { id: "cat_casual_trousers", name: "TROUSERS", image: require("../../assets/images/men/casual/trousers.jpg") },
        { id: "cat_casual_shorts", name: "SHORTS", image: require("../../assets/images/men/casual/shorts.jpg") },
        { id: "cat_casual_trackpants", name: "TRACK PANTS", image: require("../../assets/images/men/casual/trackpants.jpg") },
        { id: "cat_casual_jackets", name: "JACKETS", image: require("../../assets/images/men/casual/jackets.jpg") },
        { id: "cat_casual_sweater", name: "SWEATER", image: require("../../assets/images/men/casual/sweater.jpg") },
      ],
    },
    {
      title: "Work Wear",
      items: [
        { id: "cat_work_shirts", name: "FORMAL SHIRTS", image: require("../../assets/images/men/work/formal-shirts.jpg") },
        { id: "cat_work_blazers", name: "BLAZERS", image: require("../../assets/images/men/work/blazers.jpg") },
        { id: "cat_work_trousers", name: "FORMAL TROUSERS", image: require("../../assets/images/men/work/formal-trousers.jpg") },
        { id: "cat_work_ties", name: "TIES", image: require("../../assets/images/men/work/ties.jpg") },
        { id: "cat_work_shoes", name: "FORMAL SHOES", image: require("../../assets/images/men/work/formal-shoes.jpg") },
      ],
    },
    {
      title: "Sports Wear",
      items: [
        { id: "cat_sports_tshirts", name: "TSHIRTS", image: require("../../assets/images/men/sports/sports-tshirts.jpg") },
        { id: "cat_sports_trackpants", name: "TRACK PANTS", image: require("../../assets/images/men/sports/track-pants.jpg") },
        { id: "cat_sports_jackets", name: "JACKETS", image: require("../../assets/images/men/sports/s-jackets.jpg") },
        { id: "cat_sports_shorts", name: "SHORTS", image: require("../../assets/images/men/sports/s-shorts.jpg") },
        { id: "cat_sports_tracksuits", name: "TRACKSUITS", image: require("../../assets/images/men/sports/s-tracksuits.jpg") },
      ],
    },
  ];

  const WOMEN_SECTIONS = [
    {
      title: "Western Wear",
      items: [
        { id: "cat_women_dresses", name: "DRESSES", image: require("../../assets/images/categories/women/dresses.jpg") },
        { id: "cat_women_tops", name: "TOPS", image: require("../../assets/images/categories/women/tops_new.jpg") },
        { id: "cat_women_jeans", name: "JEANS", image: require("../../assets/images/categories/women/jeans.jpg") },
        { id: "cat_women_trousers", name: "TROUSERS", image: require("../../assets/images/categories/women/trousers.jpg") },
        { id: "cat_women_tshirts", name: "T-SHIRTS", image: require("../../assets/images/categories/women/tshirts.jpg") },
        { id: "cat_women_shirts", name: "SHIRTS", image: require("../../assets/images/categories/women/shirts.jpg") },
      ]
    },
    {
      title: "Ethnic Wear",
      items: [
        { id: "cat_women_anarkali", name: "ANARKALI", image: require("../../assets/images/categories/women/anarkali.jpg") },
        { id: "cat_women_sarees", name: "SAREES", image: require("../../assets/images/categories/women/sarees.jpg") },
        { id: "cat_women_lehenga", name: "LEHENGA", image: require("../../assets/images/categories/women/lehenga.jpg") },
        { id: "cat_women_kurtas", name: "KURTAS", image: require("../../assets/images/categories/women/kurtas_new.jpg") },
      ]
    },
    {
      title: "Sports Wear",
      items: [
        { id: "cat_women_sports_tshirt", name: "T-SHIRTS", image: require("../../assets/images/categories/women/sports_tshirt.jpg") },
        { id: "cat_women_sports_sweatshirt", name: "SWEATSHIRTS", image: require("../../assets/images/categories/women/sports_sweatshirt.jpg") },
        { id: "cat_women_sports_trackpants", name: "TRACK PANTS", image: require("../../assets/images/categories/women/sports_trackpants.jpg") },
        { id: "cat_women_sports_shorts", name: "SHORTS", image: require("../../assets/images/categories/women/sports_shorts.jpg") },
        { id: "cat_women_sports_jackets", name: "JACKETS", image: require("../../assets/images/categories/women/sports_jackets.jpg") },
      ]
    }
  ];

  const KIDS_SECTIONS = [
    {
      title: "For Girls",
      items: [
        { id: "cat_kids_girls_dresses", name: "DRESSES", image: require("../../assets/images/categories/kids/dresses.jpg") },
        { id: "cat_kids_girls_tops", name: "TOPS & TSHIRTS", image: require("../../assets/images/categories/kids/tops_tshirts.jpg") },
        { id: "cat_kids_girls_clothing_sets", name: "CLOTHING SETS", image: require("../../assets/images/categories/kids/clothing_sets.jpg") },
        { id: "cat_kids_girls_shorts_skirts", name: "SHORTS & SKIRTS", image: require("../../assets/images/categories/kids/shorts_skirts.jpg") },
        { id: "cat_kids_girls_jeans", name: "JEANS", image: require("../../assets/images/categories/kids/jeans.jpg") },
        { id: "cat_kids_girls_footwear", name: "FOOT WEAR", image: require("../../assets/images/categories/kids/footwear.jpg") },
      ]
    },
    {
      title: "For Boys",
      items: [
        { id: "cat_kids_boys_tshirts", name: "TSHIRTS", image: require("../../assets/images/categories/kids/boys_tshirts.jpg") },
        { id: "cat_kids_boys_clothing_sets", name: "CLOTHING SETS", image: require("../../assets/images/categories/kids/boys_clothing_sets.jpg") },
        { id: "cat_kids_boys_jeans", name: "JEANS", image: require("../../assets/images/categories/kids/boys_jeans.jpg") },
        { id: "cat_kids_boys_shirts", name: "SHIRTS", image: require("../../assets/images/categories/kids/boys_shirts.jpg") },
        { id: "cat_kids_boys_footwear", name: "FOOT WEAR", image: require("../../assets/images/categories/kids/boys_footwear.jpg") },
      ]
    }
  ];

  const FOOTWEAR_SECTIONS = [
    {
      title: "Women's Footwear",
      items: [
        { id: "cat_footwear_women_heels", name: "HEELS", image: require("../../assets/images/categories/footwear/women_heels.jpg") },
        { id: "cat_footwear_women_flats", name: "FLATS", image: require("../../assets/images/categories/footwear/women_flats.jpg") },
        { id: "cat_footwear_women_casual", name: "CASUAL SHOES", image: require("../../assets/images/categories/footwear/women_casual.jpg") },
        { id: "cat_footwear_women_boots", name: "BOOTS", image: require("../../assets/images/categories/footwear/women_boots.jpg") },
        { id: "cat_footwear_women_sports", name: "SPORTS SHOES", image: require("../../assets/images/categories/footwear/women_sports.jpg") },
      ]
    },
    {
      title: "Men's Footwear",
      items: [
        { id: "cat_footwear_men_casual", name: "CASUAL SHOES", image: require("../../assets/images/categories/footwear/men_casual.jpg") },
        { id: "cat_footwear_men_sports", name: "SPORTS SHOES", image: require("../../assets/images/categories/footwear/men_sports.jpg") },
        { id: "cat_footwear_men_formal", name: "FORMAL SHOES", image: require("../../assets/images/categories/footwear/men_formal.jpg") },
        { id: "cat_footwear_men_sandals", name: "SANDALS", image: require("../../assets/images/categories/footwear/men_sandals.jpg") },
        { id: "cat_footwear_men_boots", name: "BOOTS", image: require("../../assets/images/categories/footwear/men_boots.jpg") },
      ]
    }
  ];

  const subCategories = getSubCategories(selectedCategory);

  // All items in the grid
  const gridItems = subCategories;

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
    <TouchableOpacity key={item.id} style={styles.subCategoryItem} onPress={() => navigation.navigate('SubCategoryProducts', { title: item.name, categoryId: item.id })}>
      <View style={[styles.subCategoryImageContainer, { backgroundColor: colors.iconBg }]}>
        <Image source={item.image} style={styles.subCategoryImage} resizeMode="cover" />
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
          {selectedCategory === 'men' ? (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 15 }}>
              {MEN_SECTIONS.map((section) => (
                <View key={section.title} style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.title}</Text>
                  <View style={styles.sectionGrid}>
                    {section.items.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={styles.sectionItem}
                        onPress={() => navigation.navigate('SubCategoryProducts', { title: `MEN ${item.name}`, categoryId: item.id })}
                      >
                        <Image source={item.image} style={[styles.sectionItemImage, { backgroundColor: colors.iconBg }]} />
                        <Text style={[styles.sectionItemName, { color: colors.textSecondary }]}>{item.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>
          ) : selectedCategory === 'women' ? (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 15 }}>
              {WOMEN_SECTIONS.map((section) => (
                <View key={section.title} style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.title}</Text>
                  <View style={styles.sectionGrid}>
                    {section.items.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={styles.sectionItem}
                        onPress={() => navigation.navigate('SubCategoryProducts', { title: `WOMEN ${item.name}`, categoryId: item.id })}
                      >
                        <Image source={item.image} style={[styles.sectionItemImage, { backgroundColor: colors.iconBg }]} />
                        <Text style={[styles.sectionItemName, { color: colors.textSecondary }]}>{item.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>
          ) : selectedCategory === 'kids' ? (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 15 }}>
              {KIDS_SECTIONS.map((section) => (
                <View key={section.title} style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.title}</Text>
                  <View style={styles.sectionGrid}>
                    {section.items.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={styles.sectionItem}
                        onPress={() => navigation.navigate('SubCategoryProducts', { title: `KIDS ${item.name}`, categoryId: item.id })}
                      >
                        <Image source={item.image} style={[styles.sectionItemImage, { backgroundColor: colors.iconBg }]} />
                        <Text style={[styles.sectionItemName, { color: colors.textSecondary }]}>{item.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>
          ) : selectedCategory === 'footwear' ? (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 15 }}>
              {FOOTWEAR_SECTIONS.map((section) => (
                <View key={section.title} style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.title}</Text>
                  <View style={styles.sectionGrid}>
                    {section.items.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={styles.sectionItem}
                        onPress={() => navigation.navigate('SubCategoryProducts', { title: item.name, categoryId: item.id })}
                      >
                        <Image source={item.image} style={[styles.sectionItemImage, { backgroundColor: colors.iconBg }]} />
                        <Text style={[styles.sectionItemName, { color: colors.textSecondary }]}>{item.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>
          ) : subCategories.length > 0 ? (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 15 }}>
              {/* Grid: All items */}
              <View style={styles.gridContainer}>
                {gridItems.map(item => renderGridItem(item))}
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
