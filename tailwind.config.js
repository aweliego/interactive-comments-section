/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          blue: {
            light: 'hsl(239, 57%, 85%)',
            moderate: 'hsl(238, 40%, 52%)'
          },
          red: {
            soft: 'hsl(358, 79%, 66%)',
            pale: 'hsl(357, 100%, 86%)'
          }
        },
        neutral: {
          blue: {
            dark: 'hsl(212, 24%, 26%)',
            grayish: 'hsl(211, 10%, 45%)'
          },
          gray: {
            light: 'hsl(223, 19%, 93%)',
            "extra-light": 'hsl(228, 33%, 97%)'
          },
          white: 'hsl(0, 0%, 100%)'
        }
      },
      fontFamily: {
        body: ['Rubik'],
      },
      gridTemplateColumns: {
        desktop: 'min-content 1fr min-content'
      },
      gridTemplateRows: {
        mobile: 'repeat(3, min-content)',
        desktop: 'min-content min-content'
      },
      screens: {
        sm: '600px',
        md: '970px',
        lg: '1440px'
      },
    },
  },
  plugins: [],
}

