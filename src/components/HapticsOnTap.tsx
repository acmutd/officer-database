import { useEffect } from "react";
import { useWebHaptics } from "web-haptics/react";

export function HapticsOnTap() {
	const { trigger, isSupported } = useWebHaptics();

	useEffect(() => {
		if (!isSupported) {
			return;
		}

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

			trigger(haptic);
		};

		document.addEventListener("click", handleClick);
		return () => document.removeEventListener("click", handleClick);
	}, [isSupported, trigger]);

	return null;
}
