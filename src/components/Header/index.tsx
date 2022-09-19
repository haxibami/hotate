import { getName, getVersion, getTauriVersion } from "@tauri-apps/api/app";
import { message } from "@tauri-apps/api/dialog";
import { arch, platform } from "@tauri-apps/api/os";
import { open } from "@tauri-apps/api/shell";

import { useState } from "react";
import type { FC } from "react";

import {
  Button,
  Navbar,
  Table,
  Dropdown,
  Swap,
  Kbd,
  WindowMockup,
} from "react-daisyui";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { UNDO_COMMAND, REDO_COMMAND } from "lexical";

import { useRecoilState } from "recoil";

import * as Svg from "../../components/Svg";
import TextModal from "../../components/TextModal";
import { PLACEHOLDER_TITLE } from "../../consts";
import { askandSave, askAndOpen, silentSave } from "../../lib/fs";
import {
  isDrawerOpenState,
  targetFileState,
  // isEditableState,
} from "../../store";

const Header: FC = () => {
  const [editor] = useLexicalComposerContext();
  const [isDrawerOpen, setIsDrawerOpen] = useRecoilState(isDrawerOpenState);
  // const [isEditable, setIsEditable] = useRecoilState(isEditableState);
  const [targetFile, setTargetFile] = useRecoilState(targetFileState);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const handleEditable = () => {
    editor.isEditable() ? editor.setEditable(false) : editor.setEditable(true);
    // setIsEditable(!isEditable);
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
      className={`component-preview flex w-full items-center justify-center font-sans`}
    >
      <TextModal
        header="ヘルプ"
        body={
          <div className="prose text-sm">
            <h3 className="text-base font-bold">ツールバー</h3>
            <p>
              ウィンドウ上部にカーソルをホバーすると出現します。下のサンプルでそれぞれの機能を確認できます。
            </p>
            <div>
              <WindowMockup
                frameColor="base-200"
                backgroundColor="base-100"
                border={true}
              >
                <div className="component-preview flex w-full items-center justify-center px-10 py-2 font-sans">
                  <Navbar className="min-h-[1rem] gap-0.5 border-b-2 border-b-base-200">
                    <div className="flex flex-1 justify-start gap-1">
                      <div
                        className="tooltip-hover tooltip text-xs"
                        data-tip="設定・ファイル"
                      >
                        <Button shape="square" size="xs" color="ghost">
                          <Svg.Bars className="inline-block h-4 w-4 fill-current stroke-current" />
                        </Button>
                      </div>
                      <div
                        className="tooltip-hover tooltip"
                        data-tip="元に戻す"
                      >
                        <Button shape="square" size="xs" color="ghost">
                          <Svg.Undo className="inline-block h-4 w-4 fill-current stroke-current" />
                        </Button>
                      </div>
                      <div
                        className="tooltip-hover tooltip"
                        data-tip="やり直し"
                      >
                        <Button shape="square" size="xs" color="ghost">
                          <Svg.Redo className="inline-block h-4 w-4 fill-current stroke-current" />
                        </Button>
                      </div>
                      <div
                        className="tooltip-hover tooltip"
                        data-tip="編集/閲覧切り替え"
                      >
                        <Swap
                          rotate={true}
                          offElement={
                            <Svg.Pen className="h-4 w-4 fill-current" />
                          }
                          onElement={
                            <Svg.EyeOpen className="h-4 w-4 fill-current" />
                          }
                          className="h-6 w-6"
                        />
                      </div>
                    </div>
                    <div
                      className="tooltip-hover tooltip flex flex-1 justify-center"
                      data-tip="ファイル名"
                    >
                      file.txt
                    </div>
                    <div className="flex flex-1 justify-end">
                      <div className="tooltip-hover tooltip" data-tip="情報">
                        <Button shape="square" size="xs" color="ghost">
                          <Svg.Ellipsis className="inline-block h-4 w-4 fill-current stroke-current" />
                        </Button>
                      </div>
                    </div>
                  </Navbar>
                </div>
              </WindowMockup>
            </div>
            <h3 className="text-base font-bold">キーバインド</h3>
            <div className="flex place-content-center">
              <Table className="w-full">
                <Table.Head>
                  <span>キー</span>
                  <span>機能</span>
                </Table.Head>
                <Table.Body>
                  <Table.Row>
                    <span>
                      <Kbd>Ctrl</Kbd> + <Kbd>S</Kbd>
                    </span>
                    <span>保存</span>
                  </Table.Row>
                </Table.Body>
              </Table>
            </div>
          </div>
        }
        open={isHelpOpen}
        onClick={() => setIsHelpOpen(!isHelpOpen)}
      />

      <Navbar className="min-h-[3rem] gap-2 border-b-2 border-b-base-200 opacity-0 transition-opacity duration-1000 ease-out hover:opacity-100">
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
              onChange={handleEditable}
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
                <Dropdown.Item onClick={() => setIsHelpOpen(!isHelpOpen)}>
                  <Svg.Question className="inline-block h-4 w-4 fill-current" />
                  ヘルプ
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={async () => {
                    const name = await getName();
                    const version = await getVersion();
                    const tauriVersion = await getTauriVersion();
                    const platformName = await platform();
                    const archName = await arch();
                    return await message(
                      `Version: ${version}\nTauri version: ${tauriVersion}\nPlatform: ${platformName} (${archName})\n\n© 2022- haxibami`,
                      {
                        title: name,
                      }
                    );
                  }}
                >
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
