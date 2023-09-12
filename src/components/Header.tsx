import Link from "next/link";
import { useRouter } from "next/router";
import React, { memo, useState } from "react";
import { BiReset } from "react-icons/bi";
import { GoPencil, GoPlus } from "react-icons/go";
import { RiSettings4Fill } from "react-icons/ri";
import usePlayersInit from "~/utils/usePlayers";

const Header: React.FC = memo(() => {
  const router = useRouter();
  const [enableReset, setEnableReset] = useState(false);
  const { reset, editMode, setEditMode, addPlayer } = usePlayersInit();

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
      <Link href="/">PointTool</Link>
      <div>
        <button
          className="mx-3"
          onClick={() => router.push("/settings")}
          aria-label="settings"
        >
          <RiSettings4Fill
            size={30}
            color={editMode ? "red" : "black"}
            className={"transition-colors"}
          />
        </button>
        <button
          className="mx-3"
          onClick={() => setEditMode?.(!editMode)}
          aria-label="reset"
        >
          <GoPencil
            size={30}
            color={editMode ? "red" : "black"}
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
});

Header.displayName = "Header";

export default Header;
