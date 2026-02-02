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
        image: require('../../../assets/images/1.png'),
        title: 'Explore a wide range\nof Clothing Products',
        subtitle: 'Explore a wide range of clothing products at your fingertips. Fashion offers an extensive collection to suit your needs.'
    },
    {
        id: '2',
        image: require('../../../assets/images/2.png'),
        title: 'Unlock exclusive offers\nand discounts',
        subtitle: 'Get access to limited-time deals and special promotions available only to our valued customers.'
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
        <View style={styles.container}>
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
                    </View>
                )}
            />

            {/* Bottom Card with Text and Controls */}
            <View style={styles.bottomCard}>
                {/* Text Content */}
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{slides[currentIndex].title}</Text>
                    <Text style={styles.subtitle}>{slides[currentIndex].subtitle}</Text>
                </View>

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
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f8f8' },
    header: {
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        zIndex: 10,
        paddingHorizontal: 20
    },
    backButton: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 20,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    slide: {
        width,
        height: height * 0.6,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 60
    },
    image: {
        width: width * 0.88,
        height: '85%',
        borderRadius: 24
    },

    bottomCard: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: 24,
        paddingTop: 28,
        paddingBottom: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 12
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 24
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000',
        marginBottom: 10,
        lineHeight: 28
    },
    subtitle: {
        fontSize: 13,
        textAlign: 'center',
        color: '#666',
        lineHeight: 19,
        paddingHorizontal: 5
    },

    buttonsContainer: {
        width: '100%',
        marginBottom: 16
    },
    nextButton: {
        backgroundColor: '#000',
        width: '100%',
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 12
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600'
    },
    skipButton: {
        padding: 8,
        alignItems: 'center'
    },
    skipText: {
        color: '#888',
        fontSize: 14
    },

    doubleButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
    loginButton: {
        flex: 1,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#e5e5e5',
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
        marginRight: 8
    },
    loginButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600'
    },
    getStartedButton: {
        flex: 1,
        backgroundColor: '#000',
        paddingVertical: 16,
        borderRadius: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8
    },
    getStartedButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600'
    },

    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 8
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4
    },
    activeDot: {
        backgroundColor: '#000',
        width: 24
    },
    inactiveDot: {
        backgroundColor: '#D0D0D0'
    }
});

export default OnboardingScreen;
