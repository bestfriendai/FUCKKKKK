// WhatToDoAI/mobile/src/screens/SignUpScreen.tsx

import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Alert, ScrollView, StyleSheet, Pressable } from 'react-native'; // Added ScrollView, StyleSheet, Pressable
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
import { signUp } from '../services/auth';
import { AuthStackParamList } from '../navigation/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { VALIDATION } from '../config';

type SignUpScreenProps = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false); // Keep state
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Keep state

    const validateInputs = (): boolean => {
        if (!username || !email || !password || !confirmPassword) {
            setError('Please fill in all fields.');
            return false;
        }
        if (username.length < VALIDATION.MIN_USERNAME_LENGTH) {
              setError(`Username must be at least ${VALIDATION.MIN_USERNAME_LENGTH} characters long.`);
              return false;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
                setError('Please enter a valid email address.');
                return false;
        }
        if (password.length < VALIDATION.MIN_PASSWORD_LENGTH) {
            setError(`Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters long.`);
            return false;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return false;
        }
        setError(null);
        return true;
    };

    const handleSignUp = async () => {
        if (!validateInputs()) {
            return;
        }
        setLoading(true);

        try {
            const { user } = await signUp({ email, password, username });
            console.log('Sign up successful:', user);
            Alert.alert(
                'Sign Up Successful',
                'Please check your email to confirm your account before signing in.',
                [{ text: 'OK', onPress: () => navigation.navigate('SignIn') }]
            );
        } catch (err: any) {
            console.error('Sign up failed:', err);
            setError(err.message || 'Sign up failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Keep toggle logic, UI removed for now
    // const toggleShowPassword = () => setShowPassword(!showPassword);
    // const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Use YStack with standard props */}
                <YStack flex={1} justifyContent="center" alignItems="center" padding="$5" backgroundColor="$background">
                    {/* Use YStack with standard props */}
                    <YStack space="$4" width="100%" maxWidth={320}>
                        {/* Use H2 with standard props */}
                        <H2 textAlign="center" marginBottom="$5">
                            Create Account
                        </H2>

                        {error && (
                            // Use YStack/XStack with standard props, basic colors
                            <YStack backgroundColor="rgba(255,0,0,0.1)" padding="$3" borderRadius={8} marginBottom="$4">
                                <XStack space="$2" alignItems="center">
                                      <AlertTriangle color="red" size={16} />
                                      <Text color="red">{error}</Text>
                                </XStack>
                            </YStack>
                        )}

                        {/* Form Control replacement */}
                        <YStack space="$1">
                            <Text>Username</Text>
                            <Input
                                placeholder="Choose a username"
                                value={username}
                                onChangeText={setUsername}
                                autoCapitalize="none"
                                // size="$4" // Optional Tamagui size
                            />
                        </YStack>

                        {/* Form Control replacement */}
                        <YStack space="$1">
                            <Text>Email</Text>
                            <Input
                                placeholder="Enter your email"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                // size="$4" // Optional Tamagui size
                            />
                        </YStack>

                        {/* Form Control replacement */}
                        <YStack space="$1">
                            <Text>Password</Text>
                            <Input
                                secureTextEntry={!showPassword}
                                placeholder="Create a password"
                                value={password}
                                onChangeText={setPassword}
                                // size="$4" // Optional Tamagui size
                            />
                            {/* Removed password toggle icon */}
                        </YStack>

                        {/* Form Control replacement */}
                        <YStack space="$1">
                            <Text>Confirm Password</Text>
                            <Input
                                secureTextEntry={!showConfirmPassword}
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                // size="$4" // Optional Tamagui size
                            />
                             {/* Removed password toggle icon */}
                        </YStack>

                        {/* Use Tamagui Button with standard props */}
                        <Button onPress={handleSignUp} disabled={loading} marginTop="$5" theme="blue">
                            {loading ? <Spinner color="white" /> : <Text>Sign Up</Text>}
                        </Button>

                        {/* Use XStack with standard props */}
                        <XStack justifyContent="center" marginTop="$5" space="$1">
                            <Text fontSize={12}>Already have an account? </Text>
                            {/* Link replacement */}
                            <Pressable onPress={() => navigation.navigate('SignIn')}>
                                <Text fontSize={12} color="blue">Sign In</Text>
                            </Pressable>
                        </XStack>
                    </YStack>
                </YStack>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
    }
});

export default SignUpScreen;
