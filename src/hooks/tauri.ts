import { register, unregister } from "@tauri-apps/api/globalShortcut";
import type { ShortcutHandler } from "@tauri-apps/api/globalShortcut";

import { useEffect } from "react";

export const useKeyboardShortcut = (shortcut: string, cb: ShortcutHandler) => {
  useEffect(() => {
    register(shortcut, cb).then();

    return () => {
      unregister(shortcut).then();
    };
  }, [cb, shortcut]);
};
