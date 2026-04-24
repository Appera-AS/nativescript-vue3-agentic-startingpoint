import { defineStore } from "pinia";
import { ref } from "vue";
import { no, en } from "../translations";
import { useSettings } from "./settings";

type TranslationObject = typeof no & typeof en;
type TranslationKey = keyof TranslationObject;

export const useInternationalization = defineStore("internationalization", () => {
  const $s = useSettings();
  const translations = ref({ no, en });

  function $i(key: string): string {
    const language = $s.language;
    if (isValid(language)) {
      return translations.value[language][key as TranslationKey] || String(key);
    }
    return String(key);
  }

  function isValid(lang: unknown): lang is keyof typeof translations.value {
    return typeof lang === "string" && lang in translations.value;
  }

  return {
    $i,
  };
});
