import {
	createContext,
	PropsWithChildren,
	useCallback,
	useEffect,
	useMemo,
	useState,
	useContext,
} from "react";
import { z } from "zod";
import useGameSettings from "./useGameSettings";

const playerSchema = z.object({
	place: z.number(),
	id: z.number(),
	name: z.string(),
	points: z.number(),
	history: z.array(
		z.object({
			index: z.number(),
			points: z.number(),
		})
	),
	bomb: z.boolean(),
});

export type PlayerType = z.infer<typeof playerSchema>;

const usePlayersInit = () => {
	const [editMode, setEditMode] = useState(false);
	const [players, setPlayers] = useState<PlayerType[]>([]);
	const [selectedPlayer, setSelectedPlayer] = useState(0);
	const playersCount = useMemo(() => players.length, [players]);

	const { rankMode, gameMode, defaultPoints } = useGameSettings();

	/**
	 * Zapisuje w localstorage zmiany w graczach po zmianie danych
	 */
	useEffect(() => {
		if (players.length !== 0) {
			localStorage.setItem("players", JSON.stringify(players));
		}
	}, [players]);

	/**
	 * Przywraca z localstorage graczy po odświeżeniu strony
	 */
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

	/**
	 * Ustawia dane jednego gracza
	 */
	function setPlayer(player: PlayerType, playerIndex?: number) {
		setPlayers((prev) => {
			const arr = [...prev];
			const index = playerIndex || prev.findIndex((p) => p.id === player.id);
			arr[index] = player;
			return arr;
		});
		countPlaces();
	}

	/**
	 * Przelicza miejsca graczy po zmianie punktów
	 */
	const countPlaces = useCallback(() => {
		setPlayers((prev) => {
			const arr = [...prev];
			const sorted = [...arr].sort((a, b) => b.points - a.points);

			if (rankMode === "reverse") {
				sorted.reverse();
			}

			sorted.forEach((p, index) => {
				const value = arr[arr.findIndex((a) => a.id === p.id)];
				if (!value) return;
				value.place = index + 1;
			});
			return arr;
		});
	}, [rankMode]);

	useEffect(() => {
		countPlaces();
	}, [rankMode]);

	/**
	 * dodaje nowego gracza do listy
	 */
	const addPlayer = useCallback(() => {
		const player: PlayerType = {
			place: 0,
			id: players.length + 1,
			name: "",
			points: defaultPoints,
			history: [],
			bomb: false,
		};
		setPlayers((prev) => [...prev, player]);
	}, [players.length]);

	/**
	 * Usuwanie gracza z listy
	 */
	const removePlayer = useCallback((index: number) => {
		setPlayers((prev) => {
			const arr = [...prev];
			arr.splice(index, 1);
			return arr;
		});
	}, []);

	/**
	 * Przeniesieniei gracza do góry
	 */
	const movePlayerUp = useCallback((index: number) => {
		setPlayers((prev) => {
			const arr = [...prev];
			const player = arr[index];
			const prevPlayer = arr[index - 1];
			if (!prevPlayer || !player) return arr;
			arr[index] = prevPlayer;
			arr[index - 1] = player;
			setSelectedPlayer(index - 1);
			return arr;
		});
	}, []);

	/**
	 * Przeniesieniei gracza w dół
	 */
	const movePlayerDown = useCallback((index: number) => {
		setPlayers((prev) => {
			const arr = [...prev];
			const player = arr[index];
			const nextPlayerPlayer = arr[index + 1];
			if (!nextPlayerPlayer || !player) return arr;
			arr[index] = nextPlayerPlayer;
			arr[index + 1] = player;
			setSelectedPlayer(index + 1);
			return arr;
		});
	}, []);

	/**
	 * zaznacza kolejnego gracza z listy
	 */
	const focusNextPlayer = useCallback(() => {
		if (selectedPlayer === players.length - 1) {
			setSelectedPlayer(0);
			return;
		}
		setSelectedPlayer(selectedPlayer + 1);
	}, [players.length, selectedPlayer]);

	/**
	 * ustawia punkty zaznaczonemu graczowi
	 */
	const setPlayerPoints = useCallback(
		(p: string) => {
			if (p === "") {
				focusNextPlayer();
				return;
			}

			if (gameMode === "darts") {
				p = (parseInt(p) * -1).toString();
			}

			setPlayers((prev) => {
				const arr = [...prev];
				const player = arr[selectedPlayer];
				if (!player) return arr;
				const newPlayer = {
					...player,
					points: player.points + parseInt(p),
					history: [
						{
							index: player.history.length,
							points: parseInt(p),
						},
						...player.history,
					],
				};
				arr[selectedPlayer] = newPlayer;
				return arr;
			});
			countPlaces();
			return focusNextPlayer();
		},
		[focusNextPlayer, selectedPlayer, countPlaces, gameMode]
	);

	const playersLength = players.length;

	const reset = useCallback(() => {
		localStorage.removeItem("players");
		setPlayers([]);
	}, []);

	return {
		players,
		playersLength,
		playersCount,
		addPlayer,
		removePlayer,
		setPlayer,
		movePlayerUp,
		movePlayerDown,
		selectedPlayer,
		setSelectedPlayer,
		setPlayerPoints,
		reset,
		editMode,
		setEditMode,
	};
};

const PlayersContext = createContext<ReturnType<typeof usePlayersInit>>(null!);
const usePlayers = () => useContext(PlayersContext);

export const PlayersProvider: React.FC<PropsWithChildren> = ({ children }) => {
	const value = usePlayersInit();
	return (
		<PlayersContext.Provider value={value}>{children}</PlayersContext.Provider>
	);
};

export default usePlayers;
