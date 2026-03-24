import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Platform, StatusBar, KeyboardAvoidingView } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTheme } from "../context/ThemeContext";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { useAuth } from "../context/AuthContext";

type Props = NativeStackScreenProps<RootStackParamList, "AIStylist">;

type Message = {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
};

const AIStylistScreen: React.FC<Props> = ({ navigation }) => {
    const { colors, isDark } = useTheme();
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: `Hi ${user?.name?.split(" ")[0] || "there"}! I'm your AI Stylist. Describe an outfit or occasion, and I'll help you find the perfect look.`,
            sender: 'ai',
            timestamp: new Date(),
        }
    ]);
    const [inputText, setInputText] = useState("");
    const scrollViewRef = useRef<ScrollView>(null);

    const handleSend = () => {
        if (inputText.trim() === "") return;

        const newUserMsg: Message = {
            id: Date.now().toString(),
            text: inputText,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, newUserMsg]);
        setInputText("");

        // Mock AI response
        setTimeout(() => {
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: "That sounds like a great style! Based on our latest collection, I'd recommend checking out our Casual Linens or Slim-fit Blazers. Would you like to see some options?",
                sender: 'ai',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, aiMsg]);
        }, 1000);
    };

    useEffect(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
            {/* Header */}
            <View style={[styles.header, { borderColor: colors.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Ionicons name="sparkles" size={20} color="#4f8ef7" />
                    <Text style={[styles.headerTitle, { color: colors.text }]}>AI Stylist</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            >
                <ScrollView 
                    ref={scrollViewRef}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {messages.map((msg) => (
                        <View 
                            key={msg.id} 
                            style={[
                                styles.messageBubble, 
                                msg.sender === 'user' ? styles.userBubble : [styles.aiBubble, { backgroundColor: isDark ? '#222' : '#F3F4F6' }]
                            ]}
                        >
                            <Text style={[
                                styles.messageText, 
                                { color: msg.sender === 'user' ? '#fff' : colors.text }
                            ]}>
                                {msg.text}
                            </Text>
                            <Text style={[
                                styles.timestamp, 
                                { color: msg.sender === 'user' ? 'rgba(255,255,255,0.7)' : colors.textSecondary }
                            ]}>
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                        </View>
                    ))}
                </ScrollView>

                {/* Input Area */}
                <View style={[styles.inputContainer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
                    <View style={[styles.inputWrapper, { backgroundColor: isDark ? '#222' : '#F3F4F6' }]}>
                        <TextInput
                            style={[styles.input, { color: colors.text }]}
                            placeholder="Describe your outfit style..."
                            placeholderTextColor={colors.textSecondary}
                            value={inputText}
                            onChangeText={setInputText}
                            multiline
                        />
                        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
                            <Ionicons name="send" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safe: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    backBtn: { padding: 4 },
    headerTitleContainer: { flexDirection: 'row', alignItems: 'center' },
    headerTitle: { fontSize: 18, fontWeight: '700', marginLeft: 8 },
    scrollContent: { padding: 16, paddingBottom: 20 },
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 16,
        marginBottom: 16,
    },
    userBubble: {
        alignSelf: 'flex-end',
        backgroundColor: '#4f8ef7',
        borderBottomRightRadius: 4,
    },
    aiBubble: {
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 4,
    },
    messageText: { fontSize: 15, lineHeight: 20 },
    timestamp: { fontSize: 10, marginTop: 4, alignSelf: 'flex-end' },
    inputContainer: {
        padding: 16,
        paddingBottom: Platform.OS === 'ios' ? 30 : 16,
        borderTopWidth: 1,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 25,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    input: {
        flex: 1,
        fontSize: 15,
        maxHeight: 100,
        paddingTop: 8,
        paddingBottom: 8,
    },
    sendBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#4f8ef7',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
    },
});

export default AIStylistScreen;
