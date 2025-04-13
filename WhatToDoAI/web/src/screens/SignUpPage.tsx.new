// WhatToDoAI/web/src/screens/SignUpPage.tsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { SignUpCredentials } from '../types/auth';

// Styled components
const Container = styled.div`
  display: flex;
  min-height: 100vh;
`;

const FormSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 32px;
  background-color: white;
`;

const ImageSection = styled.div`
  flex: 1;
  background-image: url('https://source.unsplash.com/random/1200x800/?adventure');
  background-size: cover;
  background-position: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 400px;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 48px;
  color: #0066cc;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #333;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #666;
  margin: 0 0 32px 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #4a5568;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #0066cc;
    box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-bottom: 16px;
  
  &:hover {
    background-color: #0055aa;
  }
  
  &:disabled {
    background-color: #a0aec0;
    cursor: not-allowed;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 24px 0;
  
  &::before, &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #e2e8f0;
  }
  
  span {
    padding: 0 16px;
    color: #a0aec0;
    font-size: 14px;
  }
`;

const SocialButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: white;
  color: #333;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: #f8fafc;
  }
  
  svg {
    margin-right: 8px;
  }
`;

const SignInLink = styled.div`
  text-align: center;
  margin-top: 32px;
  font-size: 14px;
  color: #666;
  
  a {
    color: #0066cc;
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.div`
  background-color: #fff5f5;
  color: #e53e3e;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 24px;
  font-size: 14px;
`;

const SuccessMessage = styled.div`
  background-color: #f0fff4;
  color: #38a169;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 24px;
  font-size: 14px;
`;

const PasswordRequirements = styled.ul`
  font-size: 12px;
  color: #718096;
  margin: 8px 0 0 0;
  padding-left: 16px;
`;

const SignUpPage: React.FC = () => {
  const [credentials, setCredentials] = useState<SignUpCredentials>({
    email: '',
    password: '',
    username: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'confirmPassword') {
      setConfirmPassword(value);
    } else {
      setCredentials(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  
  const validatePassword = () => {
    if (credentials.password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    
    if (credentials.password !== confirmPassword) {
      return 'Passwords do not match';
    }
    
    return null;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    // Validate password
    const passwordError = validatePassword();
    if (passwordError) {
      setError(passwordError);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await signUp(credentials);
      setSuccess('Account created successfully! Please check your email for verification.');
      // Don't navigate immediately, let the user see the success message
      setTimeout(() => {
        navigate('/signin');
      }, 3000);
    } catch (err: any) {
      console.error('Sign up error:', err);
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Container>
      <FormSection>
        <FormContainer>
          <Logo>WhatToDoAI</Logo>
          
          <Title>Create an account</Title>
          <Subtitle>Sign up to start discovering activities</Subtitle>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
          
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="username">Username</Label>
              <Input
                type="text"
                id="username"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                required
                autoFocus
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
              />
              <PasswordRequirements>
                <li>At least 8 characters long</li>
                <li>Include uppercase and lowercase letters</li>
                <li>Include at least one number or special character</li>
              </PasswordRequirements>
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleChange}
                required
              />
            </FormGroup>
            
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account...' : 'Sign Up'}
            </Button>
          </Form>
          
          <Divider>
            <span>OR</span>
          </Divider>
          
          <SocialButton type="button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#4285F4" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z" />
            </svg>
            Continue with Google
          </SocialButton>
          
          <SignInLink>
            Already have an account? <Link to="/signin">Sign in</Link>
          </SignInLink>
        </FormContainer>
      </FormSection>
      
      <ImageSection />
    </Container>
  );
};

export default SignUpPage;
