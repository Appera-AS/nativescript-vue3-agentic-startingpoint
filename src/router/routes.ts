import { Component } from "vue";
import SettingsPage from "../components/pages/SettingsPage.vue";
import ChatPage from "../components/pages/ChatPage.vue";

const routes: Routes = {
  ChatPage: { component: ChatPage },
  SettingsPage: { component: SettingsPage },
};

interface RouteDefinition {
  component: Component;
  requiresAuth?: boolean;
}

type Routes = {
  [key: string]: RouteDefinition;
};

export { routes, RouteDefinition, Routes };
