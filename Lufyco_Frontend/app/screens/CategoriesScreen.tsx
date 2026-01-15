import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { useShopStore } from '../store/useShopStore';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const COLUMN_count = 3;
const ITEM_WIDTH = (width - 40) / COLUMN_count;

const CategoriesScreen = () => {
  const { categories, setCategory } = useShopStore();
  const navigation = useNavigation<any>();

  const handlePress = (catId: string) => {
    setCategory(catId);
    navigation.navigate('CategoryProducts');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
        <TouchableOpacity>
          <Feather name="search" size={22} color="#111" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={categories}
        keyExtractor={item => item.id}
        numColumns={COLUMN_count}
        contentContainerStyle={{ padding: 20 }}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => handlePress(item.id)}>
            <View style={styles.imageBox}>
              <Image source={item.image} style={styles.image} resizeMode="cover" />
            </View>
            <Text style={styles.name}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '800', color: '#111' },

  item: { width: ITEM_WIDTH, alignItems: 'center' },
  imageBox: { width: ITEM_WIDTH, height: ITEM_WIDTH * 1.2, borderRadius: 12, overflow: 'hidden', marginBottom: 8, backgroundColor: '#F3F4F6' },
  image: { width: '100%', height: '100%' },
  name: { fontSize: 13, fontWeight: '600', color: '#333' },
});

export default CategoriesScreen;
