import { type NextPage } from "next";
import Head from "next/head";
import { GoPlus } from "react-icons/go";
import { Player } from "~/components/Player";
import { useEffect, useMemo, useState } from "react";
import React from "react";

export type PlayerType = {
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

  const playersLength = useMemo(() => players.length, [players]);
  useEffect(() => {
    console.log("playersLength", playersLength);
  }, [playersLength]);

  const playersRefs = useMemo(() => {
    const arr = [];
    for (let i = 0; i < playersLength; i++) {
      arr.push(React.createRef<{ focus: () => void }>());
    }
    return arr;
  }, [playersLength]);

  function setPlayer(player: PlayerType, playerIndex?: number) {
    setPlayers((prev) => {
      const arr = [...prev];
      const index = playerIndex || prev.findIndex((p) => p.id === player.id);
      arr[index] = player;
      return arr;
    });
  }

  function addPlayer() {
    const player: PlayerType = {
      id: players.length + 1,
      name: "Mietek",
      points: 0,
      history: [],
      bomb: false,
    };
    setPlayers((prev) => [...prev, player]);
  }

  function focusNextPlayer(index: number) {
    if (index === players.length - 1) {
      setSelectedPlayer(0);
      return;
    }
    setSelectedPlayer(index + 1);
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
    const player = players[selectedPlayer]!;
    const newPlayer = {
      ...player,
      points: player.points + parseInt(p),
      history: [...player.history, parseInt(p)],
    };
    setPlayer(newPlayer);
    setPoints("");
    return focusNextPlayer(selectedPlayer);
  }

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
                selected={selectedPlayer === index}
                key={player.id}
                setPlayer={setPlayer}
                player={player}
                selectNextPlayer={() => focusNextPlayer(selectedPlayer)}
              />
            ))}
          </div>
          <div className="fixed  bottom-0 w-screen rounded-t bg-pink-500 p-3">
            <div className="w-full flex items-center">
              <span className="h-10 w-full text-center">{points}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, "-", 0, "<"].map((i) => (
                <button
                  key={i}
                  className=" h-10 rounded bg-black text-white"
                  onClick={() => handlePointsChange(i)}
                >
                  {i}
                </button>
              ))}
            </div>
            <button
              className="mt-3 h-10 w-full rounded bg-black text-white"
              onClick={() => setPlayerPoints(points)}
            >
              OK
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
