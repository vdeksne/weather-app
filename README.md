# Weather App

A responsive single-page weather application built with Vue 3, TypeScript, and the OpenWeatherMap API. Features voice search capability using the Web Speech API for an enhanced user experience.

See the live demo here: https://weather-app-steel-two-65.vercel.app/

<img src="src/assets/images/video.gif" alt="Demo Video" width="300"/>

## Features

- **Real-time Weather Information**

  - Current weather conditions
  - Temperature, humidity, and wind speed
  - Weather forecasts for multiple cities
  - Location-based weather detection

- **Smart Search Functionality**

  - Voice search capability using Web Speech API
  - City and airport search
  - Real-time search suggestions
  - Recent searches history

- **User Experience**

  - Responsive design for all devices
  - Clean and modern UI with smooth animations
  - Intuitive navigation
  - Loading states and error handling

- **Technical Features**
  - Type-safe development with TypeScript
  - State management with Pinia
  - Component architecture following Atomic Design principles
  - SCSS styling with BEM methodology

## Tech Stack

- **Frontend Framework**

  - Vue 3 with Composition API
  - TypeScript
  - Vite
  - Vue Router
  - Pinia (State Management)

- **Styling**

  - SCSS
  - Tailwind CSS
  - BEM methodology

- **APIs**
  - OpenWeatherMap API
  - Web Speech API (for voice search)

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenWeatherMap API key
- Modern web browser with Web Speech API support (Chrome recommended)

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd weather-app
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory:

   ```
   VITE_OPENWEATHER_API_KEY=your_api_key_here
   ```

4. **Development:**

   ```bash
   npm run dev
   ```

5. **Production Build:**
   ```bash
   npm run build
   ```

## Testing

```bash
# Run unit tests
npm run test:unit

# Run tests in watch mode
npm run test:watch
```

## License

This project is licensed under the Educational Use License - see the [LICENSE](LICENSE) file for details. This license restricts usage to educational purposes only and prohibits commercial use.

