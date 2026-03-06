import { useEffect } from "react";
import { useWebHaptics } from "web-haptics/react";

const DEFAULT_HAPTIC = "medium";
const MODAL_HAPTIC = "selection";

export function HapticsOnTap() {
	const { trigger, isSupported } = useWebHaptics();

	useEffect(() => {
		const handleClick = (event: MouseEvent) => {
			if (!(event.target instanceof Element) || event.defaultPrevented) {
				return;
			}

			const interactiveElement = event.target.closest(
				"button, a[href], [role='button'], [data-haptic]"
			);

			if (!interactiveElement) {
				return;
			}

			if (
				interactiveElement instanceof HTMLButtonElement &&
				interactiveElement.disabled
			) {
				return;
			}

			if (interactiveElement.getAttribute("aria-disabled") === "true") {
				return;
			}

			if (
				interactiveElement instanceof HTMLAnchorElement &&
				interactiveElement.getAttribute("aria-disabled") === "true"
			) {
				return;
			}

			const haptic = interactiveElement.getAttribute("data-haptic");
			if (haptic === "off") {
				return;
			}

			const isInsideModal = Boolean(
				interactiveElement.closest("[data-slot='dialog-content'], [role='dialog']")
			);
			const resolvedHaptic = haptic || (isInsideModal ? MODAL_HAPTIC : DEFAULT_HAPTIC);

			// Always trigger so web-haptics can use its own fallback behavior on unsupported browsers.
			trigger(resolvedHaptic);

			if (isSupported) {
				return;
			}

			// iOS Safari does not support navigator.vibrate; apply a tiny visual pulse fallback.
			interactiveElement.classList.add("haptic-fallback-tap");
			window.setTimeout(() => {
				interactiveElement.classList.remove("haptic-fallback-tap");
			}, 140);
		};

		document.addEventListener("click", handleClick);
		return () => document.removeEventListener("click", handleClick);
	}, [isSupported, trigger]);

	return null;
}
