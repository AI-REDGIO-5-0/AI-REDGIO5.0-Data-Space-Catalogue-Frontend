import TailwindForms from '@tailwindcss/forms';
import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';
import { fontFamily } from 'tailwindcss/defaultTheme';

export default {
    content: ['./components/**/*.{vue,js,ts}', './layouts/**/*.vue', './pages/**/*.vue', './app.{js,ts,vue}'],
    theme: {
        extend: {
            colors: {
                'ai-redgio': {
                    '50': '#0072bb',
                    '100': '#001726',
                    '200': '#002f4b',
                    '300': '#004671',
                    '400': '#005d97',
                    '500': '#0072bb',
                    '600': '#009cfd',
                    '700': '#3eb5ff',
                    '800': '#7eceff',
                    '900': '#bfe6ff',
                },
                secondary: "#F1582A",
            },
            fontFamily: {
                sans: ['Inter var', ...fontFamily.sans],
            },
        },
    },
    plugins: [TailwindForms],
} satisfies Config;
