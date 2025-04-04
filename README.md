# Weather App

A responsive single-page weather application built with Vue 3, TypeScript, and the OpenWeatherMap API.

## Features

- Real-time weather information for any city
- Responsive design that works on all devices
- Clean and modern UI with smooth animations
- Error handling and loading states
- Type-safe development with TypeScript
- State management with Pinia
- Component architecture following Atomic Design principles

## Tech Stack

- Vue 3 with Composition API
- TypeScript
- Vite
- Vue Router
- Pinia (State Management)
- SCSS
- OpenWeatherMap API

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenWeatherMap API key

## Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd weather-app
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add your OpenWeatherMap API key:

```
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

4. Start the development server:

```bash
npm run dev
```

5. Build for production:

```bash
npm run build
```

## Project Structure

```
src/
├── api/              # API integration
├── assets/           # Static assets
├── components/       # Vue components
│   ├── atoms/       # Basic building blocks
│   ├── molecules/   # Combinations of atoms
│   ├── organisms/   # Complex components
│   ├── templates/   # Page layouts
│   └── pages/       # Full pages
├── router/          # Vue Router configuration
├── stores/          # Pinia stores
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## Development Guidelines

- Follow the Atomic Design methodology for component organization
- Use TypeScript for type safety
- Follow Vue 3 Composition API best practices
- Write clean, maintainable code
- Use SCSS for styling with BEM methodology
- Ensure responsive design for all components

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
