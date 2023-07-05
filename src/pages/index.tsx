import { type NextPage } from "next";
import Head from "next/head";
import Player from "~/components/Player";
import { useEffect, useMemo, useState } from "react";
import React from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import usePlayers from "~/utils/usePlayers";
import Keyboard from "~/components/Keyboard";
import Header from "~/components/Header";

const Home: NextPage = () => {
  const [edit, setEdit] = useState(false);
  const [playersList] = useAutoAnimate({
    duration: 200,
  });

  const {
    playersLength,
    players,
    reset,
    setPlayer,
    addPlayer,
    movePlayerUp,
    movePlayerDown,
    setSelectedPlayer,
    selectedPlayer,
    playersCount,
    setPlayerPoints,
    removePlayer,
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
          content="To ta apka do liczenia punktów"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex max-h-screen min-h-screen flex-col items-center">
        <Header
          reset={reset}
          addPlayer={addPlayer}
          edit={edit}
          setEdit={setEdit}
        />
        <div className={"flex flex-col overflow-scroll p-3 w-full"}>
          <div className={"w-full justify-between"} ref={playersList}>
            {players.map((player, index) => (
              <Player
                ref={playersInputRefs[index]}
                selected={selectedPlayer === index}
                key={player.id}
                setPlayer={setPlayer}
                player={player}
                select={() => setSelectedPlayer(index)}
                remove={() => removePlayer(index)}
                edit={edit}
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
