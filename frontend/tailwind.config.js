/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0F19',
        panel: '#151923',
        'panel-light': '#1C212D',
        'panel-border': '#2A303C',
        cyan: {
          DEFAULT: '#00E5FF',
          dark: 'rgba(0, 229, 255, 0.1)',
        },
        purple: {
          DEFAULT: '#8B5CF6',
        },
        semantic: {
          good: '#10B981',
          moderate: '#FBBF24',
          high: '#F59E0B',
          unhealthy: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(to right, rgba(21,25,35,0.9) 30%, rgba(21,25,35,0.4) 100%), url("/city_graphic.png")',
      }
    },
  },
  plugins: [],
}
