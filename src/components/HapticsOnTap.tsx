import { useEffect } from "react";
import { useWebHaptics } from "web-haptics/react";

export function HapticsOnTap() {
	const { trigger, isSupported } = useWebHaptics();

	useEffect(() => {
		const handleClick = (event: MouseEvent) => {
			if (!(event.target instanceof Element) || event.defaultPrevented) {
				return;
			}

			const interactiveElement = event.target.closest("[data-haptic]");

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

			const haptic = interactiveElement.getAttribute("data-haptic");
			if (!haptic || haptic === "off") {
				return;
			}

			// Always trigger so web-haptics can use its own fallback behavior on unsupported browsers.
			trigger(haptic);

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
