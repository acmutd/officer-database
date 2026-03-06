import { WebHaptics, type HapticInput } from "web-haptics";

let hapticsInstance: WebHaptics | null = null;

function getHapticsInstance() {
	if (typeof window === "undefined") {
		return null;
	}

	if (!hapticsInstance) {
		hapticsInstance = new WebHaptics();
	}

	return hapticsInstance;
}

export function triggerHaptic(input: HapticInput) {
	try {
		void getHapticsInstance()?.trigger(input);
	} catch {
		// Haptics should never block UX flows.
	}
}

export function triggerSuccessHaptic() {
	triggerHaptic("success");
}

export function triggerWarningHaptic() {
	triggerHaptic("warning");
}
