<template>
  <ScrollView
    ref="scrollView"
    @scroll="$emit('scroll', $event)"
    @pan="$emit('pan', $event)"
    @loaded="$emit('loaded', $event)"
    :scrollBarIndicatorVisible="scrollBarIndicatorVisible"
    :orientation="orientation"
    height="100%"
  >
    <slot />
  </ScrollView>
</template>

<script lang="ts" setup>
import $ from "@/utils";
import { watch, ref, nextTick } from "nativescript-vue";
import { type ScrollView, Screen, isAndroid, isIOS } from "@nativescript/core";

const scrollView = ref<ScrollView>();

const props = defineProps({
  inverseStart: { type: Boolean, default: false },
  scrollBarIndicatorVisible: { type: Boolean, default: true },
  orientation: { type: String as () => "horizontal" | "vertical", default: "vertical" },
  contentHeight: { type: Number, default: 0 },
});

// watch contentHeight
watch(
  () => props.contentHeight,
  (newVal) => {
    if (!props.inverseStart) return;
    nextTick(() => {
      const scrollViewHeight = scrollView.value?.nativeView?.getMeasuredHeight();
      const offset = newVal - scrollViewHeight;
      scrollView.value?.nativeView?.scrollToVerticalOffset(Math.round(offset / Screen.mainScreen.scale), false);
    });
  }
);

// Globally disable scroll if you want to drag elements inside the scrollview
watch(
  () => $.useSettings().scrollDisabled,
  (newVal) => {
    if (!scrollView.value) return;
    if (isAndroid && scrollView.value.android) {
      scrollView.value.android.setScrollEnabled(!newVal);
    } else if (isIOS && scrollView.value.ios) {
      (scrollView.value.ios as UIScrollView).scrollEnabled = !newVal;
    }
  }
);
</script>
