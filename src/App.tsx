import { readTextFile } from "@tauri-apps/api/fs";

import { useState, useEffect, useRef } from "react";

import { Drawer } from "react-daisyui";

import { LexicalComposer } from "@lexical/react/LexicalComposer";

import { useRecoilState, useRecoilValue } from "recoil";

import Editor from "./components/Editor";
import Setting from "./components/Setting";
import TextModal from "./components/TextModal";
import { $setTextContent } from "./lib/fs";
import { isDrawerOpenState, targetFileState } from "./store";

const dataMap: Map<string, unknown> = new Map();

// TODO: fix data management
function useData<T>(cacheKey: string, fetch: () => Promise<T>): T {
  const cachedData = dataMap.get(cacheKey) as T | undefined;
  if (cachedData === undefined) {
    throw fetch().then((d) => dataMap.set(cacheKey, d));
  }
  return cachedData;
}

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useRecoilState(isDrawerOpenState);
  const targetFile = useRecoilValue(targetFileState);

  const onError = (error: Error) => {
    console.error(error);
  };

  const text = useData(targetFile, () => readTextFile(targetFile));

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
            <TextModal />
          </div>
        </Drawer>
      </LexicalComposer>
    </div>
  );
}

export default App;
