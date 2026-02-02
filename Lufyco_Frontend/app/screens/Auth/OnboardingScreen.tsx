import React, { useRef, useState } from 'react';
import {
    View, Text, Image, FlatList, Dimensions, StyleSheet,
    TouchableOpacity, SafeAreaView, StatusBar
} from 'react-native';
import { useAuthStore } from '../../store/useAuthStore';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const slides = [
    {
        id: '1',
        image: require('../../../assets/images/1.png'), // Updated image
        title: 'Explore a wide range\nof Clothing Products',
        subtitle: 'Find the best outfits for every occasion.'
    },
    {
        id: '2',
        image: require('../../../assets/images/2.png'),
        title: 'Unlock exclusive offers\nand discounts',
        subtitle: 'Get access to limited-time deals and special promotions.'
    },
    {
        id: '3',
        image: require('../../../assets/images/3.png'),
        title: 'Safe and secure\npayments',
        subtitle: 'Quick and secure checkout process for all your orders.'
    }
];

interface Props {
    navigation: StackNavigationProp<any>;
}

const OnboardingScreen = ({ navigation }: Props) => {
    const { completeOnboarding } = useAuthStore();
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
            setCurrentIndex(currentIndex + 1);
        } else {
            finishOnboarding();
        }
    };

    const handleBack = () => {
        if (currentIndex > 0) {
            flatListRef.current?.scrollToIndex({ index: currentIndex - 1 });
            setCurrentIndex(currentIndex - 1);
        } else {
            navigation.goBack();
        }
    };

    const finishOnboarding = () => {
        completeOnboarding();
        navigation.replace('Signup'); // Verify if 'Get Started' should go to Signup or Login
    };

    const handleLogin = () => {
        completeOnboarding();
        navigation.replace('Login');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header / Back Button */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
            </View>

            {/* Image Slider */}
            <FlatList
                ref={flatListRef}
                data={slides}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                onMomentumScrollEnd={(e) => {
                    const index = Math.round(e.nativeEvent.contentOffset.x / width);
                    setCurrentIndex(index);
                }}
                renderItem={({ item }) => (
                    <View style={styles.slide}>
                        <Image source={item.image} style={styles.image} resizeMode="cover" />
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.subtitle}>{item.subtitle}</Text>
                        </View>
                    </View>
                )}
            />

            {/* Pagination & Controls */}
            <View style={styles.bottomContainer}>
                {/* Buttons */}
                <View style={styles.buttonsContainer}>
                    {currentIndex === slides.length - 1 ? (
                        <View style={styles.doubleButtonContainer}>
                            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                                <Text style={styles.loginButtonText}>Login</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.getStartedButton} onPress={finishOnboarding}>
                                <Text style={styles.getStartedButtonText}>Get Started</Text>
                                <Ionicons name="arrow-forward" size={20} color="white" style={{ marginLeft: 5 }} />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <>
                            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                                <Text style={styles.nextButtonText}>Next</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={finishOnboarding} style={styles.skipButton}>
                                <Text style={styles.skipText}>Skip</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>

                {/* Pagination Dots */}
                <View style={styles.pagination}>
                    {slides.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                currentIndex === index ? styles.activeDot : styles.inactiveDot
                            ]}
                        />
                    ))}
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 },
    backButton: { padding: 5 },
    slide: { width, alignItems: 'center' },
    image: { width: width * 0.9, height: height * 0.5, borderRadius: 20, marginTop: 10, backgroundColor: '#f0f0f0' },
    textContainer: { marginTop: 40, alignItems: 'center', paddingHorizontal: 30 },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#000', marginBottom: 15 },
    subtitle: { fontSize: 14, textAlign: 'center', color: '#666', lineHeight: 22 },

    bottomContainer: { position: 'absolute', bottom: 30, left: 0, right: 0, alignItems: 'center' },
    pagination: { flexDirection: 'row', marginTop: 20 },
    dot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 4 },
    activeDot: { backgroundColor: '#000', width: 24 },
    inactiveDot: { backgroundColor: '#CCC' },

    buttonsContainer: { alignItems: 'center', width: '100%', paddingHorizontal: 30 },
    nextButton: { backgroundColor: '#000', width: '100%', paddingVertical: 16, borderRadius: 30, alignItems: 'center', marginBottom: 15 },
    nextButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    skipButton: { padding: 10 },
    skipText: { color: '#888', fontSize: 14 },

    doubleButtonContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
    loginButton: { flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: '#eee', paddingVertical: 16, borderRadius: 30, alignItems: 'center', marginRight: 10 },
    loginButtonText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
    getStartedButton: { flex: 1, backgroundColor: '#000', paddingVertical: 16, borderRadius: 30, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
    getStartedButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

export default OnboardingScreen;
