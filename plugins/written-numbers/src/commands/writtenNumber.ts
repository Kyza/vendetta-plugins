import { commands } from "@vendetta";
import { clipboard } from "@vendetta/metro/common";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { showToast } from "@vendetta/ui/toasts";
import getArg from "../getArg";
import toWords from "../toWords";

let savedCommand: () => void;

export function register() {
	unregister();
	savedCommand = commands.registerCommand({
		name: "written number",
		displayName: "written number",
		applicationId: "written-numbers",
		description: "Makes numbers written.",
		displayDescription: "Makes numbers written.",
		type: 1,
		inputType: 1,
		options: [
			{
				name: "number",
				displayName: "number",
				description: "The number to convert.",
				displayDescription: "The number to convert.",
				type: 3,
				required: true,
			},
			{
				name: "commas",
				displayName: "commas",
				description: "Whether or not to use commas.",
				displayDescription: "Whether or not to use commas.",
				type: 5,
				required: false,
			},
			{
				name: "hundred_and",
				displayName: "hundred_and",
				description: "Whether or not to use and after hundreds.",
				displayDescription: "Whether or not to use and after hundreds.",
				type: 5,
				required: false,
			},
		],
		async execute(args, _ctx) {
			let number = getArg(args, "number", "");
			const commas = getArg(args, "commas", false);
			const hundredAnd = getArg(args, "hundred_and", false);

			const result = await toWords({
				number,
				languageOptions: {
					commas,
					hundredAnd,
				},
			});

			clipboard.setString(result);
			showToast("Copied number to clipboard.", getAssetIDByName("toast_copy_link"));

			return;
		},
	});
}

export function unregister() {
	savedCommand?.();
}
