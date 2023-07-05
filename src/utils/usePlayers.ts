import { useCallback, useEffect, useMemo, useState } from "react";
import { z } from "zod";

const playerSchema = z.object({
	place: z.number(),
	id: z.number(),
	name: z.string(),
	points: z.number(),
	history: z.array(z.number()),
	bomb: z.boolean(),
});

export type PlayerType = z.infer<typeof playerSchema>;

const usePlayers = () => {
	const [players, setPlayers] = useState<PlayerType[]>([]);
	const [selectedPlayer, setSelectedPlayer] = useState(0);
	const playersCount = useMemo(() => players.length, [players]);

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
			const index =
				playerIndex || prev.findIndex((p) => p.id === player.id);
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
			sorted.forEach((p, index) => {
				const value = arr[arr.findIndex((a) => a.id === p.id)];
				if (!value) return;
				value.place = index + 1;
			});
			return arr;
		});
	}, []);

	/**
	 * dodaje nowego gracza do listy
	 */
	const addPlayer = useCallback(() => {
		const player: PlayerType = {
			place: 0,
			id: players.length + 1,
			name: "",
			points: 0,
			history: [],
			bomb: false,
		};
		setPlayers((prev) => [...prev, player]);
	}, [players.length]);

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
			setPlayers((prev) => {
				const arr = [...prev];
				const player = arr[selectedPlayer];
				if (!player) return arr;
				const newPlayer = {
					...player,
					points: player.points + parseInt(p),
					history: [...player.history, parseInt(p)],
				};
				arr[selectedPlayer] = newPlayer;
				return arr;
			});
			countPlaces();
			return focusNextPlayer();
		},
		[focusNextPlayer, selectedPlayer, countPlaces]
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
		setPlayer,
		selectedPlayer,
		setSelectedPlayer,
		setPlayerPoints,
		reset,
	};
};

export default usePlayers;
