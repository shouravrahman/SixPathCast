import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1440px",
			},
		},
		extend: {
			fontFamily: {
				sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
				display: ["Sora", "ui-sans-serif", "system-ui", "sans-serif"],
			},
			colors: {
				border: "var(--border)",
				input: "var(--input)",
				ring: "var(--ring)",
				background: "var(--background)",
				foreground: "var(--foreground)",
				primary: {
					DEFAULT: "var(--primary)",
					foreground: "var(--primary-foreground)",
				},
				secondary: {
					DEFAULT: "var(--secondary)",
					foreground: "var(--secondary-foreground)",
				},
				destructive: {
					DEFAULT: "var(--destructive)",
					foreground: "var(--destructive-foreground)",
				},
				muted: {
					DEFAULT: "var(--muted)",
					foreground: "var(--muted-foreground)",
				},
				accent: {
					DEFAULT: "var(--accent)",
					foreground: "var(--accent-foreground)",
				},
				popover: {
					DEFAULT: "var(--popover)",
					foreground: "var(--popover-foreground)",
				},
				card: {
					DEFAULT: "var(--card)",
					foreground: "var(--card-foreground)",
				},
				chart: {
					"1": "var(--chart-1)",
					"2": "var(--chart-2)",
					"3": "var(--chart-3)",
					"4": "var(--chart-4)",
					"5": "var(--chart-5)",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			boxShadow: {
				glow: "0 0 0 3px var(--ring) / 0.35), 0 0 30px 0 #00B5FF33",
			},
			backgroundImage: {
				"brand-radial":
					"radial-gradient(1000px 600px at 50% -10%, theme(colors.primary.DEFAULT) 0%, transparent 60%)",
				"brand-gradient":
					"linear-gradient(90deg, theme(colors.primary.DEFAULT) 0%, theme(colors.secondary.DEFAULT) 100%)",
				"brand-vibrant":
					"linear-gradient(90deg, theme(colors.primary.DEFAULT), theme(colors.accent.DEFAULT)",
				"chart-gradient":
					"linear-gradient(135deg, var(--chart-1) 0%, var(--chart-2) 20%, var(--chart-3) 40%, var(--chart-4) 60%, var(--chart-5) 80%)",
			},
			keyframes: {
				"spin-slower": {
					"0%": {
						transform: "rotate(0deg)",
					},
					"100%": {
						transform: "rotate(360deg)",
					},
				},
				shimmer: {
					"0%": {
						backgroundPosition: "-700px 0",
					},
					"100%": {
						backgroundPosition: "700px 0",
					},
				},
			},
			animation: {
				"spin-slower": "spin 6s linear infinite",
				shimmer: "shimmer 1.8s infinite linear",
			},
		},
	},
	plugins: [
		require("tailwindcss-animate"),
		plugin(function ({ addUtilities }) {
			addUtilities({
				".bg-grid": {
					backgroundSize: "40px 40px",
					backgroundImage:
						"linear-gradient(to right, rgba(255,255,255,.06) 1px, transparent 1px),\
                        linear-gradient(to bottom, rgba(255,255,255,.06) 1px, transparent 1px)",
				},
			});
		}),
	],
};
export default config;
