import log from "../log";

export type Options = {
	language: "en" | "la" | string;
};
export type LanguageOptions = Record<string, any>;

export const numberRegex = /^-?(?:\d+\.?|\.\d+|\d+\.\d+)$/;
export const cache = new Map<string, string>();
export default async function toWords({
	number,
	options,
	languageOptions,
}: {
	number: string;
	options?: Options;
	languageOptions?: LanguageOptions;
}) {
	options ??= {
		language: "en",
	};
	languageOptions ??= {};

	if (cache.has(number)) {
		return cache.get(number);
	}

	if (!numberRegex.test(number)) {
		try {
			number = new Function(`return ${number}`)();
		} catch (e) {
			log(e);
			return "NotANumber";
		}
	}

	const result = await fetch("https://numbers.kyza.net/api", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			number,
			options,
			languageOptions,
		}),
	}).then((result) => result.text());

	cache.set(number, result);

	return result;
}
