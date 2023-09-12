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

	useEffect(() => {
		const gameMode = GameModeSchema.safeParse(
			localStorage.getItem("gameMode")
		);
		const rankMode = RankModeSchema.safeParse(
			localStorage.getItem("rankMode")
		);

		if (gameMode.success) {
			setGameMode(gameMode.data);
		}

		if (rankMode.success) {
			setRankMode(rankMode.data);
		}
	}, []);

	useEffect(() => {
		localStorage.setItem("gameMode", gameMode);
		localStorage.setItem("rankMode", rankMode);
	}, [gameMode, rankMode]);

	return {
		gameMode,
		setGameMode,
		rankMode,
		setRankMode,
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
