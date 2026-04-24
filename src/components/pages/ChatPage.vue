<template>
  <XPage>
    <StackLayout>
      <GridLayout
        rows="auto"
        columns="auto,*,auto"
        padding="10"
      >
        <XIcon
          name="menu"
          padding="10"
          @tap="$.useDrawer().toggle()"
        />
        <XIcon
          col="2"
          padding="10"
          :name="$.useTheme().isDarkMode ? 'dark_mode' : 'light_mode'"
          @tap="$.useTheme().setDarkMode(!$.useTheme().isDarkMode)"
        />
      </GridLayout>

      <XScrollView
        ref="scrollView"
        @scroll="onScroll"
      >
        <GridLayout
          height="100%"
          rows="*,auto,1"
          marginLeft="10"
          marginRight="10"
        >
          <CollectionView
            ref="chatView"
            :items="messages"
            width="100%"
            @scroll="throttledOnChatScroll"
            @loaded="chatViewLoaded"
          >
            <template #default="{ item, index }: { item: ChatMessage, index: number }">
              <XChatMessage
                :text="item.text"
                :side="item.side"
                :isLast="item.isLast"
              />
            </template>
          </CollectionView>
          <XIcon
            borderWidth="1"
            :borderColor="$.useTheme().color.black_white"
            ref="scrollToBottomButton"
            borderRadius="50"
            textAlignment="center"
            margin="20"
            name="keyboard_arrow_down"
            verticalAlignment="bottom"
            horizontalAlignment="right"
            :background="$.useTheme().color.almostWhite_almostBlack"
            :color="$.useTheme().color.black_white"
            width="35"
            height="35"
            opacity="0"
            @tap="scrollToBottom()"
          />
          <TextView
            @focus="onFocus"
            padding="10 5"
            verticalAlignment="bottom"
            marginTop="10"
            row="1"
            @textChange="newMessage = $event.value"
            :text="newMessage"
            :hint="$.i('general_writeAMessage')"
            :background="$.useTheme().color.almostWhite_almostBlack"
            :borderRadius="$.useTheme().borderRadius"
            :color="$.useTheme().color.black_white"
          />
          <XIcon
            v-if="newMessage"
            @tap="sendMessage"
            name="send"
            verticalAlignment="bottom"
            horizontalAlignment="right"
            marginRight="20"
            marginBottom="7"
            :fontSize="20"
            :color="$.useTheme().color.black_white"
            row="1"
          />
        </GridLayout>
      </XScrollView>
    </StackLayout>
  </XPage>
</template>
<script lang="ts" setup>
import $ from "@/utils";
import { ChatMessage } from "@/../types/interfaces";
import { ref, onMounted, onBeforeMount } from "nativescript-vue";
import { refView } from "@nativescript-use/vue";
import { isAndroid, isIOS, type View, ObservableArray, Frame, ScrollView } from "@nativescript/core";
import { SnapPosition, type CollectionView } from "@nativescript-community/ui-collectionview";
import XChatMessage from "@/components/atoms/XChatMessage.vue";

const isFirstRender = ref(true);
const isOpeningKeyboard = ref(false);
const scrollToBottomButton = refView<View>();
const newMessage = ref("");

const chatView = refView<CollectionView>();
const scrollView = refView<ScrollView>();
const messages = ref(new ObservableArray<ChatMessage>([]));

function scrollToBottom() {
  if (chatView.value) {
    chatView.value.scrollToIndex(messages.value.length - 1, !isFirstRender.value, SnapPosition.END);
  }
}

function checkScrollToBottom() {
  if (!scrollToBottomButton.value || isFirstRender.value) return;
  const showButton = messages.value.length > 2 && !chatView.value.isItemAtIndexVisible(messages.value.length - 2);
  scrollToBottomButton.value?.animate({
    opacity: showButton ? 1 : 0,
  });
}
const throttledOnChatScroll = $.throttle((args: { object: CollectionView; scrollOffset: number; plushViewToMove?: [] }) => {
  checkScrollToBottom();
}, 100);

function sendMessage() {
  if (!newMessage.value) return;
  messages.value.push({
    text: newMessage.value.trim(),
    side: "right",
    isLast: true,
  });
  newMessage.value = "";
  setTimeout(() => {
    scrollToBottom();
  }, 100);
}

function chatViewLoaded() {
  if (isAndroid && chatView.value) {
    chatView.value.nativeView.setItemAnimator(null);
  }
}

const seedMessages: { text: string; side: "left" | "right" }[] = [
  { text: "Hi! 👋 This is the NativeScript Vue 3 boilerplate. Ask me anything about how it works.", side: "left" },
  { text: "What's included out of the box?", side: "right" },
  { text: "Vue 3 + NativeScript, Pinia stores, routing, an HTTP service, i18n, SVG icons, dark mode, haptics, sheets, and this chat UI.", side: "left" },
  { text: "How do I access utilities inside a component?", side: "right" },
  { text: "Just import $ from '@/utils'. Pinia stores, i18n, theme, http and page navigation all hang off that single $ object.", side: "left" },
  { text: "How do I navigate between pages?", side: "right" },
  { text: "Call $.page.goTo('ChatPage'). Pages live in src/components/pages and the helper handles the Frame transition for you.", side: "left" },
  { text: "How does dark mode work?", side: "right" },
  { text: "Use $.useTheme() to read or toggle it, e.g. $.useTheme().setDarkMode(true). Colors are named like 'black_white' so they flip automatically.", side: "left" },
  { text: "What about translations?", side: "right" },
  { text: "Add keys to src/translations/en.ts and no.ts, then use $.i('your_key') in templates — the message hint below uses exactly that.", side: "left" },
  { text: "Where do components live?", side: "right" },
  { text: "src/components/atoms for small reusable bits (XButton, XIcon, XChatMessage…) and src/components/pages for full screens.", side: "left" },
  { text: "How do I rename the project for my own app?", side: "right" },
  { text: "Search & replace 'replaceme' across the repo and update the id in nativescript.config.ts. Then ns run ios / ns run android and you're off.", side: "left" },
];

onMounted(() => {
  for (const msg of seedMessages) {
    messages.value.push({
      text: msg.text,
      side: msg.side,
      isLast: true,
    });
  }
  setTimeout(() => {
    scrollToBottom();
    isFirstRender.value = false;
  }, 100);
});

function onScroll() {
  if (isIOS && !isOpeningKeyboard.value) {
    const page = Frame.topmost().currentPage;
    const pageViewIos = page.ios.view as UIView;

    scrollView.value.scrollToVerticalOffset(scrollView.value.scrollableHeight - pageViewIos.safeAreaInsets.bottom, false);
  }
}

function onFocus() {
  isOpeningKeyboard.value = true;
  setTimeout(() => {
    isOpeningKeyboard.value = false;
    scrollView.value.scrollToVerticalOffset(scrollView.value.scrollableHeight - 34, false);
  }, 100);
}

onBeforeMount(() => {
  if (isIOS) {
    // @ts-ignore
    const keyboard = IQKeyboardManager.sharedManager();
    if (keyboard) {
      keyboard.enableAutoToolbar = false;
      keyboard.shouldResignOnTouchOutside = true;
    }
  }
});
</script>
