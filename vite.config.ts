import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const config = defineConfig({
	resolve: { tsconfigPaths: true },
	plugins: [
		devtools({
			// piping echoes one console.error between the browser and the terminal without end
			consolePiping: { enabled: false },
		}),
		tailwindcss(),
		tanstackStart({ srcDirectory: "src/app" }),
		viteReact(),
		babel({ presets: [reactCompilerPreset()] }),
	],
});

export default config;
