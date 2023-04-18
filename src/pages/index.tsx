import { type NextPage } from "next";
import Head from "next/head";
import { GoArrowDown, GoArrowUp, GoPlus } from "react-icons/go";
import Player from "~/components/Player";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import React from "react";
import { z } from "zod";
import { BiReset } from "react-icons/bi";
import { useAutoAnimate } from "@formkit/auto-animate/react";

const playerSchema = z.object({
  place: z.number(),
  id: z.number(),
  name: z.string(),
  points: z.number(),
  history: z.array(z.number()),
  bomb: z.boolean(),
});

export type PlayerType = z.infer<typeof playerSchema>;
const Home: NextPage = () => {
  const [players, setPlayers] = useState<PlayerType[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState(0);
  const playersCount = useMemo(() => players.length, [players]);
  const [playersList] = useAutoAnimate({
    duration: 200,
  });

  useEffect(() => {
    if (players.length !== 0) {
      localStorage.setItem("players", JSON.stringify(players));
    }
  }, [players]);

  useEffect(() => {
    const dataString = localStorage.getItem("players");
    if (dataString) {
      const data: unknown = JSON.parse(dataString);
      const parsed = z.array(playerSchema).safeParse(data);
      if (parsed.success) {
        setPlayers(parsed.data);
      } else {
        console.error(parsed.error);
        localStorage.removeItem("players");
      }
    }
  }, []);

  function setPlayer(player: PlayerType, playerIndex?: number) {
    setPlayers((prev) => {
      const arr = [...prev];
      const index = playerIndex || prev.findIndex((p) => p.id === player.id);
      arr[index] = player;
      return arr;
    });
    countPlaces();
  }

  const countPlaces = useCallback(() => {
    setPlayers((prev) => {
      const arr = [...prev];
      const sorted = [...arr].sort((a, b) => b.points - a.points);
      sorted.forEach((p, index) => {
        const value = arr[arr.findIndex((a) => a.id === p.id)];
        if (!value) return;
        value.place = index + 1;
      });
      return arr;
    });
  }, []);

  const addPlayer = useCallback(() => {
    const player: PlayerType = {
      place: 0,
      id: players.length + 1,
      name: "",
      points: 0,
      history: [],
      bomb: false,
    };
    setPlayers((prev) => [...prev, player]);
  }, [players.length]);

  const focusNextPlayer = useCallback(() => {
    if (selectedPlayer === players.length - 1) {
      setSelectedPlayer(0);
      return;
    }
    setSelectedPlayer(selectedPlayer + 1);
  }, [players.length, selectedPlayer]);

  const setPlayerPoints = useCallback(
    (p: string) => {
      if (p === "") {
        focusNextPlayer();
        return;
      }
      setPlayers((prev) => {
        const arr = [...prev];
        const player = arr[selectedPlayer];
        if (!player) return arr;
        const newPlayer = {
          ...player,
          points: player.points + parseInt(p),
          history: [...player.history, parseInt(p)],
        };
        arr[selectedPlayer] = newPlayer;
        return arr;
      });
      countPlaces();
      return focusNextPlayer();
    },
    [focusNextPlayer, selectedPlayer, countPlaces]
  );

  const playersLength = players.length;
  const playersInputRefs = useMemo(() => {
    return Array.from({ length: playersLength }, () =>
      React.createRef<HTMLInputElement>()
    );
  }, [playersLength]);

  useEffect(() => {
    playersInputRefs[playersLength - 1]?.current?.focus();
  }, [playersInputRefs, playersLength]);

  const reset = useCallback(() => {
    localStorage.removeItem("players");
    setPlayers([]);
  }, []);

  return (
    <>
      <Head>
        <title>PunkTool</title>
        <meta
          name="description"
          content="App for counting points in 1000 card game"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center">
        <Header reset={reset} addPlayer={addPlayer} />
        <div className={"flex w-full flex-col items-center p-3"}>
          <div className={"w-full justify-between"} ref={playersList}>
            {players.map((player, index) => (
              <Player
                ref={playersInputRefs[index]}
                selected={selectedPlayer === index}
                key={player.id}
                setPlayer={setPlayer}
                player={player}
                select={() => setSelectedPlayer(index)}
              />
            ))}
          </div>
          <Keyboard
            setPlayerPoints={setPlayerPoints}
            active={playersCount !== 0}
          />
        </div>
      </main>
    </>
  );
};

export default Home;

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
          className={`fixed bottom-0 w-screen rounded-t-2xl  bg-white p-3 shadow-2xl transition-transform duration-300 ${
            showKeybord ? "" : "translate-y-80"
          }`}
        >
          <div className="flex w-full items-center">
            <span className="h-10 w-full text-center text-3xl">{points}</span>
            <button onClick={() => setShowKeyboard((v) => !v)} aria-label="hide keyboard" className="absolute right-3">
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

type HeaderType = {
  reset: () => void;
  addPlayer: () => void;
};
const Header: React.FC<HeaderType> = memo(({ reset, addPlayer }) => {
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
      PunkTool
      <div>
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
