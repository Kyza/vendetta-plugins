import { commands } from "@vendetta";
import { ReactNative } from "@vendetta/metro/common";

let savedCommand: () => void;

export function register() {
	unregister();
	savedCommand = commands.registerCommand({
		name: "reload",
		displayName: "reload",
		applicationId: "vendetta",
		description: "Reloads the Discord client.",
		displayDescription: "Reloads the Discord client.",
		type: 1,
		inputType: 1,
		options: [],
		async execute(_args, _ctx) {
			ReactNative.NativeModules.BundleUpdaterManager.reload();
		},
	});
}

export function unregister() {
	savedCommand?.();
}
