// WhatToDoAI/mobile/src/screens/SignInScreen.tsx

import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Pressable } from 'react-native'; // Import Pressable
import {
    YStack, // Replaces Box, VStack
    XStack, // Replaces HStack
    H2,     // Replaces Heading
    Input,  // Replaces Gluestack Input/InputField
    Button,
    Text,
    Spinner
} from 'tamagui';
import { AlertTriangle } from 'lucide-react-native'; // Keep icon
import { signIn } from '../services/auth';
import { AuthStackParamList } from '../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type SignInScreenProps = NativeStackScreenProps<AuthStackParamList, 'SignIn'>;

const SignInScreen: React.FC<SignInScreenProps> = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false); // Keep state, but UI removed for now

    const handleSignIn = async () => {
        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }
        setError(null);
        setLoading(true);

        try {
            const { user } = await signIn({ email, password });
            console.log('Sign in successful:', user);
            // Auth state change should trigger navigation via AppNavigator
        } catch (err: any) {
            console.error('Sign in failed:', err);
            setError(err.message || 'Sign in failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    // Password toggle logic remains, but UI element removed for now
    // const toggleShowPassword = () => {
    //     setShowPassword(!showPassword);
    // };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            {/* Use YStack for main layout, standard style props */}
            <YStack flex={1} justifyContent="center" alignItems="center" padding="$5" backgroundColor="$background">
                {/* Use YStack for form container */}
                <YStack space="$4" width="100%" maxWidth={320}>
                    {/* Use H2, standard style props */}
                    <H2 textAlign="center" marginBottom="$5">
                        Welcome Back!
                    </H2>

                    {error && (
                        // Use YStack/XStack, standard style props, basic colors
                        <YStack backgroundColor="rgba(255,0,0,0.1)" padding="$3" borderRadius={8} marginBottom="$4">
                            <XStack space="$2" alignItems="center">
                                  <AlertTriangle color="red" size={16} />
                                  <Text color="red">{error}</Text>
                            </XStack>
                        </YStack>
                    )}

                    {/* Form Control replacement */}
                    <YStack space="$1">
                        <Text>Email</Text>
                        <Input
                            placeholder="Enter your email"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            // Add Tamagui size prop if needed, e.g., size="$4"
                        />
                    </YStack>

                    {/* Form Control replacement */}
                    <YStack space="$1">
                        <Text>Password</Text>
                        <Input
                            secureTextEntry={!showPassword} // Use secureTextEntry
                            placeholder="Enter your password"
                            value={password}
                            onChangeText={setPassword}
                             // Add Tamagui size prop if needed, e.g., size="$4"
                        />
                        {/* Removed password toggle icon for simplicity */}
                        {/* Link replacement */}
                        <Pressable onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotPasswordLink}>
                            <Text fontSize={12} color="blue">Forgot Password?</Text>
                        </Pressable>
                    </YStack>

                    {/* Use Tamagui Button, standard style props */}
                    <Button onPress={handleSignIn} disabled={loading} marginTop="$5" theme="blue">
                        {loading ? <Spinner color="white" /> : <Text>Sign In</Text>}
                    </Button>

                    {/* Use XStack, standard style props */}
                    <XStack justifyContent="center" marginTop="$5" space="$1">
                        <Text fontSize={12}>Don't have an account? </Text>
                        {/* Link replacement */}
                        <Pressable onPress={() => navigation.navigate('SignUp')}>
                            <Text fontSize={12} color="blue">Sign Up</Text>
                        </Pressable>
                    </XStack>
                </YStack>
            </YStack>
        </KeyboardAvoidingView>
    );
};

// Keep minimal styles, prefer Tamagui props where possible
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    forgotPasswordLink: {
        alignSelf: 'flex-end',
        marginTop: 4,
    }
});

export default SignInScreen;
