module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          500: '#6366f1'
        },
        surface: '#f8fafc'
      },
      borderRadius: {
        lg: '12px'
      }
    }
  },
  plugins: []
}
