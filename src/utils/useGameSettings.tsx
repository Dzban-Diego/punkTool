import React, { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import { z } from "zod";

const GameModeSchema = z.enum(["thousand", "darts", "default"]);
const RankModeSchema = z.enum(["default", "reverse"]);

type GameMode = z.infer<typeof GameModeSchema>;
type RankMode = z.infer<typeof RankModeSchema>;

function useGameSettingsInit() {
	const [gameMode, setGameMode] = useState<GameMode>("default");
	const [rankMode, setRankMode] = useState<RankMode>("reverse");
	const [defaultPoints, setDefaultPoints] = useState<number>(0);

	useEffect(() => {
		const gameMode = GameModeSchema.safeParse(localStorage.getItem("gameMode"));
		const rankMode = RankModeSchema.safeParse(localStorage.getItem("rankMode"));
		console.log(gameMode, rankMode);

		if (gameMode.success) {
			setGameMode(gameMode.data);
		}

		if (rankMode.success) {
			setRankMode(rankMode.data);
		}
	}, []);

	useEffect(() => {
		localStorage.setItem("gameMode", gameMode);
	}, [gameMode]);

	useEffect(() => {
		localStorage.setItem("rankMode", rankMode);
	}, [rankMode]);

	useEffect(() => {
		if (gameMode === "thousand") {
			setRankMode("default");
			setDefaultPoints(0);
		}
		if (gameMode === "darts") {
			setRankMode("reverse");
			setDefaultPoints(301);
		}
		if (gameMode === "default") {
			setRankMode("default");
			setDefaultPoints(0);
		}
	}, [gameMode]);

	return {
		gameMode,
		setGameMode,
		rankMode,
		setRankMode,
		defaultPoints,
		setDefaultPoints,
	};
}

const GameSettingsContext = React.createContext<
	ReturnType<typeof useGameSettingsInit>
>(null!);
const useGameSettings = () => React.useContext(GameSettingsContext);

export const GameSettingsProvider: React.FC<PropsWithChildren> = ({
	children,
}) => {
	const value = useGameSettingsInit();

	return (
		<GameSettingsContext.Provider value={value}>
			{children}
		</GameSettingsContext.Provider>
	);
};

export default useGameSettings;
