// WhatToDoAI/web/src/components/Navbar.tsx

import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';

// Styled components
const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 64px;
  background-color: var(--color-card-bg, white);
  box-shadow: 0 1px 3px var(--color-shadow, rgba(0, 0, 0, 0.1));
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const Logo = styled(Link)`
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text, #1a202c);
  text-decoration: none;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 8px;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  
  @media (max-width: 768px) {
    gap: 16px;
  }
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.$active ? 'var(--color-text, #1a202c)' : 'var(--color-text-secondary, #4a5568)'};
  text-decoration: none;
  padding: 8px 0;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: ${props => props.$active ? '#0066cc' : 'transparent'};
    transition: background-color 0.2s;
  }
  
  &:hover {
    color: var(--color-text, #1a202c);
    
    &:after {
      background-color: #0066cc;
    }
  }
  
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ProfileButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #0066cc;
  color: white;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #0055aa;
  }
`;

const SignOutButton = styled.button`
  background: none;
  border: none;
  color: var(--color-text-secondary, #4a5568);
  font-size: 14px;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  
  &:hover {
    background-color: var(--color-hover, rgba(0, 0, 0, 0.05));
    color: var(--color-text, #1a202c);
  }
`;

const Navbar: React.FC = () => {
  const { state, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const getInitials = () => {
    if (state.profile?.username) {
      return state.profile.username.substring(0, 1).toUpperCase();
    }
    
    if (state.user?.email) {
      return state.user.email.substring(0, 1).toUpperCase();
    }
    
    return 'U';
  };
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <NavbarContainer>
      <Logo to="/dashboard">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="#0066cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="10" r="3" stroke="#0066cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        WhatToDoAI
      </Logo>
      
      {state.user && (
        <NavLinks>
          <NavLink to="/dashboard" $active={isActive('/dashboard')}>Dashboard</NavLink>
          <NavLink to="/discover" $active={isActive('/discover')}>Discover</NavLink>
          <NavLink to="/map" $active={isActive('/map')}>Map</NavLink>
          <NavLink to="/planner" $active={isActive('/planner')}>Planner</NavLink>
        </NavLinks>
      )}
      
      <RightSection>
        <ThemeToggle />
        
        {state.user ? (
          <>
            <ProfileButton title={state.profile?.username || state.user.email}>
              {getInitials()}
            </ProfileButton>
            <SignOutButton onClick={handleSignOut}>Sign Out</SignOutButton>
          </>
        ) : (
          <NavLink to="/signin">Sign In</NavLink>
        )}
      </RightSection>
    </NavbarContainer>
  );
};

export default Navbar;
