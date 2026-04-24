import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { persistentRef } from "../utils/persistence";

export const useSettings = defineStore("settings", () => {

  // Internal refs, do not export
  const _fontSizeScale = persistentRef("settings.fontSizeScale", 1);
  const _language = persistentRef("settings.language", "en");
  const _hapticsEnabled = persistentRef("settings.hapticsEnabled", true);
  const _scrollDisabled = ref(false);

  // Getters
  const fontSizeScale = computed(() => _fontSizeScale.value);
  const language = computed(() => _language.value);
  const hapticsEnabled = computed(() => _hapticsEnabled.value);
  const scrollDisabled = computed(() => _scrollDisabled.value);

  // Setters
  function setFontSizeScale(scale: number) {
    _fontSizeScale.value = scale;
  }
  function setLanguage(lang: string) {
    _language.value = lang;
  }
  function setHapticsEnabled(enabled: boolean) {
    _hapticsEnabled.value = enabled;
  }
  function fontSize(size: number) {
    return size * _fontSizeScale.value;
  }
  function setScrollDisabled(disabled: boolean) {
    _scrollDisabled.value = disabled;
  }

  return {
    fontSizeScale,
    scrollDisabled,
    hapticsEnabled,
    fontSize,
    language,
    setFontSizeScale,
    setHapticsEnabled,
    setLanguage,
    setScrollDisabled,
  };
});
