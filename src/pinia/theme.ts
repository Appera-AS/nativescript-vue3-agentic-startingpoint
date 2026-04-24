import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { persistentRef } from "../utils/persistence";
import { Frame, Utils, isAndroid, isIOS } from "@nativescript/core";

export const useTheme = defineStore("theme", () => {
  const _manualDarkMode = persistentRef("theme.manualDarkMode", false);
  const _systemDarkMode = ref(false);
  const _useManualDarkMode = persistentRef("theme.useManualDarkMode", false);

  const color = computed(() => {
    const isLightMode = !isDarkMode.value;
    const c = {
      white: "#fff",
      almostWhite: "#eee",
      gray: "#4a4a4a",
      almostBlack: "#222",
      black: "#111",
      yellow: "#ffbd00",
      lightYellow: "#FFE699",
      lighterYellow: "#FFF7DD",
      darkYellow: "#8E6500",
      green: "#07d132",
      lightGreen: "#8CE3A0",
      lighterGreen: "#D9F6E0",
      red: "#db002a",
      lightRed: "#F3BABF",
      lighterRed: "#FBE8EA",
      blue: "#0070ff",
      lightBlue: "#CCE5FF",
      lighterBlue: "#EEF7FF",
    };

    return {
      // White
      white: c.white,
      white_almostWhite: isLightMode ? c.white : c.almostWhite,
      white_gray: isLightMode ? c.white : c.gray,
      white_almostBlack: isLightMode ? c.white : c.almostBlack,
      white_black: isLightMode ? c.white : c.black,

      // Almost white
      almostWhite_almostBlack: isLightMode ? c.almostWhite : c.almostBlack,
      almostWhite_black: isLightMode ? c.almostWhite : c.black,
      almostWhite_gray: isLightMode ? c.almostWhite : c.gray,

      // Gray
      gray_white: isLightMode ? c.gray : c.white,
      gray_almostWhite: isLightMode ? c.gray : c.almostWhite,
      gray: isLightMode ? c.gray : c.gray,
      gray_black: isLightMode ? c.gray : c.black,

      // Almost black
      almostBlack_almostWhite: isLightMode ? c.almostBlack : c.almostWhite,

      // Black
      black_white: isLightMode ? c.black : c.white,
      black: c.black,

      // Colors
      almostBlack: c.almostBlack,
      darkYellow: c.darkYellow,

      yellow: c.yellow,
      lightYellow: c.lightYellow,
      lighterYellow: c.lighterYellow,

      green: c.green,
      lightGreen: c.lightGreen,
      lighterGreen: c.lighterGreen,

      red: c.red,
      red_white: isLightMode ? c.red : c.white,
      lightRed: c.lightRed,
      lighterRed: c.lighterRed,
      red_green: isLightMode ? c.red : c.green,

      blue: c.blue,
      lightBlue: c.lightBlue,
      lighterBlue: c.lighterBlue,
    };
  });

  const borderRadius = computed(() => {
    return 20;
  });

  const isDarkMode = computed(() => {
    return _useManualDarkMode.value ? _manualDarkMode.value : _systemDarkMode.value;
  });

  function setSystemDarkMode() {
    if (isIOS) {
      const frame = Frame.topmost();
      if (frame && frame.viewController) {
        _systemDarkMode.value = frame.viewController.traitCollection.userInterfaceStyle === 2;
        return;
      }
    }
    if (isAndroid) {
      const context = Utils.android.getApplicationContext();
      if (context) {
        const uiModeManager = android.content.Context.UI_MODE_SERVICE;
        _systemDarkMode.value = android.app.UiModeManager.MODE_NIGHT_YES === context.getSystemService(uiModeManager).getNightMode();
        return;
      }
    }
    _systemDarkMode.value = false;
  }

  function setDarkMode(value: boolean) {
    _manualDarkMode.value = value;
    _useManualDarkMode.value = true;
  }

  function refreshDarkMode() {
    const oldSystemDarkMode = _systemDarkMode.value;
    setSystemDarkMode();
    if (oldSystemDarkMode !== _systemDarkMode.value) {
      _useManualDarkMode.value = false;
    }
    if (!_useManualDarkMode.value) {
      _manualDarkMode.value = _systemDarkMode.value;
    }

    if (isIOS) {
      // @ts-ignore
      const iqKeyboard = IQKeyboardManager.sharedManager();
      iqKeyboard.overrideKeyboardAppearance = true;
      iqKeyboard.keyboardAppearance = isDarkMode.value ? UIKeyboardAppearance.Dark : UIKeyboardAppearance.Light;
    }
  }

  return {
    isDarkMode,
    setDarkMode,
    refreshDarkMode,
    color,
    borderRadius,
  };
});
