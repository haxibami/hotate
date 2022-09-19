import { atom, selector, DefaultValue } from "recoil";

import { store } from "../lib/config";

import type { AtomEffect } from "recoil";

// Utils
type TauriStoreEffect = <T>(key: string) => AtomEffect<T>;

// const tauriStoreEffect: TauriStoreEffect =
//   (key: string) =>
//   ({ setSelf, onSet, trigger }) => {
//     // If there's a persisted value - set it on load
//     const loadPersisted = async () => {
//       // TODO: type
//       const savedValue: any = await store.get(key);
//
//       if (savedValue != null) {
//         setSelf(savedValue);
//       }
//     };
//
//     // Asynchronously set the persisted data
//     if (trigger === "get") {
//       loadPersisted();
//     }
//
//     // Subscribe to state changes and persist them to tauri store
//     onSet((newValue, _, isReset) => {
//       isReset ? store.delete(key) : store.set(key, newValue);
//     });
//   };

const tauriStoreEffect: TauriStoreEffect =
  (key: string) =>
  ({ setSelf, onSet }) => {
    // If there's a persisted value - set it on load
    setSelf(
      store.get(key).then(
        // TODO: type
        (savedValue: any) =>
          savedValue != null ? savedValue : new DefaultValue() // Abort initialization if no value was stored
      )
    );

    // Subscribe to state changes and persist them to localForage
    onSet((newValue, _, isReset) => {
      isReset ? store.delete(key) : store.set(key, newValue);
    });
  };

// Atoms

// Editor
export const targetFileState = atom<string>({
  key: "editor/file-name",
  default: "",
  effects: [tauriStoreEffect("target-file")],
});

export const textLengthState = atom({
  key: "editor/text-length",
  default: 0,
});

export const isEditableState = atom({
  key: "editor/is-editable",
  default: true,
});

// UI
// TODO: enable fontsize setting
export const fontSizeState = atom({
  key: "config/font-size",
  default: 1,
  effects: [tauriStoreEffect("font-size")],
});

export const lineWordsState = atom({
  key: "config/line-words",
  default: 30,
  effects: [tauriStoreEffect("line-words")],
});

export const lineHeightState = atom({
  key: "config/line-height",
  default: 2,
  effects: [tauriStoreEffect("line-height")],
});

export const isLineNumOnState = atom({
  key: "config/is-line-number-on",
  default: true,
  effects: [tauriStoreEffect("is-line-number-on")],
});

export const isLenCountOnState = atom({
  key: "config/is-len-count-on",
  default: true,
  effects: [tauriStoreEffect("is-len-count-on")],
});

export const isOsColorModeState = atom({
  key: "config/is-os-color-mode",
  default: true,
  effects: [tauriStoreEffect("is-os-color-mode")],
});

export const colorModeState = atom({
  key: "config/color-mode",
  default: "light",
  effects: [tauriStoreEffect("color-mode")],
});

// UI
export const isDrawerOpenState = atom({
  key: "ui/is-drawer-open",
  default: false,
});

export const isModalOpenState = atom({
  key: "ui/is-modal-open",
  default: false,
});
