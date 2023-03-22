import { findByProps } from "@vendetta/metro";
import { instead } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";
import log from "../../log";
import toWords from "../toWords";

const Messages = findByProps("sendMessage", "receiveMessage");

let savedPatch: () => void;

function isInRanges(ranges: [number, number][], location: number): boolean {
	return ranges.some(([start, end]) => start <= location && location <= end);
}

function capitalizeFirstLetter(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

function replaceRange(
	str: string,
	start: number,
	end: number,
	substitute: string
) {
	return str.substring(0, start) + substitute + str.substring(end);
}

enum MatchType {
	PLAIN,
	SYNTAX,
}
type Match = {
	type: MatchType;
	match: RegExpExecArray;
	capitalize: boolean;
	words: Promise<string> | string;
};

const inlineCodeblockRegex =
	/(?:(?:(?<!\\)```(?:.|\n)+?(?<!\\)```)|(?:(?<!\\)`[^`]+?`))/g;
const globalNumberRegex = /\b(?<!n)-?(?:\d+\.|\d+|\.\d+|\d+\.\d+)(?!;;)\b/gi;
const globalSyntaxRegex = /\b(n)(.+?);;/gi;
async function replaceIgnoreCodeblocks(content: string): Promise<string> {
	const originalContent = content;

	// First match codeblocks, then save the ranges where they exist.
	// Those ranges are areas where numbers should not be replaced.
	const ranges: [number, number][] = [];

	// Find ranges where numbers should not be replaced.
	let match;
	while ((match = inlineCodeblockRegex.exec(content)) !== null) {
		// This is necessary to avoid infinite loops with zero-width matches
		if (match.index === inlineCodeblockRegex.lastIndex) {
			inlineCodeblockRegex.lastIndex++;
		}
		ranges.push([match.index, match.index + match[0].length - 1]);
	}

	const matches: Match[] = [];

	// Find syntax numbers.
	if (storage.replace.syntax) {
		match = null;
		while ((match = globalSyntaxRegex.exec(content)) !== null) {
			// This is necessary to avoid infinite loops with zero-width matches
			if (match.index === globalSyntaxRegex.lastIndex) {
				globalSyntaxRegex.lastIndex++;
			}
			if (!isInRanges(ranges, match.index)) {
				matches.push({
					type: MatchType.SYNTAX,
					match,
					capitalize: match[1] === "N",
					words: toWords({ number: match[2] }),
				});
				// Ensure any numbers inside the syntax don't get matched later.
				ranges.push([match.index, match.index + match[0].length - 1]);
			}
		}
	}

	// Find basic numbers.
	if (storage.replace.basic) {
		match = null;
		while ((match = globalNumberRegex.exec(content)) !== null) {
			// This is necessary to avoid infinite loops with zero-width matches
			if (match.index === globalNumberRegex.lastIndex) {
				globalNumberRegex.lastIndex++;
			}
			if (!isInRanges(ranges, match.index)) {
				matches.push({
					type: MatchType.PLAIN,
					match,
					capitalize: false,
					words: toWords({ number: match[0] }),
				});
			}
		}
	}

	matches.sort((a, b) => {
		if (a.match.index > b.match.index) return -1;
		if (a.match.index < b.match.index) return 1;
		return 0;
	});

	// Do all replacements.
	// Since it's in reverse, there's no need to worry about length before changing and ruining ranges.
	for (const match of matches) {
		let words = await match.words;
		if (match.capitalize) {
			words = capitalizeFirstLetter(words);
		}
		content = replaceRange(
			content,
			match.match.index,
			match.match.index + match.match[0].length,
			words
		);
	}

	// TODO: Test if the user has nitro.
	return content.length > 4000 ? originalContent : content;
}

export function patch() {
	unpatch();
	savedPatch = instead("sendMessage", Messages, (args, original) => {
		const clonedArgs = JSON.parse(JSON.stringify(args));
		(async () => {
			try {
				clonedArgs[1].content = await replaceIgnoreCodeblocks(clonedArgs[1].content);
			} catch (e) {
				log(e.stack);
			}
			original(...clonedArgs);
		})();
	});
}

export function unpatch() {
	savedPatch?.();
}
