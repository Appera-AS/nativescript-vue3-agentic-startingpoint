<template>
  <Frame>
    <Page :actionBarHidden="true" />
  </Frame>
</template>
<script lang="ts" setup>
import { onMounted, nextTick, watch } from "nativescript-vue";
import $ from "@/utils";

onMounted(() => {
  nextTick(() => {
    $.page.goTo("ChatPage", {
      transition: { name: "fade" },
      clearHistory: true,
    });
    setTimeout(() => $.refreshSystemBars(), 100);
  });
});

watch(
  () => $.useTheme().isDarkMode,
  () => {
    $.refreshSystemBars();
  }
);
</script>
