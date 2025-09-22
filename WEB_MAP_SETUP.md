# Web-Compatible Disaster Map Setup

## Overview
The disaster map has been updated to be web-compatible by replacing `react-native-maps` with `react-leaflet`. This allows the application to run properly on web browsers while maintaining mobile compatibility.

## Changes Made

### 1. Replaced react-native-maps with react-leaflet
- **File**: `app/(tabs)/disaster-map.tsx`
- **Change**: Removed `react-native-maps` imports and replaced with web-compatible `WebMap` component
- **Benefit**: Eliminates the "Unable to resolve react-native-maps" error

### 2. Created WebMap Component
- **File**: `components/WebMap.tsx`
- **Features**:
  - Uses `react-leaflet` for web compatibility
  - Platform-specific rendering (web vs mobile)
  - Interactive disaster markers with custom icons
  - Danger zone circles
  - Responsive design with proper styling
  - Fallback UI for non-web platforms

### 3. Enhanced Styling
- **Web-specific improvements**:
  - Responsive header with backdrop blur effect
  - Improved modal styling for web browsers
  - Better floating action button design
  - Enhanced map container with shadows and rounded corners

## Dependencies
The following packages are already included in `package.json`:
- `leaflet`: ^1.9.4
- `react-leaflet`: ^5.0.0

## How to Run

### Development Mode
```bash
# Start the development server
expo start

# Or specifically for web
expo start --web
```

### Build for Web
```bash
# Build for web deployment
expo export --platform web
```

## Features

### Interactive Map
- **Disaster Markers**: Clickable markers showing different disaster types
- **Custom Icons**: Color-coded markers with emoji icons
- **Popups**: Detailed information on marker click
- **Danger Zones**: Red circles showing hazardous areas

### Disaster Reporting
- **Report Modal**: Form to submit new disaster reports
- **Photo Upload**: Camera integration for evidence photos
- **Severity Levels**: Low, Medium, High, Critical classifications
- **Disaster Types**: Flood, Earthquake, Landslide, Storm, Fire, Accident, Other

### Responsive Design
- **Web-optimized**: Full-screen map with proper controls
- **Mobile-friendly**: Fallback UI for mobile platforms
- **Modern UI**: Glass-morphism effects and smooth animations

## Platform Support

### Web (Primary)
- Full interactive map functionality
- All features available
- Optimized for desktop and tablet use

### Mobile (Fallback)
- Shows informative message
- Suggests using web browser
- Maintains app structure

## Troubleshooting

### If you see "Map not available on this platform"
- This is expected on mobile platforms
- Use a web browser to access the full map functionality

### If the map doesn't load
- Ensure you're running on web platform
- Check browser console for any errors
- Verify that `leaflet` and `react-leaflet` are properly installed

## Future Enhancements
- Add real-time data integration
- Implement clustering for many markers
- Add search functionality
- Include weather overlays
- Add offline map support

