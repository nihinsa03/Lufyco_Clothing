import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  TextInput,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useCartStore } from "../store/useCartStore";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "MyCart">;
const { width } = Dimensions.get("window");

const MyCartScreen: React.FC<Props> = ({ navigation }) => {
  const { items, incrementQty, decrementQty, removeItem, getTotalPrice, clearCart } = useCartStore();
  const [voucher, setVoucher] = useState("");
  const [discount, setDiscount] = useState(0);

  const subtotal = getTotalPrice();
  const shipping = subtotal > 0 ? 10.00 : 0;
  const total = subtotal + shipping - discount;

  const handleApplyVoucher = () => {
    if (voucher.toLowerCase() === 'save10') {
      setDiscount(10);
      Alert.alert("Voucher Applied", "$10.00 discount applied.");
    } else {
      Alert.alert("Invalid Voucher", "Try 'SAVE10'");
    }
  };

  const handleCheckout = () => {
    navigation.navigate("CheckoutShipping");
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Cart</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.emptyContainer}>
          <View style={styles.emptyCircle}>
            <Image
              source={require("../../assets/images/bag.png")} // Fallback or use placeholder
              style={styles.emptyImg}
            />
          </View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySub}>Looks like you haven't added anything to your cart yet.</Text>

          <TouchableOpacity style={styles.exploreBtn} onPress={() => navigation.navigate("Home")}>
            <Text style={styles.exploreText}>Explore Categories</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart</Text>
        <TouchableOpacity>
          <Text style={styles.voucherLink}>Voucher Code</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        {items.map((item) => (
          <View key={item.id} style={styles.cartItem}>
            <Image
              source={typeof item.image === 'string' ? { uri: item.image } : item.image}
              style={styles.itemThumb}
            />
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
              <View style={styles.variantRow}>
                <Text style={styles.variantText}>Size: {item.size || 'N/A'}</Text>
                <View style={[styles.variantColor, { backgroundColor: item.color || '#000' }]} />
              </View>
              <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
            </View>

            <View style={styles.rightCol}>
              <TouchableOpacity onPress={() => removeItem(item.id)} style={{ alignSelf: 'flex-end', padding: 4 }}>
                <Feather name="trash-2" size={18} color="#EF4444" />
              </TouchableOpacity>

              <View style={styles.stepper}>
                <TouchableOpacity onPress={() => decrementQty(item.id)} style={styles.stepBtn}>
                  <Feather name="minus" size={14} />
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.qty}</Text>
                <TouchableOpacity onPress={() => incrementQty(item.id)} style={styles.stepBtn}>
                  <Feather name="plus" size={14} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Order Info</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryVal}>${subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping Cost</Text>
          <Text style={styles.summaryVal}>${shipping.toFixed(2)}</Text>
        </View>
        {discount > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Discount</Text>
            <Text style={[styles.summaryVal, { color: 'green' }]}>-${discount.toFixed(2)}</Text>
          </View>
        )}
        <View style={[styles.summaryRow, { marginTop: 12 }]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalVal}>${total.toFixed(2)}</Text>
        </View>

        {/* Voucher Input */}
        <View style={styles.voucherBox}>
          <Text style={styles.voucherLabel}>Voucher Code</Text>
          <View style={styles.voucherInputRow}>
            <TextInput
              style={styles.voucherInput}
              placeholder="Enter voucher code"
              value={voucher}
              onChangeText={setVoucher}
            />
            <TouchableOpacity style={styles.applyBtn} onPress={handleApplyVoucher}>
              <Text style={styles.applyText}>APPLY</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
          <Text style={styles.checkoutText}>Checkout (${total.toFixed(2)})</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderColor: '#F3F4F6'
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111' },
  voucherLink: { color: '#2563EB', fontWeight: '600', fontSize: 14 },

  // Empty State
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emptyCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  emptyImg: { width: 60, height: 60, opacity: 0.5 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: '#111', marginBottom: 8 },
  emptySub: { textAlign: 'center', color: '#666', lineHeight: 22, fontSize: 14 },
  exploreBtn: { marginTop: 30, backgroundColor: '#111', paddingHorizontal: 30, paddingVertical: 14, borderRadius: 12 },
  exploreText: { color: '#fff', fontWeight: '700' },

  // List
  cartItem: { flexDirection: 'row', marginBottom: 20, backgroundColor: '#F9FAFB', padding: 10, borderRadius: 16 },
  itemThumb: { width: 80, height: 80, borderRadius: 12, backgroundColor: '#eee' },
  itemInfo: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  itemTitle: { fontSize: 16, fontWeight: '700', color: '#111', marginBottom: 4 },
  variantRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  variantText: { fontSize: 13, color: '#666' },
  variantColor: { width: 12, height: 12, borderRadius: 6, marginLeft: 8, borderWidth: 1, borderColor: '#ddd' },
  itemPrice: { fontSize: 16, fontWeight: '700', color: '#111' },

  rightCol: { justifyContent: 'space-between', alignItems: 'flex-end' },
  stepper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  stepBtn: { padding: 6 },
  qtyText: { width: 20, textAlign: 'center', fontSize: 14, fontWeight: '600' },

  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 20 },

  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { color: '#666', fontSize: 14 },
  summaryVal: { color: '#111', fontSize: 14, fontWeight: '600' },
  totalLabel: { fontSize: 18, fontWeight: '800' },
  totalVal: { fontSize: 18, fontWeight: '800' },

  voucherBox: { marginTop: 30 },
  voucherLabel: { fontSize: 14, fontWeight: '700', marginBottom: 8, color: '#444' },
  voucherInputRow: { flexDirection: 'row' },
  voucherInput: {
    flex: 1, height: 48, borderWidth: 1, borderColor: '#E5E7EB',
    borderRadius: 12, paddingHorizontal: 12, backgroundColor: '#F9FAFB'
  },
  applyBtn: {
    marginLeft: 12, backgroundColor: '#111', borderRadius: 12,
    paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center'
  },
  applyText: { color: '#fff', fontWeight: '700', fontSize: 12 },

  footer: { position: 'absolute', bottom: 0, width: '100%', padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#F3F4F6' },
  checkoutBtn: { backgroundColor: '#111', paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  checkoutText: { color: '#fff', fontWeight: '700', fontSize: 16 }
});

export default MyCartScreen;
