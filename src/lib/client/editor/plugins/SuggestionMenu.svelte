<script lang="ts">
	import { onMount } from "svelte";
	import type { BlockNoteEditor } from "@blocknote/core";
	export let editor: BlockNoteEditor<any, any, any>;

	let showSuggestionMenu = false;
	let commandNodePos: number | null = null;

	const isInsideCommandNode = () => {
		const { state } = (editor as any)._tiptapEditor;
		const { $from } = state.selection;

		for (let i = $from.depth; i >= 0; i--) {
			const node = $from.node(i);
			if (node.type.name === "slashCommand") {
				return { isInside: true, pos: $from.before(i), node };
			}
		}
		return { isInside: false, pos: null, node: null };
	};

	const convertToText = (pos: number, node: any) => {
		const { tr } = (editor as any)._tiptapEditor.state;

		if (node) {
			let text = "";
			node.forEach((child: any) => {
				if (child.isText) {
					text += child.text;
				}
			});

			if (!text) {
				text = node.attrs.text || "/";
			}

			const transaction = tr.replaceWith(
				pos,
				pos + node.nodeSize,
				(editor as any)._tiptapEditor.schema.text(text)
			);
			(editor as any)._tiptapEditor.view.dispatch(transaction);
		}

		showSuggestionMenu = false;
		commandNodePos = null;
	};

	onMount(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			const commandCheck = isInsideCommandNode();

			if (event.key === "/" && !commandCheck.isInside && editor) {
				event.preventDefault();
				editor.insertInlineContent([
					{
						type: "slashCommand",
						props: { text: "/" }
					}
				]);
				showSuggestionMenu = true;
				return;
			}

			if (event.key === "Backspace" && commandCheck.isInside && commandCheck.node) {
				const text = commandCheck.node.attrs.text || "";
				if (text === "/") {
					event.preventDefault();
					convertToText(commandCheck.pos, commandCheck.node);
					return;
				}
			}

			if (
				(event.key === "ArrowLeft" ||
					event.key === "ArrowRight" ||
					event.key === "ArrowUp" ||
					event.key === "ArrowDown") &&
				commandCheck.isInside
			) {
				setTimeout(() => {
					const newCheck = isInsideCommandNode();
					if (!newCheck.isInside && commandCheck.node) {
						convertToText(commandCheck.pos, commandCheck.node);
					}
				}, 0);
			}
		};

		const handleClick = () => {
			setTimeout(() => {
				const commandCheck = isInsideCommandNode();
				if (commandCheck.isInside) {
					showSuggestionMenu = true;
					commandNodePos = commandCheck.pos;
				} else if (commandNodePos !== null) {
					const node = (editor as any)._tiptapEditor.state.doc.nodeAt(commandNodePos);
					if (node && node.type.name === "slashCommand") {
						convertToText(commandNodePos, node);
					}
				} else {
					showSuggestionMenu = false;
				}
			}, 0);
		};

		const handleSelectionChange = () => {
			const commandCheck = isInsideCommandNode();
			if (commandCheck.isInside) {
				showSuggestionMenu = true;
				commandNodePos = commandCheck.pos;
			} else {
				if (commandNodePos !== null) {
					const node = (editor as any)._tiptapEditor.state.doc.nodeAt(commandNodePos);
					if (node && node.type.name === "slashCommand") {
						convertToText(commandNodePos, node);
					}
				}
				showSuggestionMenu = false;
				commandNodePos = null;
			}
		};

		const editorElement = (editor as any)._tiptapEditor.view.dom;
		editorElement.addEventListener("keydown", handleKeyDown);
		editorElement.addEventListener("click", handleClick);
		(editor as any)._tiptapEditor.on("selectionUpdate", handleSelectionChange);

		return () => {
			editorElement.removeEventListener("keydown", handleKeyDown);
			editorElement.removeEventListener("click", handleClick);
			(editor as any)._tiptapEditor.off("selectionUpdate", handleSelectionChange);
		};
	});
</script>

{#if showSuggestionMenu}
	<div class="absolute right-2 bottom-2 bg-bg-secondary border border-border rounded shadow-lg p-2">
		SuggestionMenu
	</div>
{/if}
