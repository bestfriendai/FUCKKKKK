# WhatToDoAI

WhatToDoAI is a comprehensive activity discovery and itinerary planning application that helps users find and organize activities based on their preferences and location.

## Features

- **Activity Discovery**: Find activities, events, and places of interest near you or in a specific location
- **Smart Filtering**: Filter activities by category, price, distance, and more
- **Activity Details**: View comprehensive information about each activity, including descriptions, images, and reviews
- **Map View**: Visualize activities on an interactive map
- **Itinerary Planning**: Create and manage detailed itineraries with scheduled activities
- **User Accounts**: Sign up, sign in, and manage your profile
- **Dark Mode**: Toggle between light and dark themes

## Project Structure

The project consists of two main applications:

- **Web App**: React-based web application
- **Mobile App**: React Native/Expo mobile application

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm (v8 or later)
- Expo CLI (for mobile development)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/whattodoai.git
   cd whattodoai
   ```

2. Install dependencies:
   ```
   # Root dependencies
   npm install
   
   # Web app dependencies
   cd web
   npm install
   
   # Mobile app dependencies
   cd ../mobile
   npm install
   ```

3. Set up environment variables:
   - Create `.env` files in both the `web` and `mobile` directories
   - Add the following variables:
     ```
     SUPABASE_URL=your_supabase_url
     SUPABASE_ANON_KEY=your_supabase_anon_key
     EVENTBRITE_API_KEY=your_eventbrite_api_key
     TRIPADVISOR_API_KEY=your_tripadvisor_api_key
     ```

### Running the Applications

#### Web App

```
cd web
npm start
```

The web app will be available at http://localhost:3000

#### Mobile App

```
cd mobile
npm start
```

This will start the Expo development server. You can run the app on:
- iOS Simulator
- Android Emulator
- Physical device using the Expo Go app

## Testing

### Unit and Integration Tests

```
# Run web tests
cd web
npm test

# Run mobile tests
cd mobile
npm test
```

### End-to-End Tests

```
# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run E2E tests in debug mode
npm run test:e2e:debug

# View E2E test report
npm run test:e2e:report
```

## Deployment

The project uses GitHub Actions for CI/CD:

- **CI Pipeline**: Runs tests on every push and pull request
- **Web Deployment**: Deploys the web app to Vercel on pushes to main
- **Mobile Deployment**: Builds the mobile app with Expo EAS on pushes to main

## Technologies Used

### Web App
- React
- React Router
- Styled Components
- Supabase (Authentication & Database)
- Mapbox (Maps)

### Mobile App
- React Native
- Expo
- React Navigation
- Gluestack UI
- Supabase (Authentication & Database)
- React Native Maps

### Testing
- Jest
- React Testing Library
- Playwright (E2E)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
