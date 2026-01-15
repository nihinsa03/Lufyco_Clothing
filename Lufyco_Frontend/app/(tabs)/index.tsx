import { CartProvider } from "../context/CartContext";
import { AuthProvider } from "../context/AuthContext";
import AppNavigator from "../navigation/AppNavigator";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppNavigator />
      </CartProvider>
    </AuthProvider>
  );
}
