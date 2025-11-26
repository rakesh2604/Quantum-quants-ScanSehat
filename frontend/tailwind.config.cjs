/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Medical Theme Colors (Exact Spec)
        medical: {
          blue: "#0C6CF2",
          teal: "#00A1A9",
        },
        primary: {
          DEFAULT: "#0C6CF2", // Medical Blue
          hover: "#0A5CD9",
          light: "#E6F2FF",
        },
        secondary: {
          DEFAULT: "#00A1A9", // Teal
          hover: "#008A91",
          light: "#E0F7F8",
        },
        success: {
          DEFAULT: "#00A1A9",
          light: "#E0F7F8",
        },
        background: {
          light: "#F5F8FA",
          dark: "#1E1E1E",
        },
        card: {
          white: "#FFFFFF",
          dark: "#2A2A2A",
        },
        text: {
          DEFAULT: "#0F172A",
          dark: "#0F172A",
          secondary: "#64748B",
          light: "#FFFFFF",
        },
        border: {
          light: "#E2E8F0",
          dark: "#3A3A3A",
        },
        // Legacy support
        "primary-dark": "#0A5CD9",
        "accent-purple": "#8B5CF6",
        "accent-fuchsia": "#F472B6",
        "dark-navy": "#071029",
        "night-sky": "#03091f",
        "light-shell": "#F5F8FA",
        ink: "#0F172A",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "Helvetica Neue", "sans-serif"],
      },
      fontSize: {
        title: ["24px", { lineHeight: "30px", fontWeight: "700" }],
        "title-lg": ["30px", { lineHeight: "36px", fontWeight: "700" }],
        "section-header": ["18px", { lineHeight: "24px", fontWeight: "600" }],
        "section-header-lg": ["20px", { lineHeight: "28px", fontWeight: "600" }],
        body: ["15px", { lineHeight: "24px", fontWeight: "400" }],
        "body-lg": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        label: ["13px", { lineHeight: "20px", fontWeight: "500" }],
        "label-lg": ["14px", { lineHeight: "20px", fontWeight: "500" }],
      },
      spacing: {
        4: "4px",
        8: "8px",
        12: "12px",
        16: "16px",
        20: "20px",
        24: "24px",
        32: "32px",
        40: "40px",
      },
      maxWidth: {
        container: "1280px",
      },
      boxShadow: {
        medical: "0 2px 12px rgba(0,0,0,0.06)",
        "medical-lg": "0 4px 16px rgba(0,0,0,0.08)",
        "card": "0 4px 24px rgba(0, 0, 0, 0.06)",
        glow: "0 20px 50px rgba(0, 229, 196, 0.35)",
        "neon-ring": "0 0 25px rgba(139, 92, 246, 0.5)",
        glass: "inset 0 1px 0 rgba(255,255,255,0.4)",
      },
      borderRadius: {
        "lg": "1rem",
        "xl": "1.5rem",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      animation: {
        pulseSlow: "pulse 6s ease-in-out infinite",
        floaty: "floaty 12s ease-in-out infinite",
        glow: "glow 4s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "fade-in": "fadeIn 0.5s ease-in",
        "slide-in": "slideIn 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
      },
      keyframes: {
        floaty: {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
          "100%": { transform: "translateY(0px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 10px rgba(0,229,196,0.4)" },
          "50%": { boxShadow: "0 0 30px rgba(139,92,246,0.6)" },
          "100%": { boxShadow: "0 0 10px rgba(0,229,196,0.4)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateX(-20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
};
