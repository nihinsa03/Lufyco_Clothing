import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather, Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import AIStylistScreen from '../screens/AIStylistScreen'; // Exist
import MyCartScreen from '../screens/MyCartScreen'; // Exist
import WishlistScreen from '../screens/WishlistScreen'; // Exist
import ProfileScreen from '../screens/ProfileScreen';
import { useCart } from '../context/CartContext';

const Tab = createBottomTabNavigator();

const CustomTabBar = ({ state, descriptors, navigation }: any) => {
    const { count } = useCart();

    return (
        <View style={styles.tabBar}>
            {state.routes.map((route: any, index: number) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                let IconComp: any = Ionicons;
                let iconName: any = "home-outline";

                if (route.name === 'Home') {
                    iconName = isFocused ? "home" : "home-outline";
                } else if (route.name === 'AIStylist') {
                    iconName = isFocused ? "shirt" : "shirt-outline";
                } else if (route.name === 'MyCart') {
                    iconName = isFocused ? "cart" : "cart-outline";
                } else if (route.name === 'Wishlist') {
                    iconName = isFocused ? "heart" : "heart-outline";
                } else if (route.name === 'Profile') {
                    iconName = isFocused ? "person" : "person-outline";
                }

                const label = options.tabBarLabel !== undefined
                    ? options.tabBarLabel
                    : options.title !== undefined
                        ? options.title
                        : route.name;

                return (
                    <TouchableOpacity
                        key={index}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        style={styles.tabItem}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.iconContainer, isFocused && styles.activeIconContainer]}>
                            <IconComp
                                name={iconName}
                                size={22}
                                color={isFocused ? '#fff' : '#6B7280'}
                            />
                            {route.name === 'MyCart' && count > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{count}</Text>
                                </View>
                            )}
                        </View>
                        <Text style={[styles.label, isFocused && styles.activeLabel]}>
                            {label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

// ... (Navigator part same, just change label for Cart)

const BottomTabNavigator = () => {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{ headerShown: false }}
        >
            <Tab.Screen name="Home" component={HomeScreen as any} options={{ tabBarLabel: 'Home' }} />
            <Tab.Screen name="AIStylist" component={AIStylistScreen as any} options={{ tabBarLabel: 'AI Stylist' }} />
            <Tab.Screen name="MyCart" component={MyCartScreen as any} options={{ tabBarLabel: 'My Cart' }} />
            <Tab.Screen name="Wishlist" component={WishlistScreen as any} options={{ tabBarLabel: 'Wishlist' }} />
            <Tab.Screen name="Profile" component={ProfileScreen as any} options={{ tabBarLabel: 'Profile' }} />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        height: Platform.OS === 'ios' ? 90 : 70, // Slightly taller for the nice look
        paddingBottom: Platform.OS === 'ios' ? 25 : 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderColor: '#F3F4F6',
        elevation: 10,
        shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: -4 }
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start', // Top align to handle active circle
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
        backgroundColor: 'transparent',
    },
    activeIconContainer: {
        backgroundColor: '#1E88E5', // Blue color from screenshot
        transform: [{ translateY: -5 }], // Slight pop up effect
        shadowColor: '#1E88E5', shadowOpacity: 0.4, shadowRadius: 6, shadowOffset: { width: 0, height: 4 }, elevation: 6
    },
    label: {
        fontSize: 10,
        color: '#6B7280',
        fontWeight: '500',
    },
    activeLabel: {
        color: '#111',
        fontWeight: '700',
        fontSize: 10,
    },
    badge: {
        position: 'absolute', top: -2, right: -2, backgroundColor: '#EF4444',
        minWidth: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center',
        borderWidth: 1.5, borderColor: '#fff'
    },
    badgeText: { color: '#fff', fontSize: 9, fontWeight: 'bold' },
});

export default BottomTabNavigator;
