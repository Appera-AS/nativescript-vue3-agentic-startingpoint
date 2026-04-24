import { createApp, registerElement } from "nativescript-vue";
import { createPinia } from "pinia";
import CollectionView from '@nativescript-community/ui-collectionview/vue3';
import DrawerPlugin from "@nativescript-community/ui-drawer/vue3";
import LottieView from "@nativescript-community/ui-lottie/vue";
import { SVGView } from "@nativescript-community/ui-svg";
import { initialize as initializeImage } from "@nativescript-community/ui-image";
import App from "./components/App.vue";
import XPage from "./components/organisms/XPage.vue";
import XLabel from "./components/atoms/XLabel.vue";
import XIcon from "./components/atoms/XIcon.vue";
import XButton from "./components/atoms/XButton.vue";
import XScrollView from "./components/atoms/XScrollView.vue";
import { boot } from "./boot";

initializeImage({ isDownsampleEnabled: true });
registerElement("Img", () => require("@nativescript-community/ui-image").Img);
registerElement("SVGView", () => SVGView);
registerElement("PullToRefresh", () => require("@nativescript-community/ui-pulltorefresh").PullToRefresh);

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(LottieView);
app.use(DrawerPlugin);
app.use(CollectionView);

app.component("XPage", XPage);
app.component("XIcon", XIcon);
app.component("XLabel", XLabel);
app.component("XButton", XButton);
app.component("XScrollView", XScrollView);

app.config.errorHandler = (err, instance, info) => {
  console.error((info ? `⛔️ Error during execution of ${info}: ` : `⛔️ `) + err);
};

boot();
app.start();