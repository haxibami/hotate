import {
  $isTextNode,
  $isElementNode,
  $getAdjacentNode,
  $isDecoratorNode,
} from "lexical";
import type {
  TextNode,
  ElementNode,
  RangeSelection,
  NodeKey,
  GridSelection,
} from "lexical";

type TextPointType = {
  _selection: RangeSelection | GridSelection;
  getNode: () => TextNode;
  is: (point: PointType) => boolean;
  isBefore: (point: PointType) => boolean;
  key: NodeKey;
  offset: number;
  set: (key: NodeKey, offset: number, type: "text" | "element") => void;
  type: "text";
};

type ElementPointType = {
  _selection: RangeSelection | GridSelection;
  getNode: () => ElementNode;
  is: (point: PointType) => boolean;
  isBefore: (point: PointType) => boolean;
  key: NodeKey;
  offset: number;
  set: (key: NodeKey, offset: number, type: "text" | "element") => void;
  type: "element";
};

type PointType = TextPointType | ElementPointType;

const getDOMSelection = (): Selection | null => window.getSelection();

function $moveNativeSelection(
  domSelection: Selection,
  alter: "move" | "extend",
  direction: "backward" | "forward" | "left" | "right",
  granularity: "character" | "word" | "lineboundary" | "line"
): void {
  domSelection.modify(alter, direction, granularity);
}

function $setPointValues(
  point: PointType,
  key: NodeKey,
  offset: number,
  type: "text" | "element"
): void {
  point.key = key;
  point.offset = offset;
  point.type = type;
}

function $swapPoints(selection: RangeSelection): void {
  const focus = selection.focus;
  const anchor = selection.anchor;
  const anchorKey = anchor.key;
  const anchorOffset = anchor.offset;
  const anchorType = anchor.type;

  $setPointValues(anchor, focus.key, focus.offset, focus.type);
  $setPointValues(focus, anchorKey, anchorOffset, anchorType);
  selection._cachedNodes = null;
}

function $modifyLineSelection(
  selection: RangeSelection,
  alter: "move" | "extend",
  isBackward: boolean,
  granularity: "character" | "word" | "lineboundary" | "line"
): void {
  const focus = selection.focus;
  const anchor = selection.anchor;
  const collapse = alter === "move";

  // Handle the selection movement around decorators.
  // TODO: remove decorator logic
  const possibleNode = $getAdjacentNode(focus, isBackward);
  if ($isDecoratorNode(possibleNode) && !possibleNode.isIsolated()) {
    const sibling = isBackward
      ? possibleNode.getPreviousSibling()
      : possibleNode.getNextSibling();

    if (!$isTextNode(sibling)) {
      const parent = possibleNode.getParentOrThrow();
      let offset;
      let elementKey;

      if ($isElementNode(sibling)) {
        elementKey = sibling.__key;
        offset = isBackward ? sibling.getChildrenSize() : 0;
      } else {
        offset = possibleNode.getIndexWithinParent();
        elementKey = parent.__key;
        if (!isBackward) {
          offset++;
        }
      }
      focus.set(elementKey, offset, "element");
      if (collapse) {
        anchor.set(elementKey, offset, "element");
      }
      return;
    } else {
      const siblingKey = sibling.__key;
      const offset = isBackward ? sibling.getTextContent().length : 0;
      focus.set(siblingKey, offset, "text");
      if (collapse) {
        anchor.set(siblingKey, offset, "text");
      }
      return;
    }
  }

  const domSelection = getDOMSelection();

  if (!domSelection) {
    return;
  }

  $moveNativeSelection(
    domSelection,
    alter,
    isBackward ? "backward" : "forward",
    granularity
  );

  if (domSelection.rangeCount > 0) {
    const range = domSelection.getRangeAt(0);
    selection.applyDOMRange(range);
    selection.dirty = true;

    if (
      (!collapse && domSelection.anchorNode !== range.startContainer) ||
      domSelection.anchorOffset !== range.startOffset
    ) {
      $swapPoints(selection);
    }
  }
}

export function $moveCaretSelection(
  selection: RangeSelection,
  isHoldingShift: boolean,
  isBackward: boolean,
  granularity: "character" | "word" | "lineboundary" | "line"
): void {
  $modifyLineSelection(
    selection,
    isHoldingShift ? "extend" : "move",
    isBackward,
    granularity
  );
}

export function $moveLine(
  selection: RangeSelection,
  isHoldingShift: boolean,
  isBackward: boolean
): void {
  $moveCaretSelection(selection, isHoldingShift, isBackward, "line");
}
