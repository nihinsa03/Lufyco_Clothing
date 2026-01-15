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

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                let iconName: any = "home";
                let IconComp: any = Feather;

                if (route.name === 'Home') iconName = 'home';
                else if (route.name === 'Categories') iconName = 'grid';
                else if (route.name === 'MyCart') { iconName = 'shopping-cart'; }
                else if (route.name === 'Wishlist') iconName = 'heart';
                else if (route.name === 'Profile') iconName = 'user';

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
                        onLongPress={onLongPress}
                        style={styles.tabItem}
                    >
                        <View>
                            <IconComp name={iconName} size={22} color={isFocused ? '#111' : '#999'} />
                            {route.name === 'MyCart' && count > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{count}</Text>
                                </View>
                            )}
                        </View>
                        <Text style={{ fontSize: 10, color: isFocused ? '#111' : '#999', marginTop: 4, fontWeight: isFocused ? '700' : '500' }}>
                            {label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const BottomTabNavigator = () => {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{ headerShown: false }}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
            <Tab.Screen name="Categories" component={CategoriesScreen} options={{ tabBarLabel: 'Shop' }} />
            <Tab.Screen name="MyCart" component={MyCartScreen} options={{ tabBarLabel: 'Cart' }} />
            <Tab.Screen name="Wishlist" component={WishlistScreen} options={{ tabBarLabel: 'Wishlist' }} />
            <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        height: Platform.OS === 'ios' ? 80 : 60,
        paddingBottom: Platform.OS === 'ios' ? 20 : 0,
        borderTopWidth: 1,
        borderColor: '#F3F4F6',
        elevation: 8,
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: -2 }
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badge: {
        position: 'absolute', top: -5, right: -8, backgroundColor: '#EF4444',
        minWidth: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 2
    },
    badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
});

export default BottomTabNavigator;
