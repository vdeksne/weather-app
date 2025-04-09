// Color Palette
export const colors = {
  // Primary Colors
  primary: {
    light: "#fff",
    main: "#000",
    dark: "#000",
  },

  // Secondary Colors
  secondary: {
    light: "#fff",
    main: "#000",
    dark: "#000",
  },

  // Accent Colors
  accent: {
    success: "#28A745",
    warning: "#FFC107",
    danger: "#DC3545",
    info: "#17A2B8",
  },

  // Neutral Colors
  neutral: {
    white: "#FFFFFF",
    grey: "#F5F5F5",
    lightBlue: "#E9ECEF",
    blue: "#DEE2E6",
    darkBlue: "#2E3A5A",
    black: "#000",
  },

  // Background Colors
  background: {
    default: "#FFFFFF",
    blue: "linear-gradient(118deg, #4F80FA 1.2%, #3764D7 59.26%, #335FD1 79.2%)",
  },

  // Text Colors
  text: {
    primary: "#000",
    secondary: "#fff",
    tertiary: "#545454",
    hint: "#6C757D",
    light: "#F8F9FA",
  },
  //button
  button: {
    primary: "#2E3A5A",
    secondary: "#fff",
  },
};

// Typography
export const typography = {
  // Font Families
  fontFamily: {
    primary: '"SF Pro Display", sans-serif',
    secondary: "Poppins, sans-serif",
    monospace: "Consolas, monospace",
  },

  // Font Sizes
  fontSize: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
    "5xl": "3rem", // 48px
  },

  // Font Weights
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Line Heights
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
};

// Spacing
export const spacing = {
  xs: "0.25rem", // 4px
  sm: "0.75rem", // 8px
  md: "1rem", // 16px
  lg: "1.5rem", // 24px
  xl: "2rem", // 32px
  "2xl": "2.5rem", // 40px
  "3xl": "3rem", // 48px
  "4xl": "4rem", // 64px
};

// Border Radius
export const borderRadius = {
  none: "0",
  sm: "0.125rem", // 2px
  base: "0.25rem", // 4px
  md: "0.375rem", // 6px
  lg: "0.5rem", // 8px
  xl: "0.75rem", // 12px
  "2xl": "1rem", // 16px
  full: "9999px",
};

// Shadows
export const shadows = {
  none: "none",
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  base: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
};

// Transitions
export const transitions = {
  fast: "150ms",
  normal: "300ms",
  slow: "500ms",
  timing: {
    ease: "ease",
    linear: "linear",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
  },
};

// Z-index
export const zIndex = {
  negative: -1,
  zero: 0,
  low: 10,
  medium: 100,
  high: 1000,
  highest: 9999,
};

// Breakpoints
export const breakpoints = {
  xs: "320px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

// Application Text
export const text = {
  // UI Text
  ui: {
    search: "Search for a city or airport",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    warning: "Warning",
    info: "Information",
    close: "Close",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    remove: "Remove",
    back: "Back",
    next: "Next",
    previous: "Previous",
    submit: "Submit",
    reset: "Reset",
  },

  // Weather-specific Text
  weather: {
    current: "Current Weather",
    forecast: "Forecast",
    hourly: "Hourly Forecast",
    daily: "Daily Forecast",
    temperature: "Temperature",
    humidity: "Humidity",
    wind: "Wind",
    pressure: "Pressure",
    visibility: "Visibility",
    sunrise: "Sunrise",
    sunset: "Sunset",
    feelsLike: "Feels Like",
    high: "High",
    low: "Low",
    precipitation: "Precipitation",
    uvIndex: "UV Index",
    dewPoint: "Dew Point",
    moonPhase: "Moon Phase",
  },

  // Error Messages
  errors: {
    general: "Something went wrong. Please try again.",
    network: "Network error. Please check your connection.",
    notFound: "Not found.",
    unauthorized: "Unauthorized access.",
    forbidden: "Access forbidden.",
    serverError: "Server error. Please try again later.",
    validation: "Please check your input and try again.",
    apiKey: "API key error. Please check your configuration.",
    location: "Location error. Please enable location services.",
    speechRecognition: "Speech recognition is not supported in your browser.",
  },

  // Success Messages
  success: {
    saved: "Changes saved successfully.",
    added: "Item added successfully.",
    removed: "Item removed successfully.",
    updated: "Item updated successfully.",
  },
};

// Export all theme values
export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  zIndex,
  breakpoints,
  text,
};
