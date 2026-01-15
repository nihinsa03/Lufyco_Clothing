import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Header
export const AuthHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
    <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
);

// Text Field
export const AuthInput = ({
    label, value, onChangeText, placeholder, secureTextEntry, icon, rightIcon, onRightIconPress, keyboardType
}: any) => (
    <View style={styles.inputContainer}>
        {label && <Text style={styles.label}>{label}</Text>}
        <View style={styles.inputBox}>
            {icon && <Feather name={icon} size={20} color="#666" style={{ marginRight: 10 }} />}
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#999"
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
            />
            {rightIcon && (
                <TouchableOpacity onPress={onRightIconPress}>
                    <Feather name={rightIcon} size={20} color="#666" />
                </TouchableOpacity>
            )}
        </View>
    </View>
);

// Buttons
export const PrimaryButton = ({ title, onPress, loading, disabled }: any) => (
    <TouchableOpacity
        style={[styles.primaryBtn, disabled && styles.disabledBtn]}
        onPress={onPress}
        disabled={loading || disabled}
    >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>{title}</Text>}
    </TouchableOpacity>
);

export const SecondaryButton = ({ title, onPress }: any) => (
    <TouchableOpacity style={styles.secondaryBtn} onPress={onPress}>
        <Text style={styles.secondaryBtnText}>{title}</Text>
    </TouchableOpacity>
);

// OTP Input
export const OTPInput = ({ otp, setOtp }: { otp: string, setOtp: (s: string) => void }) => {
    // simplified for brevity, in real app refs for auto-focus
    return (
        <View style={styles.otpContainer}>
            {Array.from({ length: 6 }).map((_, i) => (
                <View key={i} style={styles.otpBox}>
                    <Text style={styles.otpText}>{otp[i] || ''}</Text>
                </View>
            ))}
            {/* hidden input overlay to capture typing */}
            <TextInput
                style={styles.hiddenInput}
                value={otp}
                onChangeText={(t) => setOtp(t.slice(0, 6))}
                keyboardType="number-pad"
                maxLength={6}
                autoFocus
            />
        </View>
    );
};

export const SocialRow = () => (
    <View style={styles.socialRow}>
        <TouchableOpacity style={styles.socialBtn}><Feather name="facebook" size={24} color="#1877F2" /></TouchableOpacity>
        <TouchableOpacity style={styles.socialBtn}><Feather name="github" size={24} color="#000" /></TouchableOpacity>
        {/* Apple icon mock */}
        <TouchableOpacity style={styles.socialBtn}><Feather name="globe" size={24} color="#000" /></TouchableOpacity>
    </View>
);


const styles = StyleSheet.create({
    header: { marginBottom: 30 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#000', marginBottom: 10 },
    subtitle: { fontSize: 16, color: '#666' },

    inputContainer: { marginBottom: 20 },
    label: { fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#333' },
    inputBox: {
        flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#DDD',
        borderRadius: 12, paddingHorizontal: 15, height: 50, backgroundColor: '#FAFAFA'
    },
    input: { flex: 1, fontSize: 16, color: '#000' },

    primaryBtn: {
        backgroundColor: '#000', height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center', marginVertical: 10
    },
    disabledBtn: { backgroundColor: '#888' },
    primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

    secondaryBtn: {
        height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center', marginVertical: 10, borderWidth: 1, borderColor: '#E5E7EB'
    },
    secondaryBtnText: { color: '#000', fontSize: 16, fontWeight: '600' },

    otpContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30, position: 'relative' },
    otpBox: {
        width: (width - 80) / 6, height: 50, borderWidth: 1, borderColor: '#DDD', borderRadius: 10,
        justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAFAFA'
    },
    otpText: { fontSize: 20, fontWeight: 'bold' },
    hiddenInput: { position: 'absolute', width: '100%', height: '100%', opacity: 0 },

    socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginTop: 20 },
    socialBtn: {
        width: 50, height: 50, borderRadius: 25, borderWidth: 1, borderColor: '#eee',
        justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff'
    }
});
