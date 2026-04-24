import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useDrawer = defineStore("drawer", () => {
  const _isOpen = ref(false);

  const isOpen = computed(() => _isOpen.value);

  function open() {
    _isOpen.value = true;
  }
  function close() {
    _isOpen.value = false;
  }
  function toggle() {
    _isOpen.value = !_isOpen.value;
  }

  return {
    isOpen,
    open,
    close,
    toggle,
  };
});
