# AmalaVerse Frontend

A culturally-rich, AI-powered web application for discovering, submitting, and verifying authentic Amala food spots globally. Built with React, TypeScript, and a beautiful Nigerian-inspired design system.

## 🍽️ About AmalaVerse

AmalaVerse is a community-driven platform that helps users discover authentic Amala experiences worldwide. The platform combines user submissions, AI-powered recommendations, and community verification to maintain a trustworthy directory of Amala spots.

## 🎨 Design Philosophy

The design draws inspiration from Nigerian cuisine and culture:
- **Palm Oil Orange** (#e67e22) - Primary brand color representing the rich orange hues
- **Forest Green** (#2d5016) - Secondary color inspired by leafy vegetables
- **Golden Yellow** (#f1c40f) - Accent color representing corn and prosperity
- **Warm Gradients** - Throughout the interface to create an inviting atmosphere

## 🏗️ Architecture

### Frontend Structure
```
src/
├── assets/          # Generated images and static assets
├── components/
│   └── ui/         # Reusable UI components with cultural variants
├── hooks/          # Custom React hooks (including toast)
├── lib/            # Utilities and API functions
├── pages/          # Route components
├── types/          # TypeScript type definitions
└── index.css       # Design system and global styles
```

### Key Features

1. **Home Page** - Hero section with trending spots and feature showcase
2. **Discover Page** - Interactive map-based discovery with filters
3. **Submit Spot Page** - Form for submitting new Amala locations
4. **AI Chat Page** - Voice and text-based AI assistant for recommendations  
5. **Verification Page** - Community-driven spot verification system
6. **Trending Page** - Popular and highly-rated spots showcase
7. **Authentication** - Login and registration pages

### Design System

#### Colors (HSL Values)
- **Primary**: 18 85% 55% (Palm Oil Orange)
- **Secondary**: 145 25% 25% (Forest Green)  
- **Accent**: 45 90% 60% (Golden Yellow)
- **Background**: 30 8% 97% (Warm White)
- **Foreground**: 25 10% 12% (Dark Text)

#### Typography
- **Display Font**: Playfair Display (for headings)
- **Body Font**: Inter (for content)

#### Components
All components use semantic design tokens from the design system:
- **Button variants**: default, hero, cultural, accent, outline, ghost
- **Gradients**: primary, secondary, warm, hero
- **Shadows**: warm, elegant, glow
- **Animations**: smooth transitions and bounce effects

## 🔗 API Integration

The frontend is designed to work seamlessly with the Django backend specified in the PRD. All API calls include fallback mock data for development.

### Backend Endpoints Integrated

#### Authentication
- `POST /api/users/register/` - User registration
- `POST /api/users/login/` - User login

#### Spots Management
- `GET /api/spots/` - Retrieve spots with filtering
- `GET /api/spots/<id>/` - Get specific spot details
- `POST /api/spots/` - Submit new spot
- `GET /api/trending-spots/` - Get popular spots

#### Verification System
- `GET /api/verification-queue/` - Get unverified spots
- `POST /api/verify-spot/` - Submit verification vote

#### AI Chat Interface
- `POST /api/chat/` - Send message to AI agent
- `POST /api/voice/transcribe/` - Transcribe voice messages

### Mock Data Fallback

When backend endpoints are unavailable, the app automatically falls back to comprehensive mock data:
- Sample Amala spots with realistic Nigerian locations
- Mock user authentication
- Simulated API responses with proper delays
- Error handling with graceful degradation

## 🗺️ Map Integration

The discover page includes Mapbox integration for interactive mapping:
- Spot markers with verification status colors
- Popup details for each location
- Navigation controls and search functionality
- Mobile-responsive map interactions

**Note**: Requires Mapbox access token for full functionality. Currently shows fallback UI with cultural design.

## 🎙️ Voice Features

The AI chat page supports voice interactions:
- Browser-based voice recording
- Speech-to-text processing (via backend API)
- Visual recording indicators
- Fallback to text input if voice fails

## 📱 Responsive Design

Fully responsive design optimized for all screen sizes:
- **Mobile-first** approach with touch-friendly interfaces
- **Tablet** layouts with optimal spacing
- **Desktop** enhanced with additional features and layout options
- **Navigation** collapses to hamburger menu on mobile

## 🔧 Development Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation
```bash
# Clone the repository
git clone [repository-url]
cd amalaverse-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Configuration (No .env required)
This project avoids environment variables for compatibility. Configure via browser localStorage:

- Backend Base URL:
  - Key: `api_base_url`
  - Value: e.g., `https://your-backend.com/api`
  - Set it in the browser console:
    ```js
    localStorage.setItem('api_base_url', 'https://your-backend.com/api')
    ```
- Mapbox Token (for map on Discover page):
  - Key: `mapbox_public_token`
  - Value: your Mapbox public token
  - Set it in the browser console:
    ```js
    localStorage.setItem('mapbox_public_token', 'pk.your_mapbox_public_token')
    ```

If no backend URL is configured, the app automatically uses mock data for all endpoints.

### Build for Production
```bash
npm run build
```

## 🧪 Testing

The application includes comprehensive error handling:
- API failure graceful degradation
- Image loading fallbacks
- Network error recovery
- Form validation with user feedback

## 🚀 Deployment

The frontend is optimized for deployment on modern hosting platforms:
- Static asset optimization
- Code splitting for performance
- Progressive enhancement
- SEO-ready with proper meta tags

## 📦 Dependencies

### Core Technologies
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling

### UI Components
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons
- **shadcn/ui** - Component library (customized)

### Functionality
- **Axios** - HTTP client with interceptors
- **React Router** - Client-side routing
- **Mapbox GL JS** - Interactive mapping
- **React Query** - Server state management

### Utilities
- **clsx** - Conditional class names
- **tailwind-merge** - Tailwind class optimization
- **class-variance-authority** - Component variants

## 🎯 Future Enhancements

Planned features for future iterations:
1. **Real-time notifications** for verification updates
2. **Social features** like user profiles and reviews
3. **Advanced filtering** with cuisine preferences
4. **Offline support** with service workers
5. **Photo optimization** and multiple image uploads
6. **Geofencing** for location-based features

## 🤝 Contributing

The codebase follows React and TypeScript best practices:
- Component composition over inheritance
- Custom hooks for shared logic
- Type-safe API integration
- Consistent styling via design system
- Accessibility-first component design

## 📄 License

This project is part of the AmalaVerse MVP as specified in the Product Requirements Document.