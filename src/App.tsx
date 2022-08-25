import { readTextFile } from "@tauri-apps/api/fs";

import { useState, useEffect, useRef } from "react";

import { Drawer } from "react-daisyui";

import { LexicalComposer } from "@lexical/react/LexicalComposer";

import { useRecoilState, useRecoilValue } from "recoil";

import Editor from "./components/Editor";
import Setting from "./components/Setting";
import TextModal from "./components/TextModal";
import { $setTextContent } from "./lib/fs";
import { useData } from "./lib/suspense";
import { isDrawerOpenState, targetFileState } from "./store";

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useRecoilState(isDrawerOpenState);
  const targetFile = useRecoilValue(targetFileState);

  const onError = (error: Error) => {
    console.error(error);
  };

  const loadContent = () => {
    if (targetFile !== "") {
      return readTextFile(targetFile);
    } else {
      return Promise.resolve("");
    }
  };

  const text = useData(targetFile, loadContent);

  return (
    <div className="App">
      <LexicalComposer
        initialConfig={{
          namespace: "Hotate",
          onError,
          editorState: () => $setTextContent(text),
        }}
      >
        <Drawer
          side={<Setting />}
          open={isDrawerOpen}
          onClickOverlay={() => setIsDrawerOpen(!isDrawerOpen)}
        >
          <div className="h-full w-full">
            <Editor />
            {/*
            TODO: fix modal related issue
            */}
          </div>
        </Drawer>
      </LexicalComposer>
    </div>
  );
}

export default App;
