import React from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import { Text, Button } from 'tamagui';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabaseClient';

// Mock Supabase client
jest.mock('../../services/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: {
          subscription: {
            unsubscribe: jest.fn(),
          },
        },
      })),
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      resetPasswordForEmail: jest.fn(),
    },
  },
}));

// Test component that uses the auth context
const TestComponent = () => {
  const { session, user, signIn, signOut, signUp, resetPassword } = useAuth();

  return (
    <>
      <Text testID="session-status">{session ? 'Logged In' : 'Logged Out'}</Text>
      <Text testID="user-email">{user?.email || 'No User'}</Text>
      <Button testID="sign-in-button" onPress={() => signIn('test@example.com', 'password')}>
        <Text>Sign In</Text>
      </Button>
      <Button testID="sign-up-button" onPress={() => signUp('test@example.com', 'password')}>
        <Text>Sign Up</Text>
      </Button>
      <Button testID="sign-out-button" onPress={() => signOut()}>
        <Text>Sign Out</Text>
      </Button>
      <Button testID="reset-button" onPress={() => resetPassword('test@example.com')}>
        <Text>Reset Password</Text>
      </Button>
    </>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementation for getSession
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: null },
    });
  });

  it('provides null session by default', async () => {
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByTestId('session-status').props.children).toBe('Logged Out');
      expect(getByTestId('user-email').props.children).toBe('No User');
    });
  });

  it('provides session when user is logged in', async () => {
    const mockSession = {
      user: {
        id: '123',
        email: 'test@example.com',
      },
    };

    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: mockSession },
    });

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByTestId('session-status').props.children).toBe('Logged In');
      expect(getByTestId('user-email').props.children).toBe('test@example.com');
    });
  });

  it('calls signIn with correct parameters', async () => {
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      error: null,
    });

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      getByTestId('sign-in-button').props.onPress();
    });

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
    });
  });

  it('calls signUp with correct parameters', async () => {
    (supabase.auth.signUp as jest.Mock).mockResolvedValue({
      error: null,
    });

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      getByTestId('sign-up-button').props.onPress();
    });

    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
    });
  });

  it('calls signOut when requested', async () => {
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      getByTestId('sign-out-button').props.onPress();
    });

    expect(supabase.auth.signOut).toHaveBeenCalled();
  });

  it('calls resetPassword with correct email', async () => {
    (supabase.auth.resetPasswordForEmail as jest.Mock).mockResolvedValue({
      error: null,
    });

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      getByTestId('reset-button').props.onPress();
    });

    expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith('test@example.com');
  });

  it('updates session when auth state changes', async () => {
    // Initial state - logged out
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: null },
    });

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByTestId('session-status').props.children).toBe('Logged Out');
    });

    // Simulate auth state change - user logs in
    const mockSession = {
      user: {
        id: '123',
        email: 'test@example.com',
      },
    };

    await act(async () => {
      // Get the callback function that was passed to onAuthStateChange
      const authStateCallback = (supabase.auth.onAuthStateChange as jest.Mock).mock.calls[0][1];

      // Call it with a new session
      authStateCallback('SIGNED_IN', mockSession);
    });

    await waitFor(() => {
      expect(getByTestId('session-status').props.children).toBe('Logged In');
      expect(getByTestId('user-email').props.children).toBe('test@example.com');
    });
  });
});
