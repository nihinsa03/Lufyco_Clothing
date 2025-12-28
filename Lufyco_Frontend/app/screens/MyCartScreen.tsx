import React, { useMemo, useState } from "react";
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
import { useCart } from "../context/CartContext";
import VoucherCodeSheet from "@/components/VoucherCodeSheet";


type Props = NativeStackScreenProps<RootStackParamList, "MyCart">;

const money = (n: number) => `$${n.toFixed(2)}`;

const MyCartScreen: React.FC<Props> = ({ navigation }) => {
  const { items, inc, dec, remove, toggle, subtotal } = useCart();

  // Voucher modal + discount
  const [voucherOpen, setVoucherOpen] = useState(false);
  const [voucherCode, setVoucherCode] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  const shipping = 0; // demo

  const total = useMemo(() => Math.max(0, subtotal - discountAmount) + shipping, [subtotal, discountAmount, shipping]);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 6 }}>
          <Feather name="arrow-left" size={22} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>My Cart</Text>

        <TouchableOpacity onPress={() => setVoucherOpen(true)} style={{ padding: 6 }}>
          <Text style={styles.voucherLink}>Voucher Code</Text>
        </TouchableOpacity>
      </View>

      {/* Items */}
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 140 }}>
        {items.map((i) => (
          <View key={i.id} style={styles.itemRow}>
            <Image source={i.image} style={styles.thumb} />

            <View style={{ flex: 1, marginHorizontal: 12 }}>
              <Text style={styles.itemTitle} numberOfLines={2}>{i.title}</Text>

              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                <Text style={styles.price}>{money(i.price)}</Text>
                {i.compareAtPrice ? (
                  <Text style={styles.compare}>{money(i.compareAtPrice)}</Text>
                ) : null}
              </View>

              {i.size ? <Text style={styles.meta}>Size : {i.size}</Text> : null}

              {/* qty controls */}
              <View style={styles.qtyRow}>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => dec(i.id)}>
                  <Text style={styles.qtyBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.qty}>{i.qty}</Text>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => inc(i.id)}>
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Right column: select & delete */}
            <View style={{ alignItems: "flex-end" }}>
              <TouchableOpacity onPress={() => toggle(i.id)} style={styles.checkBtn}>
                <Feather name={i.selected ? "check-circle" : "circle"} size={22} color={i.selected ? "#10B981" : "#9CA3AF"} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => remove(i.id)} style={styles.trashBtn}>
                <Feather name="trash-2" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order Info</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{money(subtotal)}</Text>
          </View>

          {discountAmount > 0 ? (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: "#10B981" }]}>
                Discount {voucherCode ? `(${voucherCode})` : ""}
              </Text>
              <Text style={[styles.summaryValue, { color: "#10B981" }]}>− {money(discountAmount)}</Text>
            </View>
          ) : null}

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping Cost</Text>
            <Text style={styles.summaryValue}>{money(shipping)}</Text>
          </View>

          <View style={[styles.summaryRow, { marginTop: 6 }]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{money(total)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Checkout button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.checkoutBtn}>
          <Text style={styles.checkoutText}>Checkout ({items.length})</Text>
        </TouchableOpacity>
      </View>

      {/* Voucher modal */}
      <VoucherCodeSheet
        visible={voucherOpen}
        subtotal={subtotal}
        onClose={() => setVoucherOpen(false)}
        onApply={({ code, discountAmount }) => {
          setVoucherCode(code);
          setDiscountAmount(discountAmount);
        }}
      />
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
  headerTitle: { fontSize: 18, fontWeight: "700" },
  voucherLink: { color: "#34D399", fontWeight: "700" },

  itemRow: {
    backgroundColor: "#F3F4F6",
    borderRadius: 14,
    padding: 12,
    marginTop: 12,
    flexDirection: "row",
  },
  thumb: { width: 84, height: 84, borderRadius: 10, backgroundColor: "#eee" },
  itemTitle: { fontSize: 15, fontWeight: "700" },
  price: { fontSize: 14, fontWeight: "700", marginRight: 8 },
  compare: { fontSize: 12, color: "#9CA3AF", textDecorationLine: "line-through" },
  meta: { marginTop: 4, color: "#6B7280" },

  qtyRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  qtyBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyBtnText: { fontSize: 18, fontWeight: "800" },
  qty: { width: 30, textAlign: "center", fontWeight: "700" },

  checkBtn: { padding: 6 },
  trashBtn: { padding: 6, marginTop: 16 },

  summaryCard: {
    marginTop: 18,
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#F9FAFB",
  },
  summaryTitle: { fontWeight: "800", fontSize: 16, marginBottom: 8 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 6 },
  summaryLabel: { color: "#6B7280" },
  summaryValue: { fontWeight: "700" },
  totalLabel: { fontSize: 16, fontWeight: "800" },
  totalValue: { fontSize: 16, fontWeight: "800" },

  bottomBar: {
    position: "absolute",
    left: 0, right: 0, bottom: 0,
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  checkoutBtn: {
    backgroundColor: "#111",
    borderRadius: 12,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  checkoutText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});

export default MyCartScreen;
