import { logger } from "@vendetta";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { showToast } from "@vendetta/ui/toasts";

export default function log(...items: unknown[]) {
	const formatted = items
		.map((item) => {
			switch (typeof item) {
				case "string":
					return item;
				case "object":
					return JSON.stringify(item);
			}
			return item?.toString();
		})
		.join(" ");
	showToast(formatted, getAssetIDByName("ic_badge_staff"));
	logger.log(...items);
}
