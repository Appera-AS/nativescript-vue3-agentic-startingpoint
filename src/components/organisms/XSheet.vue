<template>
  <GridLayout rows="70, *">
    <GridLayout
      width="100%"
      columns="*"
      rows="auto"
    >
      <XLabel
        v-if="$.useSheet().heading"
        :text="$.useSheet().heading"
        horizontalAlignment="center"
        verticalAlignment="center"
        marginTop="15"
      />
    </GridLayout>
    <GridLayout
      row="1"
      borderRadius="20"
      paddingTop="10"
      marginTop="-12"
      rows="auto,*"
      iosOverflowSafeArea="false"
    >
      <GridLayout
        v-if="$.useSheet().showBackButton"
        @tap="onBack"
        marginTop="-2"
        marginLeft="3"
        width="44"
        height="44"
        horizontalAlignment="left"
      >
        <XIcon name="chevron-left" />
      </GridLayout>
      <GridLayout
        v-if="$.useSheet().showCloseButton"
        @tap="onClose"
        marginTop="-2"
        marginRight="3"
        width="44"
        height="44"
        horizontalAlignment="right"
      >
        <XIcon name="close" />
      </GridLayout>

      <StackLayout
        row="1"
        height="auto"
      >
        <slot></slot>
      </StackLayout>
    </GridLayout>
  </GridLayout>
</template>

<script lang="ts" setup>
import $ from "@/utils";
import { onMounted } from "nativescript-vue";

onMounted(() => {
  $.useTheme().refreshDarkMode();
});

function onBack() {
  $.sheet.back();
}

function onClose() {
  $.sheet.close();
}
</script>
