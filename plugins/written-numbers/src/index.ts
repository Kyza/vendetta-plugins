import { storage } from "@vendetta/plugin";
import Settings from "./Settings";
import {
	register as register_reload,
	unregister as unregister_reload,
} from "./commands/reload";
import {
	register as register_writtenNumber,
	unregister as unregister_writtenNumber,
} from "./commands/writtenNumber";
import {
	patch as patch_sendMessage,
	unpatch as unpatch_sendMessage,
} from "./patches/sendMessage";

storage.replace ??= {
	basic: true,
	syntax: true,
};

export default {
	onLoad: () => {
		register_writtenNumber();
		register_reload();
		patch_sendMessage();
	},
	onUnload: () => {
		unregister_writtenNumber();
		unregister_reload();
		unpatch_sendMessage();
	},
	settings: Settings,
};
