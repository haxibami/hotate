import { Badge } from "react-daisyui";

import { useRecoilState } from "recoil";

import { textLengthState, isLenCountOnState } from "../../store";

const Infobar = () => {
  const [textLength] = useRecoilState(textLengthState);
  const [isLenCountOn] = useRecoilState(isLenCountOnState);
  return (
    <div className="w-full p-5">
      <div>
        <Badge
          color="ghost"
          className={isLenCountOn ? "opacity-100" : "opacity-0"}
        >
          {textLength}
        </Badge>
      </div>
    </div>
  );
};

export default Infobar;
