import { type NextPage } from "next";
import Head from "next/head";
import Player from "~/components/Player";
import { useEffect, useMemo } from "react";
import React from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import usePlayersInit from "~/utils/usePlayers";
import Keyboard from "~/components/Keyboard";
import Header from "~/components/Header";

const Home: NextPage = () => {
  const [playersList] = useAutoAnimate({
    duration: 200,
  });

  const {
    playersLength,
    players,
    setPlayer,
    movePlayerUp,
    movePlayerDown,
    setSelectedPlayer,
    selectedPlayer,
    playersCount,
    setPlayerPoints,
    removePlayer,
    editMode,
  } = usePlayersInit();

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
      <main className="flex max-h-screen min-h-screen flex-col items-center">
        <Header />
        <div className={"flex w-full flex-col overflow-scroll p-3"}>
          <div className={"w-full justify-between"} ref={playersList}>
            {players.map((player, index) => (
              <Player
                ref={playersInputRefs[index]}
                selected={selectedPlayer === index}
                key={player.id}
                setPlayer={setPlayer}
                player={player}
                edit={editMode}
                select={() => setSelectedPlayer(index)}
                remove={() => removePlayer(index)}
                moveUp={() => movePlayerUp(index)}
                moveDown={() => movePlayerDown(index)}
              />
            ))}
            <div className="h-80" />
            <div className="h-20" />
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
