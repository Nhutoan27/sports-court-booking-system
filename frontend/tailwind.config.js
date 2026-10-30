export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          container: '#DBEAFE',
          'container-alt': '#BFDBFE',
          'on-container': '#1E3A8A',
          dark: '#1E40AF',
        },
        secondary: {
          DEFAULT: '#475569',
          dark: '#334155',
        },
        accent: {
          DEFAULT: '#84CC16',
          dark: '#4D7C0F',
          container: '#ECFCCB',
          'on-container': '#365314',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          alt: '#F8FAFC',
          soft: '#F7F9FC',
          variant: '#EAF0F7',
          'variant-2': '#EFF4F9',
          'variant-3': '#ECF1F7',
        },
        background: '#F5F7FA',
        outline: {
          DEFAULT: '#CBD5E1',
          variant: '#E2E8F0',
        },
        ink: {
          DEFAULT: '#0F172A',
          muted: '#475569',
          soft: '#64748B',
        },
        danger: {
          DEFAULT: '#DC2626',
          container: '#FEE2E2',
          'on-container': '#7F1D1D',
        },
        success: {
          DEFAULT: '#16A34A',
          dark: '#15803D',
        },
        warning: {
          DEFAULT: '#D97706',
          dark: '#B45309',
          container: '#FEF3C7',
          accent: '#FBBF24',
          glow: '#FDE68A',
        },
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '10px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '28px',
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(15,23,42,0.04), 0 1px 3px 0 rgba(15,23,42,0.06)',
        soft: '0 2px 8px -2px rgba(15,23,42,0.06), 0 12px 28px -12px rgba(15,23,42,0.10)',
        primary: '0 8px 20px -6px rgba(37,99,235,0.35)',
        'primary-lg': '0 20px 40px -12px rgba(37,99,235,0.35)',
        'glow-accent': '0 8px 20px -6px rgba(132,204,22,0.4)',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in': 'fade-in 0.5s ease-out both',
      },
    },
  },
  plugins: [],
};
