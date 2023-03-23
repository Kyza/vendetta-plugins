import {
	ReactNative as RN,
	React,
	constants,
	stylesheet,
} from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin";
import { useProxy } from "@vendetta/storage";
import { semanticColors } from "@vendetta/ui";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { Forms } from "@vendetta/ui/components";
import { parse } from "./patches/sendMessage";

const { FormSection, FormDivider, FormRow, FormSwitchRow, FormText } = Forms;

const styles = stylesheet.createThemedStyleSheet({
	view: {
		flex: 1,
	},
	codeblock: {
		fontFamily: constants.Fonts.CODE_SEMIBOLD,
		includeFontPadding: false,
		fontSize: 12,
		backgroundColor: semanticColors.BACKGROUND_SECONDARY,
		marginLeft: 15,
		marginRight: 15,
		paddingTop: 8,
		paddingBottom: 6,
		paddingLeft: 10,
		paddingRight: 10,
		borderRadius: 5,
		borderWidth: 2,
		borderColor: semanticColors.BACKGROUND_SECONDARY_ALT,
	},
});

export default function Settings() {
	const [usage, setUsage] = React.useState("Loading...");

	React.useEffect(
		// @ts-ignore
		async () => {
			setUsage(
				await parse(`\\3001 -> 3001

\\n3001;; -> n3001;;
\\N3001;; -> N3001;;

\\n10n**100n;; -> n10n**100n;;

\\\\3001 -> \\3001
\\\\n3001;; -> \\n3001;;

\`3001\` -> \`3001\`

\`\`\`
3001
\`\`\`
|
V
\`\`\`
3001
\`\`\`

https://link.tld/3001 -> https://link.tld/3001
<file:///path/3001> -> <file:///path/3001>`)
			);
		},
		[]
	);

	useProxy(storage);

	return (
		<RN.ScrollView style={styles.view}>
			<FormSection title="Usage" titleStyleType="no_border">
				<FormText style={styles.codeblock}>{usage}</FormText>
			</FormSection>
			<FormSection title="Message Text Replacement" titleStyleType="no_border">
				<FormSwitchRow
					label="All Numbers"
					subLabel="Replaces all numbers in your messages like `3001`."
					leading={
						<FormRow.Icon
							source={getAssetIDByName(
								storage.replace.all ? "ic_check_24px" : "ic_close_24px"
							)}
						/>
					}
					value={storage.replace.all}
					onValueChange={(v: boolean) => {
						storage.replace.all = v;
					}}
				/>
				<FormDivider />
				<FormSwitchRow
					label="Syntax Numbers"
					subLabel="Replaces numbers in your messages with special syntax like `n3001;;`."
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
