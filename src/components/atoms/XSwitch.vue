<template>
  <Switch
    :checked="value"
    :isEnabled="!disabled"
    :color="$.useTheme().color.white"
    :backgroundColor="$.useTheme().color.blue"
    @checkedChange="onChange"
  />
</template>

<script lang="ts" setup>
import $ from "@/utils";

const props = defineProps({
  value: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
});

const emit = defineEmits(["change"]);

function onChange(event: { value: boolean }) {
  if (event.value === props.value) return;
  $.haptic("pillswitch");
  emit("change", event.value);
}
</script>
