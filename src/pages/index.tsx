import { type NextPage } from "next";
import Head from "next/head";
import Player from "~/components/Player";
import { useEffect, useMemo } from "react";
import React from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import usePlayers from "~/utils/usePlayers";
import Keyboard from "~/components/Keyboard";
import Header from "~/components/Header";

const Home: NextPage = () => {
  const [playersList] = useAutoAnimate({
    duration: 200,
  });

  const {
    playersLength,
    players,
    reset,
    setPlayer,
    addPlayer,
    setSelectedPlayer,
    selectedPlayer,
    playersCount,
    setPlayerPoints,
  } = usePlayers();

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
        <title>PointTool</title>
        <meta
          name="description"
          content="App for counting points in 1000 card game"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen max-h-screen flex-col items-center">
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
