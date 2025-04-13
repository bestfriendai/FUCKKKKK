import { test, expect } from '@playwright/test';

test.describe('Activity Discovery', () => {
  // Before each test, navigate to the activity discovery page
  test.beforeEach(async ({ page }) => {
    // First sign in
    await page.goto('/signin');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Navigate to the activity discovery page
    await page.goto('/activities');
  });

  test('should display activity cards', async ({ page }) => {
    // Check that activity cards are displayed
    await expect(page.locator('.activity-card')).toHaveCount({ min: 1 });
    
    // Check that each card has basic information
    const firstCard = page.locator('.activity-card').first();
    await expect(firstCard.getByRole('heading')).toBeVisible();
    await expect(firstCard.getByText(/location|venue/i)).toBeVisible();
  });

  test('should filter activities by category', async ({ page }) => {
    // Click on a category filter
    await page.getByRole('button', { name: /outdoors/i }).click();
    
    // Wait for the filtered results to load
    await page.waitForResponse(response => 
      response.url().includes('/api/activities') && 
      response.status() === 200
    );
    
    // Check that the filter is applied (UI indication)
    await expect(page.getByRole('button', { name: /outdoors/i })).toHaveClass(/selected|active/);
    
    // Check that the filtered activities are displayed
    await expect(page.locator('.activity-card')).toHaveCount({ min: 1 });
  });

  test('should search for activities by keyword', async ({ page }) => {
    // Enter a search term
    await page.getByPlaceholder(/search/i).fill('museum');
    await page.getByRole('button', { name: /search|find/i }).click();
    
    // Wait for the search results to load
    await page.waitForResponse(response => 
      response.url().includes('/api/activities') && 
      response.url().includes('museum') && 
      response.status() === 200
    );
    
    // Check that search results are displayed
    await expect(page.locator('.activity-card')).toHaveCount({ min: 1 });
    
    // Check that the search term is highlighted or present in the results
    await expect(page.locator('.activity-card').first()).toContainText(/museum/i);
  });

  test('should navigate to activity details when clicking on a card', async ({ page }) => {
    // Click on the first activity card
    const firstCard = page.locator('.activity-card').first();
    const activityTitle = await firstCard.getByRole('heading').textContent();
    await firstCard.click();
    
    // Wait for navigation to the activity details page
    await page.waitForURL(/\/activities\/[\w-]+/);
    
    // Check that the activity details are displayed
    await expect(page.getByRole('heading', { name: activityTitle })).toBeVisible();
    await expect(page.getByText(/description|about/i)).toBeVisible();
  });

  test('should add activity to itinerary', async ({ page }) => {
    // Click the "Add to Itinerary" button on the first activity card
    await page.locator('.activity-card').first().getByRole('button', { name: /add to itinerary/i }).click();
    
    // Check that a confirmation message is displayed
    await expect(page.getByText(/added to itinerary|successfully added/i)).toBeVisible();
    
    // Navigate to the itinerary page
    await page.getByRole('link', { name: /itinerary|my plan/i }).click();
    
    // Check that the activity is in the itinerary
    await expect(page.locator('.itinerary-item')).toHaveCount({ min: 1 });
  });
});
