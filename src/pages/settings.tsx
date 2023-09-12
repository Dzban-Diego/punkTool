import React from "react";
import Header from "~/components/Header";
import Switch from "~/components/Switch";
import useGameSettings from "~/utils/useGameSettings";

export default function Page() {
  const { rankMode, gameMode, setRankMode, setGameMode } = useGameSettings();

  const gameModeValues: { value: typeof gameMode; label: string }[] = [
    { value: "default", label: "Domyślny" },
    { value: "darts", label: "Lotki" },
    { value: "thousand", label: "Tysiąc" },
  ];

  return (
    <div>
      <Header />
      <main className="p-3">
        <h1 className="text-center text-3xl">Ustawienia gry</h1>
        <div className="row mt-5 flex items-center justify-between">
          <h2 className="text-xl">Tryb gry</h2>
          <select
            onChange={(e) => setGameMode(e.target.value as typeof gameMode)}
            value={gameMode}
          >
            {gameModeValues.map((mode) => (
              <option key={mode.value} value={mode.value}>
                {mode.label}
              </option>
            ))}
          </select>
        </div>
        {gameMode === "default" && (
          <div className="row mt-5 flex items-center justify-between">
            <h2 className="text-xl">Odwróć liczenie rankingu</h2>
            <Switch
              isOn={rankMode === "reverse"}
              handleToggle={() =>
                setRankMode(rankMode === "reverse" ? "default" : "reverse")
              }
            />
          </div>
        )}
      </main>
    </div>
  );
}
