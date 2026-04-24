<template>
  <GridLayout width="100%">
    <GridLayout
      :columns="side === 'left' ? '3*,*' : '*,3*'"
      :horizontalAlignment="side"
      :marginBottom="isLast ? '5' : '1'"
    >
      <XLabel
        :col="side === 'left' ? '0' : '1'"
        :background="side === 'right' ? $.useTheme().color.almostWhite_almostBlack : $.useTheme().color.almostBlack_almostWhite"
        :text="text"
        :borderRadius="borderRadius"
        :color="side === 'right' ? $.useTheme().color.black_white : $.useTheme().color.white_black"
        :textWrap="true"
        padding="10 20"
      />
    </GridLayout>
  </GridLayout>
</template>

<script lang="ts" setup>
import $ from "@/utils";
import { computed } from "nativescript-vue";

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  side: {
    type: String as () => "left" | "right",
    default: "right",
  },
  isLast: {
    type: Boolean,
    default: false,
  },
});

const borderRadius = computed(() => {
  if (props.isLast) {
    if (props.side === "right") {
      return `${$.useTheme().borderRadius} ${$.useTheme().borderRadius} 0 ${$.useTheme().borderRadius}`;
    } else {
      return `${$.useTheme().borderRadius} ${$.useTheme().borderRadius} ${$.useTheme().borderRadius} 0`;
    }
  }
  return $.useTheme().borderRadius;
});
</script>
