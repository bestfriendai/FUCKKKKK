// WhatToDoAI/mobile/src/navigation/AuthNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types'; // Import the param list type

// Import Screens
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
// Placeholder for ForgotPasswordScreen - create this file later
// import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import { Text, YStack } from 'tamagui'; // For placeholder

// Placeholder Component
const ForgotPasswordScreen = () => (
    <YStack flex={1} justifyContent="center" alignItems="center">
        <Text>Forgot Password Screen (Placeholder)</Text>
    </YStack>
);


// Create the stack navigator instance
const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
    return (
        <Stack.Navigator
            initialRouteName="SignIn"
            screenOptions={{
                headerShown: false, // Hide header for auth screens by default
            }}
        >
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </Stack.Navigator>
    );
};

export default AuthNavigator;
