Demo mode
---------

Set `EXPO_PUBLIC_DEMO_MODE=true` in your environment (see `.env.example`). In demo mode, the app uses local mocks and storage suitable for Expo Go.

# README Analysis: Saheli → ResQ Connect Refactor

## Project Summary (6-8 bullet points)

• **Original Purpose**: Women's safety app with wearable dashcam, AI safety network, and donation engine for personal protection and community empowerment
• **Core Features**: ESP32-CAM wearable device, mobile app with SOS alerts, safe route navigation, AI noise detection, fake call mode, geo-fencing, community ratings
• **Architecture**: React Native with Expo, TypeScript, Tailwind CSS, ESP32-CAM hardware, Firebase/AWS cloud, blockchain for NGO transparency
• **Languages/Frameworks**: React Native, TypeScript, Expo Router, NativeWind/Tailwind, React Native Reanimated, Lucide icons
• **Hardware Components**: ESP32-CAM with night vision, local storage, secure cloud uploads, trust light, buzzer, haptic alerts
• **Target Users**: Women seeking personal safety solutions, with focus on accessibility (low literacy, multiple languages)
• **Social Impact Model**: Purchase-to-donation (every 10 devices funds 1 for NGOs), blockchain-verified delivery tracking
• **Current State**: Hackathon-ready prototype with app-only Phase 1, hardware integration planned for Phase 2

## Immediate Risks/Bugs/Technical Debts (5 items)

1. **Missing Backend Infrastructure**: No server-side code, API endpoints, or database schemas for emergency alerts, location sharing, or device communication
2. **Hardcoded Mock Responses**: AI assistant uses static response patterns instead of real OpenAI integration, limiting scalability and personalization
3. **No Offline/Network Resilience**: App lacks offline storage, network failure handling, or fallback mechanisms for critical safety features
4. **Security Vulnerabilities**: No API key management, encryption implementation, or secure data transmission protocols visible in current codebase
5. **Incomplete Hardware Integration**: ESP32-CAM firmware missing, no device pairing logic, and no real-time communication between app and hardware components

## Technical Architecture Gaps

• **No Backend Services**: Missing REST API, WebSocket connections, or real-time communication infrastructure
• **No Database Layer**: No user profiles, emergency contacts, location history, or device management persistence
• **No Authentication System**: No user registration, login, or secure session management
• **No Real-time Features**: No live location tracking, instant notifications, or real-time emergency response coordination
• **No Cloud Storage**: No secure file storage for recordings, images, or emergency data backup
• **No Payment Integration**: Missing donation processing, subscription management, or e-commerce functionality
• **No Testing Framework**: No unit tests, integration tests, or end-to-end testing infrastructure
• **No CI/CD Pipeline**: No automated builds, testing, or deployment processes

## Refactor Priorities for ResQ Connect

1. **Safety-First Architecture**: Implement robust offline capabilities, multiple communication channels, and fail-safe emergency protocols
2. **Hardware Integration**: Create reliable device communication, OTA updates, and hardware status monitoring
3. **AI Enhancement**: Integrate real OpenAI API with fallback responses, multilingual support, and contextual safety advice
4. **Security Hardening**: Implement end-to-end encryption, secure API key management, and privacy protection
5. **Testing & Reliability**: Add comprehensive test coverage, error handling, and performance monitoring
