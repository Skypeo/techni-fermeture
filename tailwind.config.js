/** @type {import('tailwindcss').Config} */
module.exports = {
  // Scanne les 13 pages HTML + le JS partagé (classes togglées dynamiquement)
  content: ['./*.html', './assets/js/*.js'],
  // Utilitaires ajoutés/retirés par JS — gardés même si peu visibles dans le HTML
  safelist: ['hidden', 'opacity-0', 'translate-y-24'],
  theme: {
    extend: {
      colors: {
        ink: '#0F1419',
        inksoft: '#1A2128',
        accent: '#C00000',
        accentdark: '#9A0000',
        teal: '#2D5547',
        bone: '#FAFAF7',
        stone: '#F4F1EA',
        slate2: '#5A6470',
      },
      fontFamily: {
        display: ['Manrope', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 1px 2px rgba(15,20,25,.04), 0 8px 24px rgba(15,20,25,.06)',
        'lift': '0 8px 16px rgba(15,20,25,.06), 0 24px 48px rgba(15,20,25,.10)',
      },
    },
  },
  plugins: [],
}
