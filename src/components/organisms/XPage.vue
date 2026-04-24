<template>
  <Page :actionBarHidden="true">
    <Drawer
      ref="drawer"
      :gestureHandlerOptions="{
        failOffsetYStart: -10,
        failOffsetYEnd: 10,
        activeOffsetXStart: -15,
        activeOffsetXEnd: 15,
      }"
      @close="onNativeClose"
    >
      <GridLayout
        ~leftDrawer
        rows="auto,*"
        class="drawer"
        width="80%"
        :backgroundColor="$.useTheme().color.almostWhite_almostBlack"
      >
        <StackLayout
          padding="20 20 10 20"
        >
          <XLabel
            i="drawer_title"
            :fontSize="22"
            :color="$.useTheme().color.black_white"
          />
        </StackLayout>

        <ScrollView row="1">
          <StackLayout padding="10 0">
            <GridLayout
              columns="auto,*"
              padding="14 20"
              @tap="goToPage('ChatPage')"
            >
              <XIcon
                name="chat"
                :fontSize="22"
              />
              <XLabel
                col="1"
                marginLeft="16"
                i="drawer_chat"
                :fontSize="18"
                verticalAlignment="center"
              />
            </GridLayout>

            <GridLayout
              columns="auto,*"
              padding="14 20"
              @tap="goToPage('SettingsPage')"
            >
              <XIcon
                name="settings"
                :fontSize="22"
              />
              <XLabel
                col="1"
                marginLeft="16"
                i="drawer_settings"
                :fontSize="18"
                verticalAlignment="center"
              />
            </GridLayout>
          </StackLayout>
        </ScrollView>
      </GridLayout>

      <StackLayout
        :backgroundColor="$.useTheme().color.white_black"
        ~mainContent
      >
        <slot />
      </StackLayout>
    </Drawer>
  </Page>
</template>
<script lang="ts" setup>
import $ from "@/utils";
import { ref, watch } from "nativescript-vue";

const drawer = ref(null);

watch(
  () => $.useDrawer().isOpen,
  (isOpen) => {
    // @ts-ignore
    const view = drawer.value?.nativeView;
    if (!view) return;
    if (isOpen) {
      view.open("left");
    } else {
      view.close();
    }
  }
);

function onNativeClose() {
  $.useDrawer().close();
}

function goToPage(pageName: string) {
  $.useDrawer().close();
  $.page.goTo(pageName);
}
</script>
