
import page from "./page";
import sheet from "./sheet";
import debug from "./debug";
import { http } from "./http";
import { debounce, throttle } from "./debounce-throttle";
import { haptic } from "./haptic";
import { useInternationalization } from "@/pinia/internationalization";
import { useSettings } from "@/pinia/settings";
import { useTheme } from "@/pinia/theme";
import { useSheet } from "@/pinia/sheet";
import { useDebug } from "@/pinia/debug";
import { useDrawer } from "@/pinia/drawer";
import { refreshSystemBars } from "./statusBar";

export default {
	i: function (key: string) {
		return useInternationalization().$i(key);
	},
	useSettings: function () {
		return useSettings();
	},
	useTheme: function () {
		return useTheme();
	},
	useSheet: function () {
		return useSheet();
	},
	useDebug: function () {
		return useDebug();
	},
	useDrawer: function () {
		return useDrawer();
	},
	page,
	sheet,
	http,
	debug,
	debounce,
	throttle,
	haptic,
	refreshSystemBars,
};
