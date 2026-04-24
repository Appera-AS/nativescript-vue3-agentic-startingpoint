import { defineStore } from "pinia";
import { computed } from "vue";
import { persistentRef } from "../utils/persistence";

export const useDebug = defineStore("debug", () => {
  const _enableDebug = persistentRef("debug.enableDebug", __DEV__);
  const _enableBootstrapLogs = persistentRef("debug.enableBootstrapLogs", false);
  const _enablePiniaLogs = persistentRef("debug.enablePiniaLogs", false);
  const _enableNetworkLogs = persistentRef("debug.enableNetworkLogs", false);

  const enableDebug = computed(() => _enableDebug.value);
  const enableBootstrapLogs = computed(() => _enableBootstrapLogs.value);
  const enablePiniaLogs = computed(() => _enablePiniaLogs.value);
  const enableNetworkLogs = computed(() => _enableNetworkLogs.value);

  function setEnableDebug(enabled: boolean) {
    _enableDebug.value = enabled;
  }
  function setEnableBootstrapLogs(enabled: boolean) {
    _enableBootstrapLogs.value = enabled;
  }
  function setEnablePiniaLogs(enabled: boolean) {
    _enablePiniaLogs.value = enabled;
  }
  function setEnableNetworkLogs(enabled: boolean) {
    _enableNetworkLogs.value = enabled;
  }

  return {
    enableDebug,
    enableBootstrapLogs,
    enablePiniaLogs,
    enableNetworkLogs,
    setEnableDebug,
    setEnableBootstrapLogs,
    setEnablePiniaLogs,
    setEnableNetworkLogs,
  };
});
