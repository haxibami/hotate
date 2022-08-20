import { useEffect } from "react";

import { Range, Form, Toggle } from "react-daisyui";

import { useRecoilState } from "recoil";

import {
  lineWordsState,
  lineHeightState,
  fontSizeState,
  isLineNumOnState,
  isLenCountOnState,
  colorModeState,
  isOsColorModeState,
} from "../../store";

const Setting = () => {
  const [lineWords, setLineWords] = useRecoilState(lineWordsState);
  const [lineHeight, setLineHeight] = useRecoilState(lineHeightState);
  const [isLineNumOn, setIsLineNumOn] = useRecoilState(isLineNumOnState);
  const [isLenCountOn, setIsLenCountOn] = useRecoilState(isLenCountOnState);
  const [colorMode, setColorMode] = useRecoilState(colorModeState);
  const [isOsColorMode, setIsOsColorMode] = useRecoilState(isOsColorModeState);
  const [fontSize, setFontSize] = useRecoilState(fontSizeState);

  const handleColorModeChange = () => {
    const newMode = colorMode === "dark" ? "light" : "dark";
    setColorMode(newMode);
  };

  // TODO: support system color mode
  useEffect(() => {
    if (isOsColorMode) {
      document.getElementsByTagName("html")[0].removeAttribute("data-theme");
    } else {
      document
        .getElementsByTagName("html")[0]
        .setAttribute("data-theme", colorMode);
    }
  }, [colorMode, isOsColorMode]);

  return (
    <div className="flex h-full w-80 flex-col gap-8 overflow-y-auto bg-base-100 p-4 text-base-content">
      <div>
        <Form className="rounded bg-base-200 p-2 shadow">
          <Form.Label title="行番号を表示">
            <Toggle
              size="sm"
              checked={isLineNumOn}
              onChange={() => setIsLineNumOn(!isLineNumOn)}
            />
          </Form.Label>
        </Form>
        <Form className="rounded bg-base-200 p-2 shadow">
          <Form.Label title="文字数を表示">
            <Toggle
              size="sm"
              checked={isLenCountOn}
              onChange={() => setIsLenCountOn(!isLenCountOn)}
            />
          </Form.Label>
        </Form>
        <Form className="rounded bg-base-200 p-2 shadow">
          <Form.Label title="OSの既定を使用（Win / Macのみ）">
            <Toggle
              size="sm"
              checked={isOsColorMode}
              onChange={() => setIsOsColorMode(!isOsColorMode)}
            />
          </Form.Label>
        </Form>
        <Form className="rounded bg-base-200 p-2 shadow">
          <Form.Label title="ダークモード">
            <Toggle
              size="sm"
              checked={colorMode === "dark"}
              onChange={handleColorModeChange}
              disabled={isOsColorMode}
            />
          </Form.Label>
        </Form>
      </div>
      <div
        className="tooltip tooltip-bottom tooltip-open"
        data-tip={`${lineWords}`}
      >
        <Range
          min={25}
          max={50}
          type="range"
          value={lineWords}
          size="xs"
          onChange={(e) => setLineWords(parseInt(e.target.value))}
        />
      </div>
      <div
        className="tooltip tooltip-bottom tooltip-open"
        data-tip={`${lineHeight}`}
      >
        <Range
          min={15}
          max={25}
          type="range"
          value={lineHeight * 10}
          size="xs"
          onChange={(e) => setLineHeight(Number(e.target.value) / 10)}
        />
      </div>
      <div
        className="tooltip tooltip-bottom tooltip-open"
        data-tip={`${fontSize}`}
      >
        <Range
          min={5}
          max={15}
          type="range"
          value={fontSize * 10}
          size="xs"
          onChange={(e) => setFontSize(Number(e.target.value) / 10)}
        />
      </div>
    </div>
  );
};

export default Setting;
