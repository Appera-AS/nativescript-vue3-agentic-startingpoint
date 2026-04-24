<template>
  <XPage>
    <GridLayout rows="auto,*">
      <GridLayout
        rows="auto"
        columns="auto,*"
        padding="10"
      >
        <XIcon
          name="menu"
          padding="10"
          @tap="$.useDrawer().toggle()"
        />
        <XLabel
          col="1"
          marginLeft="12"
          i="settings_title"
          :fontSize="22"
          verticalAlignment="center"
        />
      </GridLayout>

      <XScrollView row="1">
        <StackLayout padding="10 16 40 16">
          <!-- Appearance -->
          <XLabel
            i="settings_appearance"
            :fontSize="18"
            :color="$.useTheme().color.gray_almostWhite"
            marginTop="10"
            marginBottom="8"
          />
          <StackLayout
            :backgroundColor="$.useTheme().color.almostWhite_almostBlack"
            :borderRadius="$.useTheme().borderRadius"
            padding="16"
          >
            <GridLayout columns="*,auto">
              <XLabel
                i="settings_darkMode"
                :fontSize="16"
                verticalAlignment="center"
              />
              <XSwitch
                col="1"
                :value="$.useTheme().isDarkMode"
                @change="$.useTheme().setDarkMode($event)"
              />
            </GridLayout>
          </StackLayout>

          <!-- Language -->
          <XLabel
            i="settings_language"
            :fontSize="18"
            :color="$.useTheme().color.gray_almostWhite"
            marginTop="20"
            marginBottom="8"
          />
          <StackLayout
            :backgroundColor="$.useTheme().color.almostWhite_almostBlack"
            :borderRadius="$.useTheme().borderRadius"
            padding="16"
          >
            <GridLayout columns="*,*">
              <StackLayout
                v-for="(option, i) in languageOptions"
                :key="option.value"
                :col="i"
                margin="4"
                padding="14"
                :backgroundColor="$.useSettings().language === option.value ? $.useTheme().color.blue : $.useTheme().color.white_black"
                :borderRadius="$.useTheme().borderRadius"
                :borderWidth="1"
                :borderColor="$.useTheme().color.blue"
                @tap="$.useSettings().setLanguage(option.value)"
              >
                <XLabel
                  :text="option.label"
                  :fontSize="16"
                  horizontalAlignment="center"
                  :color="$.useSettings().language === option.value ? $.useTheme().color.black : $.useTheme().color.black_white"
                />
              </StackLayout>
            </GridLayout>
          </StackLayout>

          <!-- Debug logs -->
          <XLabel
            i="settings_debug"
            :fontSize="18"
            :color="$.useTheme().color.gray_almostWhite"
            marginTop="20"
            marginBottom="8"
          />
          <StackLayout
            :backgroundColor="$.useTheme().color.almostWhite_almostBlack"
            :borderRadius="$.useTheme().borderRadius"
            padding="16"
          >
            <GridLayout
              v-for="(toggle, i) in debugToggles"
              :key="toggle.key"
              columns="*,auto"
              :marginTop="i === 0 ? 0 : 12"
            >
              <XLabel
                :i="toggle.labelKey"
                :fontSize="16"
                verticalAlignment="center"
              />
              <XSwitch
                col="1"
                :value="toggle.value()"
                @change="toggle.set($event)"
              />
            </GridLayout>
          </StackLayout>

          <!-- Text -->
          <XLabel
            i="settings_text"
            :fontSize="18"
            :color="$.useTheme().color.gray_almostWhite"
            marginTop="20"
            marginBottom="8"
          />
          <StackLayout
            :backgroundColor="$.useTheme().color.almostWhite_almostBlack"
            :borderRadius="$.useTheme().borderRadius"
            padding="16"
          >
            <XLabel
              i="settings_fontSize"
              :fontSize="16"
              marginBottom="10"
            />
            <GridLayout columns="*,*,*">
              <StackLayout
                v-for="(step, i) in fontSteps"
                :key="step.value"
                :col="i"
                margin="4"
                padding="10"
                :backgroundColor="$.useSettings().fontSizeScale === step.value ? $.useTheme().color.blue : $.useTheme().color.white_black"
                :borderRadius="$.useTheme().borderRadius"
                :borderWidth="1"
                :borderColor="$.useTheme().color.blue"
                @tap="$.useSettings().setFontSizeScale(step.value)"
              >
                <XLabel
                  text="Aa"
                  :fontSize="step.previewSize"
                  horizontalAlignment="center"
                  :color="$.useSettings().fontSizeScale === step.value ? $.useTheme().color.black : $.useTheme().color.black_white"
                />
                <XLabel
                  :i="step.labelKey"
                  :fontSize="12"
                  horizontalAlignment="center"
                  marginTop="4"
                  :color="$.useSettings().fontSizeScale === step.value ? $.useTheme().color.black : $.useTheme().color.black_white"
                />
              </StackLayout>
            </GridLayout>
          </StackLayout>

          <!-- Icons -->
          <XLabel
            i="settings_icons"
            :fontSize="18"
            :color="$.useTheme().color.gray_almostWhite"
            marginTop="20"
            marginBottom="8"
          />
          <WrapLayout
            :backgroundColor="$.useTheme().color.almostWhite_almostBlack"
            :borderRadius="$.useTheme().borderRadius"
            padding="16"
          >
            <GridLayout
              margin="6"
              :width="iconBoxSize"
              :height="iconBoxSize"
            >
              <LottieView
                horizontalAlignment="center"
                verticalAlignment="center"
                :width="iconSize"
                :height="iconSize"
                key="~/assets/lottie/spinner_gray.json"
                src="~/assets/lottie/spinner_gray.json"
                :loop="true"
                :autoPlay="true"
              />
            </GridLayout>
            <GridLayout
              v-for="name in iconNames"
              :key="name"
              margin="6"
              :width="iconBoxSize"
              :height="iconBoxSize"
            >
              <XIcon
                horizontalAlignment="center"
                verticalAlignment="center"
                :name="name"
                :fontSize="iconFontSize"
              />
            </GridLayout>
          </WrapLayout>
        </StackLayout>
      </XScrollView>
    </GridLayout>
  </XPage>
