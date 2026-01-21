import { CartProvider } from "../context/CartContext";
// import { AuthProvider } from "../context/AuthContext"; // Deprecated
import AppNavigator from "../navigation/AppNavigator";

export default function App() {
  return (
    <CartProvider>
      <AppNavigator />
    </CartProvider>
  );
}
