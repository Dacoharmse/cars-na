/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Primary brand colors
        primary: {
          DEFAULT: "#0F52BA", // Royal Blue
          50: "#EBF2FF",
          100: "#D6E4FF",
          200: "#ADC8FF",
          300: "#85ACFF",
          400: "#5C90FF",
          500: "#0F52BA", // Primary
          600: "#0C42A3",
          700: "#09318C",
          800: "#062175",
          900: "#03105E",
          950: "#020A47",
        },
        // Secondary brand colors
        secondary: {
          DEFAULT: "#FF6B35", // Coral
          50: "#FFF1EC",
          100: "#FFE4D9",
          200: "#FFC9B3",
          300: "#FFAE8C",
          400: "#FF9366",
          500: "#FF6B35", // Secondary
          600: "#FF4A03",
          700: "#CC3A00",
          800: "#952A00",
          900: "#5E1A00",
          950: "#3F1200",
        },
        // Accent colors
        accent: {
          DEFAULT: "#4CAF50", // Green
          50: "#E8F5E9",
          100: "#C8E6C9",
          200: "#A5D6A7",
          300: "#81C784",
          400: "#66BB6A",
          500: "#4CAF50", // Accent
          600: "#43A047",
          700: "#388E3C",
          800: "#2E7D32",
          900: "#1B5E20",
          950: "#0A3D0A",
        },
        // Neutral colors
        neutral: {
          DEFAULT: "#6B7280",
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280", // Neutral
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
          950: "#030712",
        },
        // Background colors
        background: {
          DEFAULT: "#FFFFFF",
          secondary: "#F9FAFB",
          tertiary: "#F3F4F6",
        },
        // Text colors
        text: {
          DEFAULT: "#111827", // Dark gray
          secondary: "#4B5563", // Medium gray
          tertiary: "#9CA3AF", // Light gray
          inverted: "#FFFFFF", // White
        },
        // Error, warning, success, info colors
        error: {
          DEFAULT: "#DC2626",
          light: "#FEE2E2",
        },
        warning: {
          DEFAULT: "#FBBF24",
          light: "#FEF3C7",
        },
        success: {
          DEFAULT: "#10B981",
          light: "#D1FAE5",
        },
        info: {
          DEFAULT: "#3B82F6",
          light: "#DBEAFE",
        },
        // Transparent colors
        transparent: "transparent",
        current: "currentColor",
        // Extend with Tailwind's default colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      // Typography scale
      fontSize: {
        "xs": ["0.75rem", { lineHeight: "1rem" }],
        "sm": ["0.875rem", { lineHeight: "1.25rem" }],
        "base": ["1rem", { lineHeight: "1.5rem" }],
        "lg": ["1.125rem", { lineHeight: "1.75rem" }],
        "xl": ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
      },
      // Spacing scale (based on 8px grid)
      spacing: {
        "0": "0",
        "1": "0.25rem", // 4px
        "2": "0.5rem",  // 8px
        "3": "0.75rem", // 12px
        "4": "1rem",    // 16px
        "5": "1.25rem", // 20px
        "6": "1.5rem",  // 24px
        "7": "1.75rem", // 28px
        "8": "2rem",    // 32px
        "9": "2.25rem", // 36px
        "10": "2.5rem", // 40px
        "11": "2.75rem", // 44px
        "12": "3rem",   // 48px
        "14": "3.5rem", // 56px
        "16": "4rem",   // 64px
        "20": "5rem",   // 80px
        "24": "6rem",   // 96px
        "28": "7rem",   // 112px
        "32": "8rem",   // 128px
        "36": "9rem",   // 144px
        "40": "10rem",  // 160px
        "44": "11rem",  // 176px
        "48": "12rem",  // 192px
        "52": "13rem",  // 208px
        "56": "14rem",  // 224px
        "60": "15rem",  // 240px
        "64": "16rem",  // 256px
        "72": "18rem",  // 288px
        "80": "20rem",  // 320px
        "96": "24rem",  // 384px
      },
      // Border radius
      borderRadius: {
        "none": "0",
        "sm": "0.125rem",    // 2px
        DEFAULT: "0.25rem",  // 4px
        "md": "0.375rem",    // 6px
        "lg": "0.5rem",      // 8px
        "xl": "0.75rem",     // 12px
        "2xl": "1rem",       // 16px
        "3xl": "1.5rem",     // 24px
        "full": "9999px",
      },
      // Box shadows
      boxShadow: {
        "sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        "md": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "lg": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        "xl": "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        "inner": "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
        "none": "none",
      },
      // Animation
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
