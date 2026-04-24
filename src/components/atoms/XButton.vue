<template>
  <Button
    ref="buttonRef"
    :padding="0"
    :margin="0"
    :text="computedText"
    :color="computedColor"
    :fontSize="$.useSettings().fontSize(fontSize)"
    @touch="onTouch"
  />
</template>

<script lang="ts" setup>
import $ from "@/utils";
import { computed, ref } from "nativescript-vue";
import { CoreTypes, TouchGestureEventData } from "@nativescript/core";

const props = defineProps({
  i: { type: String, default: "" },
  text: { type: String, default: "" },
  fontSize: { type: Number, default: 25 },
  color: { type: String, default: "" },
});

const buttonRef = ref();

const computedColor = computed(() => {
  if (props.color) {
    return props.color;
  }
  return $.useTheme().color.black_white;
});

const computedText = computed(() => {
  if (props.i) return $.i(props.i);
  return props.text;
});

function onTouch(args: TouchGestureEventData) {
  const view = buttonRef.value?.nativeView;
  if (!view) return;
  if (args.action === "down") {
    view.animate({
      scale: { x: 0.95, y: 0.95 },
      duration: 50,
      curve: CoreTypes.AnimationCurve.easeInOut,
    });
  } else if (args.action === "up" || args.action === "cancel") {
    view.animate({
      scale: { x: 1, y: 1 },
      duration: 50,
      curve: CoreTypes.AnimationCurve.easeInOut,
    });
  }
}
</script>
