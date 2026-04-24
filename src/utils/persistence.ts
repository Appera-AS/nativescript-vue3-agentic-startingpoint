
import { ApplicationSettings } from "@nativescript/core";
import { ref, Ref, watch, UnwrapRef } from "vue";

const persistence = {
  clearAll(): void {
    const keys = ApplicationSettings.getAllKeys();
    keys.forEach((key) => ApplicationSettings.remove(key));
  },
  getAll(): Array<string> {
    return ApplicationSettings.getAllKeys();
  },
  exists(key: string): boolean {
    return !!key && ApplicationSettings.hasKey(key);
  },
  get<T>(key: string, fallback: T): T {
    if (ApplicationSettings.hasKey(key)) {
      const value = ApplicationSettings.getString(key);
      return JSON.parse(value) as T;
    } else {
      return JSON.parse(JSON.stringify(fallback));
    }
  },
  set(key: string, value: any): void {
    if (value === undefined) {
      ApplicationSettings.remove(key);
    } else {
      ApplicationSettings.setString(key, JSON.stringify(value));
    }
  },
  delete(key: string): void {
    ApplicationSettings.remove(key);
  },
};

export function persistentRef<T>(key: string, initialValue: T): Ref<UnwrapRef<T>> {
  const storedValue = persistence.get<T>(key, initialValue);
  const value = ref<T>(storedValue) as Ref<UnwrapRef<T>>;
  watch(
    value,
    (newValue) => {
      persistence.set(key, newValue);
    },
    { deep: true }
  );
  return value;
}

export { persistence };
