import { useEffect } from "react";
import { CartProvider } from "../context/CartContext";
import { AuthProvider } from "../context/AuthContext";
import AppNavigator from "../navigation/AppNavigator";
import { registerForPushNotificationsAsync, scheduleDailyNotifications } from "../services/notificationService";

export default function App() {
  useEffect(() => {
    // Initialize notifications when app loads
    const setupNotifications = async () => {
      await registerForPushNotificationsAsync();
      await scheduleDailyNotifications();
    };

    setupNotifications();
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <AppNavigator />
      </CartProvider>
    </AuthProvider>
  );
}
