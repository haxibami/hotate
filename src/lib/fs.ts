import { save, open } from "@tauri-apps/api/dialog";
import { writeTextFile, readTextFile } from "@tauri-apps/api/fs";

import { $getRoot, $createParagraphNode, $createTextNode } from "lexical";
import type { LexicalEditor } from "lexical";

export const getOpenFilePath = async () => {
  const filePath = await open({
    multiple: false,
    title: "ファイルを開く",
    filters: [{ name: "Text Files", extensions: ["txt"] }],
  });
  if (filePath && typeof filePath === "string") {
    return filePath;
  }
};

export function $setTextContent(text: string) {
  const root = $getRoot();
  if (root.getFirstChild()) {
    root.clear();
  }
  // initialize editor with dirty way
  text
    .split("\n")
    .slice(0, -1)
    .forEach((line) => {
      const paragraph = $createParagraphNode();
      if (line.length === 0) {
        // empty line
      } else {
        paragraph.append($createTextNode(line));
      }
      root.append(paragraph);
    });
}

export const silentOpen = async (editor: LexicalEditor, filePath: string) => {
  const text = await readTextFile(filePath);
  editor.update(() => {
    $setTextContent(text);
  });
};

export const askAndOpen = async (editor: LexicalEditor) => {
  const filePath = await getOpenFilePath();
  if (filePath) {
    await silentOpen(editor, filePath);
    return filePath;
  } else {
    // some message or error
  }
};

export const getSaveFilePath = async () => {
  const filePath = await save({
    title: "ファイルを保存",
    filters: [{ name: "Text Files", extensions: ["txt"] }],
  });
  return filePath;
};

export const silentSave = async (editor: LexicalEditor, filePath: string) => {
  // TODO: check whether file exists
  // TODO: improve text extraction logic
  // since we show plain text in rich editor mode, we need to convert each paragraph to line
  const text = editor
    .getEditorState()
    .read(() =>
      $getRoot()
        .getChildren()
        .map((n) => n.getTextContent())
    )
    .join("\n");
  // TODO: check if we can correctly handle linebreak
  await writeTextFile(filePath, `${text}\n`);
  // return filePath;
};

export const askandSave = async (editor: LexicalEditor) => {
  const filePath = await getSaveFilePath();
  if (filePath) {
    await silentSave(editor, filePath);
  }
  return filePath ?? "";
};
