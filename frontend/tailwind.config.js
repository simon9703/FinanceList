/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/index.html', './src/**/*.{html,js,ts,jsx,tsx}'],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'PingFang SC',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 18px 50px rgba(24, 32, 45, .06)',
        glass: '0 18px 60px rgba(18, 43, 94, .08)',
        chip: '0 10px 32px rgba(22, 28, 45, .06)',
        primary: '0 16px 34px rgba(22, 119, 255, .28)',
      },
      colors: {
        ink: '#172033',
        muted: '#7a8496',
        primary: '#1677ff',
        success: '#18b779',
      },
    },
  },
}
