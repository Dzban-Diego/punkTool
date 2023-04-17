import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { BiBomb } from "react-icons/bi";
import { FaBomb } from "react-icons/fa";
import { GoPencil } from "react-icons/go";
import { type PlayerType } from "~/pages";

type Props = {
  setPlayer: (player: PlayerType) => void;
  player: PlayerType;
  selected: boolean;
  select: () => void;
};

type Ref = {
  focus: () => void;
};

export const Player = forwardRef<Ref, Props>(
  ({ player, setPlayer, selected, select }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    function handlePlayerNameChange(e: React.ChangeEvent<HTMLInputElement>) {
      setPlayer({ ...player, name: e.target.value });
    }
    const [edit, setEdit] = React.useState(false);

    useImperativeHandle(ref, () => ({
      focus: startEdit,
    }));

    function handlePlayerBombChange() {
      setPlayer({ ...player, bomb: !player.bomb });
    }

    function startEdit() {
      setEdit(true);
    }

    useEffect(() => {
      inputRef.current?.focus();
    }, [edit]);

    return (
      <div
        onClick={select}
        className={`my-2 flex rounded border-2 p-3  text-xl shadow ${
          selected ? "border-primary bg-primary" : "border-white bg-white"
        }`}
      >
        <h3>{player.place.toString()}</h3>
        <input
          ref={inputRef}
          placeholder="Kto gra?"
          onBlur={() => setEdit(false)}
          className={`ml-2 flex-grow rounded disabled:opacity-100 ${
            selected ? "bg-primary" : "bg-white"
          }`}
          value={player.name}
          onChange={handlePlayerNameChange}
          disabled={!edit}
        />
        <h3>{player.points}</h3>
        <button type="button" onClick={handlePlayerBombChange}>
          {player.bomb ? <FaBomb /> : <BiBomb />}
        </button>
        <button
          type="button"
          onClick={() => {
            void startEdit();
          }}
        >
          <GoPencil />
        </button>
      </div>
    );
  }
);
Player.displayName = "Player";