</template>
<script lang="ts" setup>
import $ from "@/utils";
import { computed } from "nativescript-vue";
import XSwitch from "@/components/atoms/XSwitch.vue";

const iconFontSize = 28;
const iconSize = computed(() => $.useSettings().fontSize(iconFontSize));
const iconBoxSize = computed(() => iconSize.value + 16);

const iconNames = [
  "menu",
  "settings",
  "chat",
  "widgets",
  "close",
  "arrow_back",
  "send",
  "dark_mode",
  "light_mode",
  "keyboard_arrow_down",
];

const languageOptions = [
  { value: "en", label: "English" },
  { value: "no", label: "Norsk" },
];

const debugToggles = [
  {
    key: "enableDebug",
    labelKey: "settings_debug_enable",
    value: () => $.useDebug().enableDebug,
    set: (v: boolean) => $.useDebug().setEnableDebug(v),
  },
  {
    key: "enableBootstrapLogs",
    labelKey: "settings_debug_bootstrap",
    value: () => $.useDebug().enableBootstrapLogs,
    set: (v: boolean) => $.useDebug().setEnableBootstrapLogs(v),
  },
  {
    key: "enablePiniaLogs",
    labelKey: "settings_debug_pinia",
    value: () => $.useDebug().enablePiniaLogs,
    set: (v: boolean) => $.useDebug().setEnablePiniaLogs(v),
  },
  {
    key: "enableNetworkLogs",
    labelKey: "settings_debug_network",
    value: () => $.useDebug().enableNetworkLogs,
    set: (v: boolean) => $.useDebug().setEnableNetworkLogs(v),
  },
];

const fontSteps = [
  { value: 0.8, labelKey: "settings_fontSize_small", previewSize: 16 },
  { value: 1, labelKey: "settings_fontSize_normal", previewSize: 22 },
  { value: 1.2, labelKey: "settings_fontSize_large", previewSize: 28 },
];
</script>
