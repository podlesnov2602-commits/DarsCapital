/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        foreground: '#1A1A1A',
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#0B0F19'
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#0B0F19'
        },
        primary: {
          DEFAULT: '#0F2A44',
          foreground: '#FFFFFF'
        },
        secondary: {
          DEFAULT: '#F7F9FC',
          foreground: '#0F2A44'
        },
        muted: {
          DEFAULT: '#F7F9FC',
          foreground: '#6B7280'
        },
        accent: {
          DEFAULT: '#6FA8FF',
          foreground: '#FFFFFF'
        },
        accentblue: {
          DEFAULT: '#6FA8FF',
          hover: '#5B95EE'
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#f8fafc'
        },
        border: '#E5E7EB',
        input: '#E5E7EB',
        ring: '#6FA8FF',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.6s ease-out forwards'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
};
