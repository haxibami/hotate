import type {
  RangeSelection,
  GridSelection,
  PASTE_COMMAND,
  CommandPayloadType,
  LexicalEditor} from "lexical";
import {
  $getSelection,
  $isRangeSelection,
  $isGridSelection
} from "lexical";

// All pasted text is treated as multi-line plain text
function $insertDataTransferForNovelText(
  dataTransfer: DataTransfer,
  selection: RangeSelection | GridSelection
): void {
  // Multi-line plain text in rich text mode pasted as separate paragraphs
  // instead of single paragraph with linebreaks.
  const text = dataTransfer.getData("text/plain");
  if (text != null) {
    if ($isRangeSelection(selection)) {
      const lines = text.split(/\r?\n/);
      const linesLength = lines.length;

      for (let i = 0; i < linesLength; i++) {
        selection.insertText(lines[i]);
        if (i < linesLength - 1) {
          selection.insertParagraph();
        }
      }
      console.log("hoge");
    } else {
      selection.insertRawText(text);
    }
  }
}

export function onPasteForRichText(
  event: CommandPayloadType<typeof PASTE_COMMAND>,
  editor: LexicalEditor
): void {
  event.preventDefault();
  editor.update(
    () => {
      const selection = $getSelection();
      const clipboardData =
        event instanceof InputEvent ? null : event.clipboardData;
      if (
        clipboardData != null &&
        ($isRangeSelection(selection) || $isGridSelection(selection))
      ) {
        $insertDataTransferForNovelText(clipboardData, selection);
      }
    },
    {
      tag: "paste",
    }
  );
}
