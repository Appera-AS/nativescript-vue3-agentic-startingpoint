import { Application, Color, isAndroid, isIOS } from "@nativescript/core";
import { useTheme } from "@/pinia/theme";

function refreshAndroidStatusBar() {
  if (!isAndroid) return;
  const activity = Application.android.foregroundActivity || Application.android.startActivity;
  if (!activity) return;

  const window = activity.getWindow();
  if (!window) return;

  const isDarkMode = useTheme().isDarkMode;
  const barColor = isDarkMode ? "#111111" : "#FFFFFF";

  window.setStatusBarColor(new Color(barColor).android);
  window.setNavigationBarColor(new Color(barColor).android);

  // @ts-ignore
  const controller = window.getInsetsController?.();
  if (controller) {
    // @ts-ignore
    const LIGHT_STATUS = android.view.WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS;
    // @ts-ignore
    const LIGHT_NAV = android.view.WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS;
    const mask = LIGHT_STATUS | LIGHT_NAV;
    // When NOT dark, we want light-background / dark-icons → set appearance
    // When dark, we want dark-background / light-icons → clear appearance
    controller.setSystemBarsAppearance(isDarkMode ? 0 : mask, mask);
  }
}

function refreshIOSStatusBar() {
  if (!isIOS) return;
  try {
    const isDarkMode = useTheme().isDarkMode;
    const style = isDarkMode
      // @ts-ignore
      ? UIStatusBarStyle.LightContent
      // @ts-ignore
      : UIStatusBarStyle.DarkContent;
    // @ts-ignore
    const app = UIApplication.sharedApplication;
    if (app) {
      app.setStatusBarStyleAnimated(style, true);
    }
  } catch {
    // swallow — iOS may not be ready yet
  }
}

export function refreshSystemBars() {
  refreshAndroidStatusBar();
  refreshIOSStatusBar();
}
