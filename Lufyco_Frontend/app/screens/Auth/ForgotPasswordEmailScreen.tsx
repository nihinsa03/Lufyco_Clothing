import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView, Alert } from 'react-native';
import { AuthHeader, AuthInput, PrimaryButton } from '../../components/AuthComponents';
import { useAuthStore } from '../../store/useAuthStore';
import { StackNavigationProp } from '@react-navigation/stack';

interface Props {
    navigation: StackNavigationProp<any>;
}

const ForgotPasswordEmailScreen = ({ navigation }: Props) => {
    const { requestPasswordReset, loading } = useAuthStore();
    const [email, setEmail] = useState('');

    const handleSend = async () => {
        if (!email) {
            Alert.alert("Error", "Please enter your email");
            return;
        }
        await requestPasswordReset(email);
        navigation.navigate('ForgotPasswordVerification', { email });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Text style={styles.backArrow}>←</Text>
                </TouchableOpacity>

                <AuthHeader
                    title="Forgot Password"
                    subtitle="Enter your email for the verification process. We will send 4 digit code to your email."
                />

                <AuthInput
                    label="Email Address"
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    icon="mail"
                    keyboardType="email-address"
                />

                <PrimaryButton
                    title="Send Code"
                    onPress={handleSend}
                    loading={loading}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff' },
    container: { padding: 24, flex: 1 },
    backBtn: { marginBottom: 20 },
    backArrow: { fontSize: 24, fontWeight: 'bold' }
});

export default ForgotPasswordEmailScreen;
