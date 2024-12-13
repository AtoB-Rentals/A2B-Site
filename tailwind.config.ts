import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    './layouts/**/*.{js,ts,jsx,tsx}', // Ensure all possible folders are included
  ],
  daisyui: {
    // themes: false, // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
    darkTheme: "dark", // name of one of the included themes for dark mode
    // base: true, // applies background color and foreground color for root element by default
    // styled: true, // include daisyUI colors and design decisions for all components
    // utils: true, // adds responsive and modifier utility classes
    // prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    // logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    // themeRoot: ":root", // The element that receives theme color CSS variables

    themes: [
      {
        light: {
          primary: '#1D4ED8', // Blue for buttons and links
          secondary: '#F97316', // Orange for accents
          accent: '#F59E0B', // Yellow for highlights
          neutral: '#374151', // Neutral dark gray
          'base-100': '#FFFFFF', // White background
          info: '#3B82F6', // Light Blue for info messages
          success: '#10B981', // Green for success messages
          warning: '#F59E0B', // Yellow for warnings
          error: '#EF4444', // Red for errors
        },
      },
      {
        dark: {
          primary: '#3B82F6', // Bright Blue
          secondary: '#F97316', // Vibrant Orange
          accent: '#F43F5E', // Reddish-pink for highlights
          neutral: '#1E293B', // Dark neutral
          'base-100': '#111827', // Dark background
          info: '#60A5FA', // Light Blue
          success: '#34D399', // Green for success
          warning: '#F59E0B', // Orange for warnings
          error: '#F87171', // Light red for errors
        },
      }
    ]
  },
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
};
export default config;
