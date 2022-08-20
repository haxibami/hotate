import type { FC } from "react";

import { Button, Navbar, Dropdown, Swap } from "react-daisyui";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { UNDO_COMMAND, REDO_COMMAND } from "lexical";

import { useRecoilState } from "recoil";

import * as Svg from "../../components/Svg";
import { PLACEHOLDER_TITLE } from "../../consts";
import { askandSave, askAndOpen, silentSave } from "../../lib/fs";
import {
  isDrawerOpenState,
  isModalOpenState,
  targetFileState,
  // isReadOnlyState,
} from "../../store";

const Header: FC = () => {
  const [editor] = useLexicalComposerContext();
  const [isDrawerOpen, setIsDrawerOpen] = useRecoilState(isDrawerOpenState);
  const [isModalOpen, setIsModalOpen] = useRecoilState(isModalOpenState);
  // const [isReadOnly, setIsReadOnly] = useRecoilState(isReadOnlyState);
  const [targetFile, setTargetFile] = useRecoilState(targetFileState);

  const handleReadOnly = () => {
    editor.isReadOnly() ? editor.setReadOnly(false) : editor.setReadOnly(true);
    // setIsReadOnly(!isReadOnly);
  };

  const handleOpen = async () => {
    const openedName = await askAndOpen(editor);
    if (openedName) {
      setTargetFile(openedName);
    }
  };

  // TODO: show saved indicator
  const handleSave = async (ask: boolean) => {
    if (ask) {
      // 保存
      const fileName = await askandSave(editor);
      setTargetFile(fileName);
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

  return (
    <div
      className={`component-preview flex w-full items-center justify-center border-b-2 border-b-base-200 font-sans opacity-0 transition-opacity duration-1000 ease-out hover:opacity-100`}
    >
      <Navbar className="min-h-[3rem] gap-2">
        <div className="flex flex-1 justify-start gap-2">
          <div>
            <Dropdown horizontal="right" vertical="middle">
              <Dropdown.Toggle color="ghost" size="sm">
                <Svg.Bars className="inline-block h-5 w-5 fill-current stroke-current" />
              </Dropdown.Toggle>
              <Dropdown.Menu className="menu-compact w-52 rounded bg-base-200 shadow-2xl">
                <Dropdown.Item onClick={async () => handleOpen()}>
                  <Svg.File className="inline-block h-4 w-4 fill-current stroke-current" />
                  開く
                </Dropdown.Item>
                <Dropdown.Item onClick={async () => handleSave(true)}>
                  <Svg.Save className="inline-block h-4 w-4 fill-current stroke-current" />
                  保存
                </Dropdown.Item>
                <Dropdown.Item onClick={async () => handleSave(false)}>
                  <Svg.Sync className="inline-block h-4 w-4 fill-current stroke-current" />
                  上書き保存
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
                  <Svg.Gear className="inline-block h-4 w-4 fill-current stroke-current" />
                  設定
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div>
            <Button
              shape="square"
              color="ghost"
              onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
              size="sm"
            >
              <Svg.Undo className="inline-block h-5 w-5 fill-current stroke-current" />
            </Button>
          </div>
          <div>
            <Button
              shape="square"
              color="ghost"
              onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
              size="sm"
            >
              <Svg.Redo className="inline-block h-5 w-5 fill-current stroke-current" />
            </Button>
          </div>
          <div>
            <Swap
              rotate={true}
              offElement={<Svg.Pen className="h-5 w-5 fill-current" />}
              onElement={<Svg.EyeOpen className="h-5 w-5 fill-current" />}
              onChange={handleReadOnly}
              className="h-8 w-8"
            />
          </div>
        </div>
        <div className="flex flex-1 justify-center text-sm">
          {targetFile !== "" ? targetFile : PLACEHOLDER_TITLE}
        </div>
        <div className="flex flex-1 justify-end">
          <div>
            <Dropdown horizontal="left" vertical="middle">
              <Dropdown.Toggle color="ghost" size="sm">
                <Svg.Ellipsis className="inline-block h-5 w-5 fill-current stroke-current" />
              </Dropdown.Toggle>
              <Dropdown.Menu className="menu-compact w-52 rounded bg-base-200 shadow-2xl">
                <Dropdown.Item onClick={() => setIsModalOpen(!isModalOpen)}>
                  <Svg.Question className="inline-block h-4 w-4 fill-current" />
                  ヘルプ
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setIsModalOpen(!isModalOpen)}>
                  <Svg.Info className="inline-block h-4 w-4 fill-current" />
                  このアプリについて
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </Navbar>
    </div>
  );
};

export default Header;
