import {
	BlockNoteSchema,
	defaultInlineContentSpecs,
	createInlineContentSpec
} from "@blocknote/core";

const slashCommandSpec = createInlineContentSpec(
	{
		type: "slashCommand",
		propSchema: {
			text: { default: "/" }
		},
		content: "styled"
	},
	{
		render: (inlineContent) => {
			const span = document.createElement("span");
			span.className = "slash-command bg-bg-secondary px-1.5 py-1 rounded-sm border border-border";
			span.setAttribute("contenteditable", "true");
			span.textContent = inlineContent.props.text;

			return { dom: span, contentDOM: span };
		}
	}
);

export const schema = BlockNoteSchema.create({
	inlineContentSpecs: {
		...defaultInlineContentSpecs,
		slashCommand: slashCommandSpec
	}
});
