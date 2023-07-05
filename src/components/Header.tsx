import React, { memo, useState } from "react";
import { BiReset } from "react-icons/bi";
import { GoPencil, GoPlus } from "react-icons/go";

type HeaderType = {
  reset: () => void;
  addPlayer: () => void;
  edit: boolean;
  setEdit: (v: boolean) => void;
};
const Header: React.FC<HeaderType> = memo(
  ({ reset, addPlayer, setEdit, edit }) => {
    const [enableReset, setEnableReset] = useState(false);

    function handleReset() {
      if (enableReset) {
        reset();
        setEnableReset(false);
        return;
      }
      setEnableReset(true);
      setTimeout(() => {
        setEnableReset(false);
      }, 1000);
    }

    return (
      <h1
        className={
          "mx-3 flex w-full justify-between border-b-2 border-b-black p-3 align-middle text-3xl"
        }
      >
        PointTool
        <div>
          <button
            className="mx-3"
            onClick={() => setEdit(!edit)}
            aria-label="reset"
          >
            <GoPencil
              size={30}
              color={edit ? "red" : "black"}
              className={"transition-colors"}
            />
          </button>
          <button className="mx-3" onClick={handleReset} aria-label="reset">
            <BiReset
              className="transition-colors"
              color={enableReset ? "red" : "black"}
            />
          </button>
          <button onClick={addPlayer} aria-label="add player">
            <GoPlus />
          </button>
        </div>
      </h1>
    );
  }
);

Header.displayName = "Header";

export default Header;
