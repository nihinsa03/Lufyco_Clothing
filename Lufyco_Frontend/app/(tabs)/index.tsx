import { CartProvider } from "../context/CartContext";
import AppNavigator from "../navigation/AppNavigator";


export default function App() {
  return (
    <CartProvider>
      <AppNavigator />
    </CartProvider>
  );
}
