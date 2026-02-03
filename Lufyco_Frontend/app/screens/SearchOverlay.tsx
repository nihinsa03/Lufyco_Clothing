import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useApi } from "../hooks/useApi"; // ADDED

type Props = {
  visible: boolean;
  onClose: () => void;
  onOpenFilter?: () => void;
  onSearch?: (query: string) => void;
};

const RECENT = [
  "Blue Shirt",
  "White Shirt",
  "Black Shirt",
  "Red Shirt",
  "Purple Shirt",
  "Orange Shirt",
];

const SearchOverlay: React.FC<Props> = ({ visible, onClose, onOpenFilter, onSearch }) => {
  const [query, setQuery] = useState("");
  const { data: searchResults, loading, error, get } = useApi<any[]>();

  // Debounce could be added, but for now we search on Submit
  const handleSearch = async () => {
    if (!query.trim()) return;
    await get('/products', { search: query });
    if (onSearch) onSearch(query);
  };

  const results = (query.trim().length > 0 && searchResults) ? searchResults : RECENT.filter((t) =>
    query.trim().length
      ? t.toLowerCase().includes(query.toLowerCase())
      : true
  );

  return (
    <Modal animationType="slide" presentationStyle="fullScreen" visible={visible}>
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Fashion</Text>
          <TouchableOpacity onPress={onClose} style={styles.iconBtn}>
            <Feather name="x" size={26} />
          </TouchableOpacity>
        </View>

        {/* Search bar */}
        <View style={styles.searchWrap}>
          <Feather name="search" size={20} style={{ marginLeft: 10 }} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search"
            style={styles.input}
            placeholderTextColor="#8e8e93"
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {loading && <ActivityIndicator size="small" color="#000" style={{ marginRight: 5 }} />}
          <TouchableOpacity
            onPress={onOpenFilter}
            style={[styles.iconBtn, { marginRight: 6 }]}
          >
            <Feather name="sliders" size={20} />
          </TouchableOpacity>
        </View>

        {/* Results */}
        <Text style={styles.sectionLabel}>{loading ? "SEARCHING..." : "RESULTS"}</Text>

        {error ? (
          <Text style={{ padding: 20, color: 'red' }}>{error}</Text>
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item: any) => typeof item === 'string' ? item : item._id || item.id}
            ItemSeparatorComponent={() => (
              <View style={{ height: 1, backgroundColor: "#F0F0F0" }} />
            )}
            renderItem={({ item }) => {
              const label = typeof item === 'string' ? item : item.name || item.title;
              return (
                <TouchableOpacity style={styles.row} onPress={() => {
                  setQuery(label);
                  if (onSearch) onSearch(label);
                }}>
                  <Text style={styles.rowText}>{label}</Text>
                  <Feather name="corner-right-up" size={22} color="#C4C4C6" />
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <View style={{ padding: 24 }}>
                <Text style={{ color: "#8e8e93" }}>No results found.</Text>
              </View>
            }
          />
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 12,
    justifyContent: "space-between",
  },
  title: { fontSize: 28, fontWeight: "800" },
  iconBtn: { padding: 6 },

  searchWrap: {
    marginHorizontal: 18,
    marginBottom: 14,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F6F6F7",
    flexDirection: "row",
    alignItems: "center",
  },
  input: { flex: 1, paddingHorizontal: 10, fontSize: 16 },

  sectionLabel: {
    marginTop: 4,
    marginBottom: 8,
    marginHorizontal: 18,
    fontSize: 12,
    fontWeight: "700",
    color: "#707077",
    letterSpacing: 0.4,
  },

  row: {
    paddingHorizontal: 18,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowText: { fontSize: 16 },
});

export default SearchOverlay;
