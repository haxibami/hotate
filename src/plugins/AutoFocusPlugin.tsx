import type { FC } from "react";
import { useEffect } from "react";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { useRecoilState } from "recoil";

import { isDrawerOpenState } from "../store";

const AutoFocusPlugin: FC = () => {
  const [editor] = useLexicalComposerContext();
  const [isDrawerOpen] = useRecoilState(isDrawerOpenState);

  useEffect(() => {
    if (!isDrawerOpen) {
      editor.focus();
    }
  }, [editor, isDrawerOpen]);

  return null;
};

export default AutoFocusPlugin;
