import React, {
  forwardRef,
  useImperativeHandle,
  useInsertionEffect,
  useRef,
} from "react";
import { BiBomb } from "react-icons/bi";
import { FaBomb } from "react-icons/fa";
import { type PlayerType } from "~/pages";

type Props = {
  setPlayer: (player: PlayerType) => void;
  player: PlayerType;
  goToNextPlayer: () => void;
};

type Ref = {
  focus: () => void;
};

export const Player = forwardRef<Ref, Props>(
  ({ player, setPlayer, goToNextPlayer }, ref) => {
    const pointsInput = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    useImperativeHandle(ref, () => {
      return {
        focus: () => {
          pointsInput.current?.focus();
        },
      };
    });

    function handlePlayerNameChange(e: React.ChangeEvent<HTMLInputElement>) {
      e.preventDefault();
      setPlayer({ ...player, name: e.target.value });
    }

    function handlePlayerPointsChange(value: number) {
      setPlayer({ ...player, points: player.points + value });
      goToNextPlayer();
    }

    function handlePlayerBombChange() {
      setPlayer({ ...player, bomb: !player.bomb });
    }

    const pointsButtons = [100, -100, 10, -10, 20, -20, 50, -50];

    function clickPress(event: React.KeyboardEvent<HTMLInputElement>) {
      if (event.key === "Enter") {
        handlePlayerPointsChange(Number(pointsInput.current?.value));
        event.preventDefault();
        formRef.current?.reset();
        goToNextPlayer();
      }
    }

    return (
      <form className={"mx-2 rounded border-2 border-white p-3"} ref={formRef}>
        <input value={player.name} onChange={handlePlayerNameChange} />
        <h3>{player.points}</h3>
        <input
          type="number"
          ref={pointsInput}
          onKeyDown={clickPress}
          pattern="^\d{2}-\d{3}$"
        />
        <button
          type="button"
          onClick={() =>
            handlePlayerPointsChange(Number(pointsInput.current?.value))
          }
        >
          Ustaw
        </button>
        {pointsButtons.map((value) => (
          <button type="button" onClick={() => handlePlayerPointsChange(value)}>
            {value}
          </button>
        ))}
        <button type="button" onClick={handlePlayerBombChange}>
          {player.bomb ? <FaBomb /> : <BiBomb />}
        </button>
      </form>
    );
  }
);
