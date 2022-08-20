import { useLayoutEffect } from "react";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isElementNode, $getSelection, $isRangeSelection } from "lexical";

type Props = Readonly<{
  scrollRef: {
    current: HTMLElement | null;
  };
}>;

export function AutoHorizontalScrollPlugin({
  scrollRef,
}: Props): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useLayoutEffect(() => {
    return editor.registerUpdateListener(({ editorState, tags }) => {
      const scrollElement = scrollRef.current;

      if (scrollElement === null) {
        return;
      }

      const selection = editorState.read(() => $getSelection());

      if (!$isRangeSelection(selection)) {
        return;
      }

      const anchorElement = editor.getElementByKey(selection.anchor.key);

      if (anchorElement === null) {
        return;
      }

      const scrollRect = scrollElement.getBoundingClientRect();

      let anchorNode = editorState.read(() => selection.anchor.getNode());
      if (anchorNode === null) {
        return;
      }
      if ($isElementNode(anchorNode)) {
        const descendantNode = editorState.read(() =>
          anchorNode?.getDescendantByIndex(selection.anchor.offset - 1)
        );
        if (descendantNode !== null) {
          anchorNode = descendantNode;
        }
      }

      const element = editor.getElementByKey(anchorNode.__key) as Element;

      if (element !== null) {
        const rect = element.getBoundingClientRect();

        if (rect.width > scrollRect.width) {
          // if text wider than screen is given without linebreak,
          // we have no way to detect current cursor position from element.
          // so currently we can do nothing.
          // tips: firefox can handle this situation
          return;
        }

        if (rect.left < scrollRect.left) {
          element.scrollIntoView(false);
        } else if (rect.right > scrollRect.right) {
          element.scrollIntoView();
        } else {
          // Rects can returning decimal numbers that differ due to rounding
          // differences. So let's normalize the values.
          if (Math.floor(rect.left) < Math.floor(scrollRect.left)) {
            element.scrollIntoView();
          } else if (Math.floor(rect.right) > Math.floor(scrollRect.right)) {
            element.scrollIntoView(false);
          }
        }
      }
      tags.add("scroll-into-view");
    });
  }, [editor, scrollRef]);

  return null;
}
