export default {
    content: [
        "./index.html",
        "./src/**/**/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#2563EB',
                    dark: '#1D4ED8',
                    light: '#EFF6FF',
                },
                riesgo: {
                    bajo: {
                        DEFAULT: '#22C55E',
                        bg: '#DCFCE7',
                        text: '#166534',
                    },
                    medio: {
                        DEFAULT: '#EAB308',
                        bg: '#FEF9C3',
                        text: '#854D0E',
                    },
                    alto: {
                        DEFAULT: '#EF4444',
                        bg: '#FEE2E2',
                        text: '#991B1B',
                    },
                },
                surface: {
                    bg: '#F9FAFB',
                    card: '#FFFFFF',
                    border: '#D1D5DB',
                    disabled: '#F3F4F6',
                }
            }
        }
    }
}