import { type NextPage } from "next";
import Head from "next/head";
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

  function setPlayer(player: PlayerType) {
    setPlayers((prev) => {
      const arr = [...prev];
      const index = prev.findIndex((p) => p.id === player.id);
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
    if(index === players.length - 1) {
      playersRefs[0]?.current?.focus();
      return;
    }
    playersRefs[index + 1]?.current?.focus();
  }

  return (
    <>
      <Head>
        <title>1000points</title>
        <meta
          name="description"
          content="App for counting points in 1000 card game"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center">
        <div className={"flex flex-col items-center"}>
          <h1 className={"h-20 rounded bg-black p-3 text-3xl text-white"}>
            *1k points Logo*
          </h1>
          <div className={"flex w-full justify-between"}>
            {players.map((player, index) => (
              <Player
                ref={playersRefs[index]}
                key={player.id}
                setPlayer={setPlayer}
                player={player}
                goToNextPlayer={() => focusNextPlayer(index)}
              />
            ))}
          </div>
          <button onClick={addPlayer}>Add Player</button>
        </div>
      </main>
    </>
  );
};

export default Home;
