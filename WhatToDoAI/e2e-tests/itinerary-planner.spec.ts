import { test, expect } from '@playwright/test';

test.describe('Itinerary Planner', () => {
  // Before each test, navigate to the itinerary planner page
  test.beforeEach(async ({ page }) => {
    // First sign in
    await page.goto('/signin');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Navigate to the itinerary planner page
    await page.goto('/itinerary');
  });

  test('should display empty state for new itinerary', async ({ page }) => {
    // Check that the empty state is displayed
    await expect(page.getByText(/no activities|start planning/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /add activities|browse activities/i })).toBeVisible();
  });

  test('should allow adding activities to itinerary', async ({ page }) => {
    // Click the button to add activities
    await page.getByRole('button', { name: /add activities|browse activities/i }).click();
    
    // Wait for navigation to the activities page
    await page.waitForURL('/activities');
    
    // Select an activity
    const firstCard = page.locator('.activity-card').first();
    await firstCard.getByRole('button', { name: /add to itinerary/i }).click();
    
    // Navigate back to the itinerary page
    await page.goto('/itinerary');
    
    // Check that the activity is in the itinerary
    await expect(page.locator('.itinerary-item')).toHaveCount(1);
  });

  test('should allow scheduling activities', async ({ page }) => {
    // First add an activity to the itinerary
    await page.goto('/activities');
    await page.locator('.activity-card').first().getByRole('button', { name: /add to itinerary/i }).click();
    await page.goto('/itinerary');
    
    // Click to schedule the activity
    await page.locator('.itinerary-item').first().getByRole('button', { name: /schedule|set time/i }).click();
    
    // Set a date and time
    await page.getByLabel(/date/i).fill('2023-12-25');
    await page.getByLabel(/time/i).fill('14:00');
    await page.getByRole('button', { name: /save|confirm/i }).click();
    
    // Check that the activity is scheduled
    await expect(page.locator('.itinerary-item').first()).toContainText(/Dec 25|2023-12-25/);
    await expect(page.locator('.itinerary-item').first()).toContainText(/2:00 PM|14:00/);
  });

  test('should allow reordering activities', async ({ page }) => {
    // First add multiple activities to the itinerary
    await page.goto('/activities');
    await page.locator('.activity-card').nth(0).getByRole('button', { name: /add to itinerary/i }).click();
    await page.locator('.activity-card').nth(1).getByRole('button', { name: /add to itinerary/i }).click();
    await page.goto('/itinerary');
    
    // Get the names of the activities in their initial order
    const firstActivityName = await page.locator('.itinerary-item').nth(0).getByRole('heading').textContent();
    const secondActivityName = await page.locator('.itinerary-item').nth(1).getByRole('heading').textContent();
    
    // Drag the second activity above the first
    await page.locator('.itinerary-item').nth(1).dragTo(page.locator('.itinerary-item').nth(0));
    
    // Check that the order has changed
    await expect(page.locator('.itinerary-item').nth(0).getByRole('heading')).toHaveText(secondActivityName);
    await expect(page.locator('.itinerary-item').nth(1).getByRole('heading')).toHaveText(firstActivityName);
  });

  test('should allow removing activities from itinerary', async ({ page }) => {
    // First add an activity to the itinerary
    await page.goto('/activities');
    await page.locator('.activity-card').first().getByRole('button', { name: /add to itinerary/i }).click();
    await page.goto('/itinerary');
    
    // Check that the activity is in the itinerary
    await expect(page.locator('.itinerary-item')).toHaveCount(1);
    
    // Click to remove the activity
    await page.locator('.itinerary-item').first().getByRole('button', { name: /remove|delete/i }).click();
    
    // Confirm the removal if there's a confirmation dialog
    const confirmButton = page.getByRole('button', { name: /confirm|yes/i });
    if (await confirmButton.isVisible()) {
      await confirmButton.click();
    }
    
    // Check that the activity is removed
    await expect(page.locator('.itinerary-item')).toHaveCount(0);
    await expect(page.getByText(/no activities|start planning/i)).toBeVisible();
  });

  test('should allow saving and sharing itinerary', async ({ page }) => {
    // First add an activity to the itinerary
    await page.goto('/activities');
    await page.locator('.activity-card').first().getByRole('button', { name: /add to itinerary/i }).click();
    await page.goto('/itinerary');
    
    // Save the itinerary
    await page.getByRole('button', { name: /save|save itinerary/i }).click();
    
    // Enter a name for the itinerary if prompted
    const nameInput = page.getByLabel(/name|title/i);
    if (await nameInput.isVisible()) {
      await nameInput.fill('My Test Itinerary');
      await page.getByRole('button', { name: /save|confirm/i }).click();
    }
    
    // Check for success message
    await expect(page.getByText(/saved|itinerary saved/i)).toBeVisible();
    
    // Click share button
    await page.getByRole('button', { name: /share/i }).click();
    
    // Check that share options are displayed
    await expect(page.getByText(/copy link|share via/i)).toBeVisible();
  });
});
