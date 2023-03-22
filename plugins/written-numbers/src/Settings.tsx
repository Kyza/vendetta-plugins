import { ReactNative as RN } from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin";
import { useProxy } from "@vendetta/storage";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { Forms } from "@vendetta/ui/components";

const { FormSection, FormDivider, FormRow, FormSwitchRow } = Forms;

export default function Settings() {
	useProxy(storage);

	return (
		<RN.ScrollView style={{ flex: 1 }}>
			<FormSection title="Message Text Replacement" titleStyleType="no_border">
				<FormSwitchRow
					label="Basic Numbers"
					subLabel="Replaces numbers in your messages like `10 -> ten`."
					leading={
						<FormRow.Icon
							source={getAssetIDByName(
								storage.replace.basic ? "ic_check_24px" : "ic_close_24px"
							)}
						/>
					}
					value={storage.replace.basic}
					onValueChange={(v: boolean) => {
						storage.replace.basic = v;
					}}
				/>
				<FormDivider />
				<FormSwitchRow
					label="Syntax Numbers"
					subLabel="Replaces numbers in your messages with syntax like `n10;; -> ten` and `N10n**100n;; -> Ten duotrigintillion`."
					leading={
						<FormRow.Icon
							source={getAssetIDByName(
								storage.replace.syntax ? "ic_check_24px" : "ic_close_24px"
							)}
						/>
					}
					value={storage.replace.syntax}
					onValueChange={(v: boolean) => {
						storage.replace.syntax = v;
					}}
				/>
			</FormSection>
		</RN.ScrollView>
	);
}
