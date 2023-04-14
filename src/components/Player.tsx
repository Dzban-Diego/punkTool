import React from "react";
import { BiBomb } from "react-icons/bi";
import { FaBomb } from "react-icons/fa";
import { type PlayerType } from "~/pages";

type Props = {
  setPlayer: (player: PlayerType) => void;
  player: PlayerType;
  selected: boolean;
  selectNextPlayer: () => void;
};

export const Player: React.FC<Props> = ({
  player,
  setPlayer,
  selected,
  selectNextPlayer,
}) => {
  function handlePlayerNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPlayer({ ...player, name: e.target.value });
  }

  function handlePlayerBombChange() {
    setPlayer({ ...player, bomb: !player.bomb });
  }

  return (
    <div
      onClick={selectNextPlayer}
      className={`flex rounded border-2 border-white p-3 ${
        selected && "bg-pink-200"
      }`}
    >
      <input
        className={`rounded text-xl ${selected && "bg-pink-200"}`}
        value={player.name}
        onChange={handlePlayerNameChange}
      />
      <h3>{player.points}</h3>
      <button type="button" onClick={handlePlayerBombChange}>
        {player.bomb ? <FaBomb /> : <BiBomb />}
      </button>
    </div>
  );
};
