import React, { memo } from "react";
import { useState } from "react";
import { GoArrowUp } from "react-icons/go";

type KeyboardProps = {
  setPlayerPoints: (v: string) => void;
  active: boolean;
};

const Keyboard: React.FC<KeyboardProps> = memo(
  ({ active, setPlayerPoints }) => {
    const [points, setPoints] = useState("");
    const [showKeybord, setShowKeyboard] = useState(true);

    function handlePointsChange(v: number | string) {
      if (v === "<") {
        setPoints(points.slice(0, -1));
        return;
      }
      if (!active) {
        return;
      }
      if (v === "-") {
        if (points[0] === "-") {
          setPoints(points.slice(1));
          return;
        }
        setPoints(`-${points}`);
        return;
      }
      if (v === 0 && (points === "" || points === "-")) {
        return;
      }
      setPoints(`${points}${v}`);
    }

    return (
      <>
        <div
          className={`fixed bottom-0 w-screen rounded-t-2xl right-0 bg-white p-3 shadow-2xl transition-transform duration-300 ${
            showKeybord ? "" : "translate-y-80"
          }`}
        >
          <div className="flex w-full items-center">
            <span className="h-10 w-full text-center text-3xl">{points}</span>
            <button
              onClick={() => setShowKeyboard((v) => !v)}
              aria-label="hide keyboard"
              className="absolute right-3"
            >
              <GoArrowUp
                size={30}
                className={`${
                  showKeybord ? "rotate-180" : ""
                } transition-all  duration-1000`}
              />
            </button>
          </div>
          <div>
            <div className="">
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, "-", 0, "<"].map((i) => (
                  <button
                    key={i}
                    className="h-14 rounded-xl bg-black text-white active:bg-neutral-400"
                    onClick={() => handlePointsChange(i)}
                  >
                    {i}
                  </button>
                ))}
              </div>
              <button
                className="mt-3 h-12 w-full rounded-xl bg-primary text-black active:bg-neutral-400"
                onClick={() => {
                  setPoints("");
                  setPlayerPoints(points);
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
);
Keyboard.displayName = "Keyboard";

export default Keyboard;
