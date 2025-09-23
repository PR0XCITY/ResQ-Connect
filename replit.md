# Overview

ResQ Connect is a travel safety and disaster management application designed for North-Eastern India. The app enables users to report disasters in real-time, access community alerts, receive AI-powered safety guidance, and navigate through safer routes. It addresses unique regional challenges including hilly terrain, unpredictable weather, and recurring natural disasters like landslides, floods, and earthquakes. The application operates in demo mode with mock services, allowing for prototype functionality without external API dependencies.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React Native with Expo for cross-platform development (mobile and web)
- **Routing**: Expo Router with file-based routing system using tabs layout
- **Styling**: TailwindCSS with NativeWind for responsive design
- **Animations**: React Native Reanimated for smooth UI interactions
- **State Management**: React Context API for global state (Auth, Disaster, Theme)
- **Web Compatibility**: React Leaflet for web-based mapping, replacing react-native-maps

## Demo Mode Architecture
- **Mock Services**: Complete mock implementation replacing all external dependencies
- **Local Storage**: Browser localStorage and AsyncStorage for data persistence
- **Demo Banner**: Visual indicator when running in demo mode
- **Configuration**: Environment-based demo mode switching via EXPO_PUBLIC_DEMO_MODE

## Data Layer
- **Mock Data Service**: Centralized service providing CRUD operations for profiles, disaster reports, and danger zones
- **Storage Abstraction**: Cross-platform storage layer supporting web localStorage and React Native AsyncStorage
- **Type Safety**: TypeScript interfaces for all data models (Profile, DisasterReport, DangerZone)

## Authentication System
- **Mock Authentication**: Demo-only auth service with localStorage-based session management
- **Profile Management**: User profiles with emergency contacts and preferences
- **Context Provider**: AuthContext managing authentication state across the app

## Mapping and Location
- **Web Maps**: React Leaflet for web compatibility with custom markers and overlays
- **Location Services**: Expo Location for GPS and geolocation features
- **Disaster Visualization**: Interactive map with disaster markers, danger zones, and filtering
- **Responsive Design**: Map adapts to different screen sizes and platforms

## Emergency Features
- **SOS System**: Emergency alert system with countdown and contact notification
- **Disaster Reporting**: Form-based reporting with photo upload and categorization
- **AI Assistant**: Mock AI responses for safety guidance and emergency advice
- **Community Alerts**: Real-time disaster alerts with severity levels and verification status

# External Dependencies

## Core Framework Dependencies
- **Expo SDK 53**: Cross-platform development framework
- **React Native 0.79.5**: Mobile application framework
- **React 19.0.0**: Core React library for UI components

## UI and Navigation
- **Expo Router**: File-based routing and navigation
- **React Navigation**: Tab and stack navigation components
- **NativeWind**: TailwindCSS integration for React Native styling
- **Lucide React Native**: Icon library for consistent iconography

## Mapping and Location
- **React Leaflet**: Web-compatible mapping library
- **Leaflet**: Core mapping functionality for web platform
- **Expo Location**: GPS and location services

## Multimedia and Device Features
- **Expo Image Picker**: Camera and photo selection functionality
- **Expo AV**: Audio/video handling for emergency features
- **Expo Camera**: Camera access for disaster reporting
- **Expo Haptics**: Vibration feedback for emergency alerts

## Storage and State
- **AsyncStorage**: Cross-platform local storage for React Native
- **React Native Reanimated**: Animation library for smooth interactions

## Demo Mode Dependencies
- **localStorage**: Browser-based storage for web demo mode
- **Mock Services**: In-memory data structures for prototype functionality

## Development Tools
- **TypeScript**: Type safety and development tooling
- **Babel**: JavaScript compilation with Expo preset
- **ESLint**: Code linting and formatting standards