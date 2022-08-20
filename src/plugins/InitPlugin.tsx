import type { FC } from "react";
import { useEffect } from "react";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { COMMAND_PRIORITY_HIGH, KEY_MODIFIER_COMMAND } from "lexical";

import { useRecoilState } from "recoil";

// import { useGlobalShortcut, useKeyboardShortcut } from "../hooks/tauri";
import { useKeybind } from "../hooks/keybind";
import { SAVE_COMMAND } from "../lib/command";
import { silentSave, askandSave } from "../lib/fs";
import { targetFileState } from "../store";

const InitPlugin: FC = () => {
  const [editor] = useLexicalComposerContext();
  const [targetFile, setTargetFile] = useRecoilState(targetFileState);

  // TODO: improve Ctrl+S shortcut
  const handleSave = async (ask: boolean) => {
    if (ask) {
      // 保存
      const savedName = await askandSave(editor);
      setTargetFile(savedName);
    } else {
      // 上書き保存
      if (targetFile !== "") {
        await silentSave(editor, targetFile);
      } else {
        const savedName = await askandSave(editor);
        setTargetFile(savedName);
      }
    }
  };

  // TODO: switch to app-wide keybind
  // currently tauri on Wayland does not support app-wide keybinding
  //
  // useKeyboardShortcut("CommandOrControl+S", (shortcut) => {
  //
  // });

  useKeybind(editor);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand<KeyboardEvent>(
        KEY_MODIFIER_COMMAND,
        (event) => {
          if (event.ctrlKey && event.key === "s") {
            return editor.dispatchCommand(SAVE_COMMAND, event);
          } else {
            return false;
          }
        },
        COMMAND_PRIORITY_HIGH
      ),
      editor.registerCommand<KeyboardEvent>(
        SAVE_COMMAND,
        (event) => {
          event.preventDefault();
          (async () => {
            await handleSave(false);
          })();
          return true;
        },
        COMMAND_PRIORITY_HIGH
      )
    );
  }, [editor, targetFile]);

  return null;
};

export default InitPlugin;
