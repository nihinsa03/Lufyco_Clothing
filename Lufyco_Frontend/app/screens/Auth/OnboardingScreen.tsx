import React, { useRef, useState } from 'react';
import {
    View, Text, Image, FlatList, Dimensions, StyleSheet,
    TouchableOpacity, SafeAreaView, StatusBar
} from 'react-native';
import { useAuthStore } from '../../store/useAuthStore';
import { StackNavigationProp } from '@react-navigation/stack';

const { width, height } = Dimensions.get('window');

const slides = [
    {
        id: '1',
        image: require('../../../assets/images/onboarding1.png'), // Placeholder, need real assets or use uploaded
        title: 'Explore a wide range\nof Clothing Products',
        subtitle: 'Find the best outfits for every occasion.'
    },
    {
        id: '2',
        image: require('../../../assets/images/onboarding2.png'),
        title: 'Unlock exclusive offers\nand discounts',
        subtitle: 'Get access to limited-time deals and special promotions.'
    },
    {
        id: '3',
        image: require('../../../assets/images/onboarding3.png'),
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
        } else {
            finishOnboarding();
        }
    };

    const finishOnboarding = () => {
        completeOnboarding();
        navigation.replace('Signup'); // Navigate to Signup by default
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

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

                {/* Buttons */}
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                        <Text style={styles.nextButtonText}>
                            {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
                        </Text>
                    </TouchableOpacity>

                    {currentIndex < slides.length - 1 && (
                        <TouchableOpacity onPress={finishOnboarding} style={styles.skipButton}>
                            <Text style={styles.skipText}>Skip</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    slide: { width, alignItems: 'center' },
    image: { width: width * 0.9, height: height * 0.5, borderRadius: 20, marginTop: 20, backgroundColor: '#f0f0f0' },
    textContainer: { marginTop: 40, alignItems: 'center', paddingHorizontal: 30 },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#000', marginBottom: 15 },
    subtitle: { fontSize: 14, textAlign: 'center', color: '#666', lineHeight: 22 },

    bottomContainer: { position: 'absolute', bottom: 50, left: 0, right: 0, alignItems: 'center' },
    pagination: { flexDirection: 'row', marginBottom: 30 },
    dot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 4 },
    activeDot: { backgroundColor: '#000', width: 24 },
    inactiveDot: { backgroundColor: '#CCC' },

    buttonsContainer: { alignItems: 'center', width: '100%' },
    nextButton: { backgroundColor: '#000', paddingVertical: 16, paddingHorizontal: 100, borderRadius: 30, marginBottom: 15 },
    nextButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    skipButton: { padding: 10 },
    skipText: { color: '#888', fontSize: 14 }
});

export default OnboardingScreen;
