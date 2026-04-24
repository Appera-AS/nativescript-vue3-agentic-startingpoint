import { debounce } from "./debounce-throttle";
import { $navigateTo } from "nativescript-vue";
import { routes } from "../router/routes";

const goTo = debounce(function (pageName: string, params?: any) {
  if (!pageName || !routes[pageName]) {
    console.error(`Failed to navigate. Missing ${pageName} in routes.ts`);
    return;
  }
  const isLoggedIn = true; // TODO: check if user is logged in
  if (!routes[pageName].requiresAuth || isLoggedIn) {
    $navigateTo(routes[pageName].component, params);
  } else {
    // $openModal("LoginModal", { props: { nextRoute: pageName } });
  }
}, 500, { isImmediate: true });

const goBackTo = debounce(function (pageName: string, params?: any) {
  if (!params) params = {};
  params.transition = { name: "slideRight" };
  goTo(pageName, params);
}, 500, { isImmediate: true });

export default { goTo, goBackTo };
