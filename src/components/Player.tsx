import React, { forwardRef } from "react";
import { BiBomb } from "react-icons/bi";
import { FaBomb } from "react-icons/fa";
import { type PlayerType } from "~/pages";

type Props = {
  setPlayer: (player: PlayerType) => void;
  player: PlayerType;
  selected: boolean;
  selectNextPlayer: () => void;
};

type Ref = HTMLInputElement;

export const Player = forwardRef<Ref, Props>(
  ({ player, setPlayer, selected, selectNextPlayer }, ref) => {
    function handlePlayerNameChange(e: React.ChangeEvent<HTMLInputElement>) {
      setPlayer({ ...player, name: e.target.value });
    }

    function handlePlayerBombChange() {
      setPlayer({ ...player, bomb: !player.bomb });
    }

    return (
      <div
        onClick={selectNextPlayer}
        className={`my-2 shadow flex rounded border-2  p-3 text-xl ${
          selected ? "bg-primary border-primary" : "bg-white border-white"
        }`}
      >
        <h3>{player.place.toString()}</h3>
        <input
          ref={ref}
          placeholder="Kto gra?"
          className={`ml-2 rounded flex-grow ${selected ? "bg-primary" : "bg-white"}`}
          value={player.name}
          onChange={handlePlayerNameChange}
        />
        <h3>{player.points}</h3>
        <button type="button" onClick={handlePlayerBombChange}>
          {player.bomb ? <FaBomb /> : <BiBomb />}
        </button>
      </div>
    );
  }
);
Player.displayName = "Player";
