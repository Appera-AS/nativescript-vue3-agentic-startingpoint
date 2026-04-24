<template>
  <TextView
    v-if="selectable"
    editable="false"
    backgroundColor="transparent"
    :text="computedText"
    :textWrap="textWrap"
    :fontSize="$.useSettings().fontSize(fontSize)"
    :color="computedColor"
    @loaded="makeSelectable"
    :padding="0"
    :margin="0"
  />
  <Label
    v-else
    :text="computedText"
    :textWrap="textWrap"
    :fontSize="$.useSettings().fontSize(fontSize)"
    :color="computedColor"
    :padding="0"
    :margin="0"
  />
</template>

<script lang="ts" setup>
import $ from "@/utils";
import { isAndroid, isIOS } from "@nativescript/core";
import { computed } from "nativescript-vue";

const props = defineProps({
  i: { type: String, default: "" },
  text: { type: String, default: "" },
  textWrap: { type: Boolean, default: false },
  fontSize: { type: Number, default: 16 },
  color: { type: String, default: "" },
  selectable: { type: Boolean, default: false },
});

const computedText = computed(() => {
  if (props.i) return $.i(props.i);
  return props.text;
});

const computedColor = computed(() => {
  if (props.color) {
    return props.color;
  }
  return $.useTheme().color.black_white;
});

const makeSelectable = (args: any) => {
  const nativeView = args?.object?.nativeView;
  if (!nativeView) return;

  if (isAndroid) {
    nativeView.setTextIsSelectable(true);
  } else if (isIOS) {
    // @ts-ignore
    nativeView.textContainerInset = UIEdgeInsetsMake(0, -5, 0, -5);
  }
};
</script>
