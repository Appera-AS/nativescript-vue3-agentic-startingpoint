import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useSheet = defineStore("sheet", () => {
  // Internal refs
  const _isClosed = ref(false);
  const _showBackButton = ref(false);
  const _showCloseButton = ref(false);
  const _heading = ref("");
  const _history = ref<string[]>([]);

  // Computed properties
  const isClosed = computed(() => _isClosed.value);
  const showBackButton = computed(() => _showBackButton.value);
  const showCloseButton = computed(() => _showCloseButton.value);
  const heading = computed(() => _heading.value);
  const history = computed(() => _history.value);

  function setClosed(closed: boolean) {
    _isClosed.value = closed;
  }

  function setShowBackButton(show: boolean) {
    _showBackButton.value = show;
  }

  function setShowCloseButton(show: boolean) {
    _showCloseButton.value = show;
  }

  function setHeading(newHeading: string) {
    _heading.value = newHeading;
  }

  function clearHistory() {
    _history.value = [];
    setShowBackButton(false);
  }

  function addToHistory(name: string) {
    _history.value.push(name);
    setShowBackButton(_history.value.length > 1);
  }

  function removeLastFromHistory() {
    _history.value.pop();
    setShowBackButton(_history.value.length > 1);
  }

  return {
    isClosed,
    showBackButton,
    showCloseButton,
    heading,
    history,
    setClosed,
    setShowBackButton,
    setShowCloseButton,
    setHeading,
    clearHistory,
    addToHistory,
    removeLastFromHistory,
  };
});
