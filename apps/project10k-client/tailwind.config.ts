import type { Config } from "tailwindcss";
const defaultTheme = require('tailwindcss/defaultTheme')

const config: Config = {
    darkMode: ['class'],
    safelist: ['ProseMirror'],
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "../../packages/catalyst/**/*.{js,ts,jsx,tsx,mdx}", // Catalyst UI Package Tailwind Pickup
        "../../packages/block-editor/src/**/*.{js,ts,jsx,tsx,mdx}" // Block Editor UI Package Tailwind Pickup
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
            }
        }
    },
    plugins: [
        require('@tailwindcss/typography')()
    ]
};
export default config;
