import { type NextPage } from "next";
import Head from "next/head";
import { GoArrowDown, GoArrowUp, GoPlus } from "react-icons/go";
import { Player } from "~/components/Player";
import { useEffect, useMemo, useState } from "react";
import React from "react";

export type PlayerType = {
  place: number;
  id: number;
  name: string;
  points: number;
  history: number[];
  bomb: boolean;
};

const Home: NextPage = () => {
  const [players, setPlayers] = useState<PlayerType[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState(0);
  const [points, setPoints] = useState("");
  const [showKeybord, setShowKeyboard] = useState(true);

  function setPlayer(player: PlayerType, playerIndex?: number) {
    setPlayers((prev) => {
      const arr = [...prev];
      const index = playerIndex || prev.findIndex((p) => p.id === player.id);
      arr[index] = player;
      const sorted = [...arr].sort((a, b) => b.points - a.points);
      sorted.forEach((p, index) => {
        arr[arr.findIndex((a) => a.id === p.id)]!.place = index + 1;
      });
      return arr;
    });
  }

  function addPlayer() {
    const player: PlayerType = {
      place: 0,
      id: players.length + 1,
      name: "",
      points: 0,
      history: [],
      bomb: false,
    };
    setPlayers((prev) => [...prev, player]);
  }

  function focusNextPlayer() {
    if (selectedPlayer === players.length - 1) {
      setSelectedPlayer(0);
      return;
    }
    setSelectedPlayer(selectedPlayer + 1);
  }

  function handlePointsChange(v: number | string) {
    if (v === "<") {
      setPoints(points.slice(0, -1));
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
    setPoints(`${points}${v}`);
  }

  function setPlayerPoints(p: string) {
    if (p === "") {
      focusNextPlayer();
      return;
    }
    const player = players[selectedPlayer]!;
    console.log(player);
    const newPlayer = {
      ...player,
      points: player.points + parseInt(p),
      history: [...player.history, parseInt(p)],
    };
    setPlayer(newPlayer);
    setPoints("");
    return focusNextPlayer();
  }

  const playersLength = players.length;
  const playersInputRefs = useMemo(() => {
    return Array.from({ length: playersLength }, () =>
      React.createRef<HTMLInputElement>()
    );
  }, [playersLength]);

  useEffect(() => {
    playersInputRefs[playersLength - 1]?.current?.focus();
  }, [playersInputRefs, playersLength]);

  return (
    <>
      <Head>
        <title>YtKnUp</title>
        <meta
          name="description"
          content="App for counting points in 1000 card game"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center">
        <div className={"flex w-full flex-col items-center p-3"}>
          <h1
            className={
              "mx-3 flex w-full justify-between border-b-2 border-b-black p-3 align-middle text-3xl"
            }
          >
            YtKnUp
            <button onClick={addPlayer}>
              <GoPlus />
            </button>
          </h1>
          <div className={"w-full justify-between"}>
            {players.map((player, index) => (
              <Player
                ref={playersInputRefs[index]}
                selected={selectedPlayer === index}
                key={player.id}
                setPlayer={setPlayer}
                player={player}
                selectNextPlayer={focusNextPlayer}
              />
            ))}
          </div>
          <div className="fixed  bottom-0 w-screen rounded-t-2xl bg-white p-3 shadow-2xl">
            <div className="flex w-full items-center">
              <span className="h-10 w-full text-center text-3xl">{points}</span>
              <button onClick={() => setShowKeyboard((v) => !v)}>
                {showKeybord ? (
                  <GoArrowDown size={30} />
                ) : (
                  <GoArrowUp size={30} />
                )}
              </button>
            </div>
            {showKeybord && (
              <>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, "-", 0, "<"].map((i) => (
                    <button
                      key={i}
                      className="h-12 rounded bg-black text-white"
                      onClick={() => handlePointsChange(i)}
                    >
                      {i}
                    </button>
                  ))}
                </div>
                <button
                  className="mt-3 h-12 w-full rounded bg-primary text-black"
                  onClick={() => setPlayerPoints(points)}
                >
                  OK
                </button>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
