import type { WheelEvent } from "react";
import { useEffect, useRef } from "react";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
// import { TreeView } from "@lexical/react/LexicalTreeView";
import { $getRoot } from "lexical";

import { useRecoilValue, useSetRecoilState } from "recoil";

import Header from "../../components/Header";
import Infobar from "../../components/Infobar";
import { PLACEHOLDER_CONTENT } from "../../consts";
import AutoFocusPlugin from "../../plugins/AutoFocusPlugin";
import { AutoHorizontalScrollPlugin } from "../../plugins/AutoHorizontalScrollPlugin";
import InitPlugin from "../../plugins/InitPlugin";
import {
  lineWordsState,
  isLineNumOnState,
  lineHeightState,
  fontSizeState,
  textLengthState,
  // targetFileState,
  // isEditableState,
} from "../../store";

const Editor = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        top: 0,
        left: -e.deltaY,
        behavior: "smooth",
      });
    }
  };

  const lw = useRecoilValue(lineWordsState);

  const [editor] = useLexicalComposerContext();
  // const [targetFile] = useRecoilValue(targetFileState);

  const isLineNumOn = useRecoilValue(isLineNumOnState);
  const lineHeight = useRecoilValue(lineHeightState);
  const fontSize = useRecoilValue(fontSizeState);
  // const isEditable = useRecoilValue(isEditableState);
  const setTextLength = useSetRecoilState(textLengthState);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.setAttribute(
        "style",
        `
        height: calc(${lw}em + 7rem);
        line-height: ${lineHeight};
        font-size: ${fontSize}rem;
        `
      );
    }
  }, [lw, lineHeight, fontSize]);

  const onChange = () => {
    setTextLength(
      editor
        .getEditorState()
        .read(() => $getRoot().getTextContent().replace(/\n/g, "").length)
    );
  };

  return (
    <div
      id="container"
      className="flex h-full w-full flex-col items-center justify-between"
    >
      <Header />
      <div className={`w-3/4`}>
        <div
          className="scrollbar relative w-full overflow-x-auto overflow-y-hidden pt-14 pb-14"
          ref={containerRef}
          onWheel={handleWheel}
        >
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className={`${isLineNumOn ? "linenum " : ""}
                vertical relative h-full min-w-full font-serif focus:outline-none`}
              />
            }
            placeholder={
              <div className="vertical placeholder pointer-events-none absolute top-14 right-0 select-none font-serif text-slate-400">
                {PLACEHOLDER_CONTENT}
              </div>
            }
          />
        </div>
        <AutoFocusPlugin />
        <AutoHorizontalScrollPlugin scrollRef={containerRef} />
        <HistoryPlugin />
        <OnChangePlugin onChange={onChange} ignoreSelectionChange={true} />
        <InitPlugin />
        {/*<TreeView
          viewClassName="tree-view-output"
          timeTravelPanelClassName="debug-timetravel-panel"
          timeTravelButtonClassName="debug-timetravel-button"
          timeTravelPanelSliderClassName="debug-timetravel-panel-slider"
          timeTravelPanelButtonClassName="debug-timetravel-panel-button"
          editor={editor}
        />*/}
      </div>
      <Infobar />
    </div>
  );
};

export default Editor;
