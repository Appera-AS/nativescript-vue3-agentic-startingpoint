<template>
  <Label
    :text="name"
    :class="{
      'x-icon': !rounded,
      'x-icon-round': rounded,
    }"
    :color="computedColor"
    :fontSize="$.useSettings().fontSize(fontSize)"
    @tap="$emit('tap', $event)"
  />
</template>

<script lang="ts" setup>
import $ from "@/utils";
import { computed } from "nativescript-vue";

defineEmits(["tap"]);

const props = defineProps({
  name: { type: String, default: "" },
  rounded: { type: Boolean, default: false },
  fontSize: { type: Number, default: 25 },
  color: { type: String, default: "" },
});

const computedColor = computed(() => {
  if (props.color) return props.color;
  return $.useTheme().color.black_white;
});
</script>
