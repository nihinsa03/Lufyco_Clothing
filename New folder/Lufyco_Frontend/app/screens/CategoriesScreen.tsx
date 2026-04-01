import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, SafeAreaView, Dimensions, ScrollView, Platform, StatusBar, ActivityIndicator } from "react-native";
import { useShopStore } from '../store/useShopStore';
import { useNavigation } from '@react-navigation/native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Category } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';
import api from '../api/api';
import { useRoute } from '@react-navigation/native';
  

const { width } = Dimensions.get('window');

// Sidebar categories data with actual product images
const SIDEBAR_ITEMS = [
  { id: 'men', name: "Men's Wear", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=500" },
  { id: 'women', name: "Women's Wear", image: require('../../assets/images/categories/women/womens_wear_hero.png') },
  { id: 'kids', name: "Kids' Wear", image: require('../../assets/images/categories/kids_wear_hero.png') },
  { id: 'footwear', name: "Footwear", image: require('../../assets/images/categories/footwear/footwear_hero_new.jpg') },
  { id: 'jewellery', name: "Jewellery", image: require('../../assets/images/categories/jewellery/jewellery.png') },
  { id: 'beauty', name: "Beauty Products", image: require('../../assets/images/categories/beauty/beauty_hero_new.jpg') },
  { id: 'accessories', name: "Accessories", image: require('../../assets/images/categories/accessories/handbag_hero.png') },
];

// Map sidebar ID to store categories filter or specific subcategories
const getSubCategories = (sidebarId: string, storeCategories: Category[], ) => {
  const { categories } = useShopStore();
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
  const [sidebarItems, setSidebarItems] = useState(categories);
  const [fetchedSections, setFetchedSections] = useState<any[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const { colors, isDark } = useTheme();
  const route = useRoute();
  const { c_id, name, foo } = route.params || {};

  const CATEGORY_ORDER = [
  "Men",
  "Women",
  "Kids",
  "Unisex",
  "Shoes",
  "Jewellery",
  "Accessories",
  "Beauty"
];

const sortCategories = (categories: any[]) => {
  return categories.sort((a, b) => {
    const indexA = CATEGORY_ORDER.indexOf(a.name);
    const indexB = CATEGORY_ORDER.indexOf(b.name);

    // If not found, push to end
    const safeA = indexA === -1 ? Number.MAX_SAFE_INTEGER : indexA;
    const safeB = indexB === -1 ? Number.MAX_SAFE_INTEGER : indexB;

    return safeA - safeB;
  });
};

  // Fetch main categories from /products/categories
  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        console.log('[CategoriesScreen] Fetching categories from /products/categories...');
        const res = await api.get('/products/categories');
        console.log('[CategoriesScreen] Categories response:', res.data);

        // Handle different API response formats
        const fetchedCategories: Category[] = res.data?.categories || res.data?.data?.categories || res.data || [];
        const sortedCategories = sortCategories(fetchedCategories);

        if (sortedCategories?.length > 0) {
          console.log('[CategoriesScreen] Setting sidebar items from API, count:', sortedCategories.length);
          setSidebarItems(sortedCategories);
        }
      } catch (err) {
        console.warn('[CategoriesScreen] Failed to fetch categories, using defaults.', err);
      }
    };

    fetchMainCategories();
    if(c_id){
    setSelectedCategory(c_id)
    handleSidebarItemPress(c_id, name);
    }
  }, []);

  // Fetch products by category when sidebar item is clicked
  const handleSidebarItemPress = async (itemId: string, itemName: string) => {
    setSelectedCategory(itemId);

    try {
      setIsLoadingCategories(true);
      console.log('[CategoriesScreen] Fetching products by category:', itemName);
      const res = await api.get(`/products/byCategoryUpdate?category=${itemName}`);
      console.log('[CategoriesScreen] Category products response:', res.data);

      // Transform API response to sections format
      const groups = res.data?.groups || [];
      if (groups?.length > 0) {
        setFetchedSections(groups);
        console.log('[CategoriesScreen] Fetched sections count:', groups?.length);
      }
    } catch (err) {
      console.warn('[CategoriesScreen] Failed to fetch category products.', err);
      setFetchedSections([]);
    } finally {
      setIsLoadingCategories(false);
    }
  }

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
        { id: "cat_kids_girls_footwear", name: "FOOTWEAR", image: require("../../assets/images/categories/kids/footwear.jpg") },
      ]
    },
    {
      title: "For Boys",
      items: [
        { id: "cat_kids_boys_tshirts", name: "TSHIRTS", image: require("../../assets/images/categories/kids/boys_tshirts.jpg") },
        { id: "cat_kids_boys_clothing_sets", name: "CLOTHING SETS", image: require("../../assets/images/categories/kids/boys_clothing_sets.jpg") },
        { id: "cat_kids_boys_jeans", name: "JEANS", image: require("../../assets/images/categories/kids/boys_jeans.jpg") },
        { id: "cat_kids_boys_shirts", name: "SHIRTS", image: require("../../assets/images/categories/kids/boys_shirts.jpg") },
        { id: "cat_kids_boys_footwear", name: "FOOTWEAR", image: require("../../assets/images/categories/kids/boys_footwear.jpg") },
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
        onPress={() => handleSidebarItemPress(item.id, item.name)}
      >
        <View style={[styles.imageBox, { backgroundColor: colors.iconBg }]}>
          <Image
            source={typeof item.image === 'string' ? { uri: item.image } : item.image}
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
            data={sidebarItems}
            keyExtractor={item => item.id}
            renderItem={renderSidebarItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 10 }}
          />
        </View>

        {/* Right Content Area */}
<View style={[styles.mainContent, { backgroundColor: colors.background }]}>
  {isLoadingCategories ? (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#667eea" />
      <Text style={{ marginTop: 10, color: colors.text }}>Loading...</Text>
    </View>
  ) : fetchedSections?.length > 0 ? (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 15 }}>
      
      {fetchedSections.map((section: any, index: number) => (
        <View key={`${section.occasion}_${index}`} style={styles.section}>
          
          {/* Occasion Title */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {section.occasion}
          </Text>

          {/* Subcategory Grid */}
          <View style={styles.sectionGrid}>
            {section.subCategories?.map((sub: any, subIndex: number) => {
  const firstProduct = sub.products?.[0];
  if (!firstProduct) return null;

  let imageUri = "";

  if (Array.isArray(firstProduct.images) && firstProduct.images.length > 0) {
    imageUri = firstProduct.images[0];
  } else if (typeof firstProduct.images === "string") {
    imageUri = firstProduct.images;
  } else if (typeof firstProduct.image === "string") {
    imageUri = firstProduct.image;
  }

  return (
    <TouchableOpacity
      key={`${sub.subCategory}_${subIndex}`}
      style={styles.sectionItem}
      onPress={() =>
        navigation.navigate("ProductListing", {
          title: sub.subCategory,
          subCategory: sub.subCategory,
          category: section.occasion,
          productsN: sub.products,
        })
      }
    >
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={[styles.sectionItemImage, { backgroundColor: colors.iconBg }]}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.sectionItemImage, { backgroundColor: colors.iconBg, justifyContent: "center", alignItems: "center" }]}>
          <Text>No Image</Text>
        </View>
      )}

      <Text
        style={[styles.sectionItemName, { color: colors.textSecondary }]}
        numberOfLines={1}
      >
        {sub.subCategory}
      </Text>
    </TouchableOpacity>
  );
})}
          </View>
        </View>
      ))}

    </ScrollView>
  ) : (
    <View style={styles.emptyState}>
      <Feather name="package" size={40} color="#ccc" />
      <Text style={styles.emptyText}>Select a category</Text>
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
