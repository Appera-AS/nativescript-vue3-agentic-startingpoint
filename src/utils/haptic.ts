import { Haptics, HapticImpactType, HapticNotificationType } from "@nativescript/haptics";
import { useSettings } from "@/pinia/settings";

export const haptic = function (type: string): void {
  if (!useSettings().hapticsEnabled) return;

  if (type === "button") {
    Haptics.selection();
  }

  if (type === "pillswitch") {
    Haptics.notification(HapticNotificationType.SUCCESS);
  }

  if (type === "crash") {
    Haptics.impact(HapticImpactType.HEAVY);
  }
};
