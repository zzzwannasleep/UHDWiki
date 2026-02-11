import DefaultTheme from "vitepress/theme";
import { useRoute } from "vitepress";
import { nextTick, onBeforeUnmount, onMounted, watch } from "vue";

import "./custom.css";
import { initSeasonalEffects } from "./seasonal";

import type { Zoom } from "medium-zoom";

const ZOOM_SELECTOR = ".vp-doc img:not(.no-zoom)";

let zoom: Zoom | undefined;
let stopSeasonalEffects: (() => void) | undefined;

async function initZoom() {
  if (typeof window === "undefined") return;

  if (!zoom) {
    const { default: mediumZoom } = await import("medium-zoom");
    zoom = mediumZoom({
      background: "var(--vp-c-bg)"
    });
  }

  zoom.detach();
  zoom.attach(ZOOM_SELECTOR);
}

export default {
  extends: DefaultTheme,
  setup() {
    const route = useRoute();

    onMounted(() => {
      void initZoom();
      if (!stopSeasonalEffects) stopSeasonalEffects = initSeasonalEffects();
    });

    watch(
      () => route.path,
      () => nextTick(() => void initZoom())
    );

    onBeforeUnmount(() => {
      stopSeasonalEffects?.();
      stopSeasonalEffects = undefined;
    });
  }
};
