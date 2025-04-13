import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should allow user to sign in', async ({ page }) => {
    // Navigate to the sign-in page
    await page.goto('/signin');
    
    // Check that the sign-in form is displayed
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
    
    // Fill in the form
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('password123');
    
    // Click the sign-in button
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Wait for navigation to dashboard after successful sign-in
    await page.waitForURL('/dashboard');
    
    // Verify that the user is signed in by checking for dashboard elements
    await expect(page.getByText(/welcome/i)).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    // Navigate to the sign-in page
    await page.goto('/signin');
    
    // Fill in the form with invalid credentials
    await page.getByLabel(/email/i).fill('invalid@example.com');
    await page.getByLabel(/password/i).fill('wrongpassword');
    
    // Click the sign-in button
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Verify that an error message is displayed
    await expect(page.getByText(/invalid email or password/i)).toBeVisible();
  });

  test('should allow user to sign up', async ({ page }) => {
    // Navigate to the sign-up page
    await page.goto('/signup');
    
    // Check that the sign-up form is displayed
    await expect(page.getByRole('heading', { name: /sign up/i })).toBeVisible();
    
    // Fill in the form
    await page.getByLabel(/email/i).fill('newuser@example.com');
    await page.getByLabel(/password/i).fill('password123');
    
    // Click the sign-up button
    await page.getByRole('button', { name: /sign up/i }).click();
    
    // Wait for navigation to dashboard or confirmation page
    await page.waitForURL('/dashboard');
    
    // Verify that the user is signed up by checking for welcome message
    await expect(page.getByText(/welcome/i)).toBeVisible();
  });
});
