import { toast as sonnerToast } from "sonner";
import { triggerSuccessHaptic, triggerWarningHaptic } from "@/lib/haptics";

const toastWithHaptics = Object.assign(
	(...args: Parameters<typeof sonnerToast>) => sonnerToast(...args),
	sonnerToast,
	{
		success: (...args: Parameters<typeof sonnerToast.success>) => {
			triggerSuccessHaptic();
			return sonnerToast.success(...args);
		},
		error: (...args: Parameters<typeof sonnerToast.error>) => {
			triggerWarningHaptic();
			return sonnerToast.error(...args);
		},
	}
);

export { toastWithHaptics as toast };
