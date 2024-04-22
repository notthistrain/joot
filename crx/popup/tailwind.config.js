/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './popup.html',
        './src/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
};
