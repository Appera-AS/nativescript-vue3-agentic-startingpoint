import { Application, Frame } from "@nativescript/core";
import $ from "@/utils";

export const setupApplicationEvents = () => {
  Application.on(Application.resumeEvent, () => {
    $.debug.log("✅ Resume event called");
    $.useTheme().refreshDarkMode();
    $.refreshSystemBars();
  });

  Application.on(Application.launchEvent, () => {
    $.refreshSystemBars();
  });

  if (Application.android) {
    Application.android.on(
      Application.android.activityBackPressedEvent,
      (data: any) => {
        const navigationHistory = Frame.topmost()?.backStack || [];
        if (navigationHistory.length === 0) {
          data.cancel = true;
        }
      }
    );
  }

  if (Application.ios) {
    // @ts-ignore
    const iqKeyboard = IQKeyboardManager.sharedManager();
    if (iqKeyboard) {
      iqKeyboard.toolbarDoneBarButtonItemText = $.i("general_close");
    }
  }
};
