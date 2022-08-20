import { readTextFile } from "@tauri-apps/api/fs";

import { LexicalEditor } from "lexical";

import { silentOpen, $setTextContent } from "../../lib/fs";

const onError = (error: Error) => {
  console.error(error);
};

const initialConfig = {
  namespace: "Hotate",
  // theme,
  onError,
  editorState: () => {
    return $setTextContent("hoge\nfuga\n");
  },
};

export default initialConfig;
