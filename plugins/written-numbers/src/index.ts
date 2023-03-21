import { commands, logger } from "@vendetta";
import { clipboard } from "@vendetta/metro/common";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { showToast } from "@vendetta/ui/toasts";

function getArg(args: any[], name: string, defaultValue: any) {
	return args.find((arg) => arg.name === name)?.value ?? defaultValue;
}

const registeredCommands = [];

const numberRegex = /^-?(?:\d+\.?|\.\d+|\d+\.\d+)$/;

export default {
	onLoad: () => {
		registeredCommands.push(
			commands.registerCommand({
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
				async execute(args, ctx) {
					let number = getArg(args, "number", "");
					const commas = getArg(args, "commas", false);
					const hundredAnd = getArg(args, "hundred_and", false);

					if (!numberRegex.test(number)) {
						number = new Function(`return ${number}`)();
					}

					const result = await fetch("https://numbers.kyza.net/api", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							number,
							languageOptions: {
								commas,
								hundredAnd,
							},
						}),
					}).then((result) => result.text());

					logger.log(result, args);

					clipboard.setString(result);
					showToast("Copied number to clipboard.", getAssetIDByName("toast_copy_link"));

					return;

					// return {
					// 	content: result,
					// 	ephemeral: true,
					// };
				},
			})
		);
	},
	onUnload: () => {
		for (const command of registeredCommands) {
			command();
		}
		while (registeredCommands.length > 0) {
			registeredCommands.pop();
		}
	},
};
