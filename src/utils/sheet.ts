import { debounce } from "./debounce-throttle";
import { getCurrentInstance } from "nativescript-vue";
import { useSheet } from "~/pinia/sheet";
import XSheet from "../components/organisms/XSheet.vue";

const getThis = () => getCurrentInstance()?.appContext.config.globalProperties;

const goTo = debounce(function (name: string, props?: any) {
  const _this = getThis();
  const sheet = useSheet();

  if (typeof name !== 'string') return;
  if (!_this) {
    console.error('Unable to access Vue instance');
    return;
  }
  props = props || {};

  useSheet().setClosed(false);

  if (sheet.history.length) {
    if (XSheet.components && name in XSheet.components) {
      _this.$navigateTo(XSheet.components[name], {
        frame: 'sheetFrame',
        props,
      });
    } else {
      console.error(`Component '${name}' not found in XSheet`);
    }
  } else {
    _this.$showModal(XSheet, {
      fullscreen: true,
      props: {
        sheetName: name,
        sheetProps: props
      }
    }).then(() => {
      if (props.closeCallback) props.closeCallback();
    });
  }
  if (props.clearHistory) sheet.clearHistory();
  sheet.addToHistory(name);
  _this.$submitAppEvent('SheetView', name);
}, 400, { isImmediate: true });

const back = debounce(function () {
  const _this = getThis();
  const sheet = useSheet();
  if (!_this) {
    console.error('Unable to access Vue instance');
    return;
  }
  _this.$navigateBack({ frame: 'sheetFrame' });
  sheet.removeLastFromHistory();
}, 400, { isImmediate: true });

const close = () => {
  const _this = getThis();
  const sheet = useSheet();

  if (!_this) {
    console.error('Unable to access Vue instance');
    return Promise.reject('Unable to access Vue instance');
  }

  useSheet().setClosed(true);

  return new Promise<void>((resolve) => {
    _this.$nextTick(() => {
      _this.$hapticFeedback('button');
      _this.$modal.close("close");
      sheet.clearHistory();
      setTimeout(resolve, 500);
    });
  });
};

export default { goTo, back, close };
