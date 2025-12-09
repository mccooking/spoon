import type { BlockNoteEditor } from "@blocknote/core";
import type { schema } from "./schema";

export type TextEditor = BlockNoteEditor<
	(typeof schema)["blockSchema"],
	(typeof schema)["inlineContentSchema"]
>;
