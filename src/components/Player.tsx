import { useAutoAnimate } from "@formkit/auto-animate/react";
import React, {
	forwardRef,
	memo,
	useEffect,
	useImperativeHandle,
	useRef,
} from "react";
import { BiBomb } from "react-icons/bi";
import { FaBomb } from "react-icons/fa";
import { GoArrowDown, GoArrowUp, GoPencil, GoTrashcan } from "react-icons/go";
import useGameSettings from "~/utils/useGameSettings";
import { PlayerType } from "~/utils/usePlayers";

type Props = {
	setPlayer: (player: PlayerType) => void;
	player: PlayerType;
	selected: boolean;
	select: () => void;
	remove: () => void;
	edit: boolean;
	moveUp: () => void;
	moveDown: () => void;
};

type Ref = {
	focus: () => void;
};

const Player = forwardRef<Ref, Props>(
	(
		{
			player,
			setPlayer,
			selected,
			select,
			remove,
			edit: globalEdit,
			moveUp,
			moveDown,
		},
		ref
	) => {
		const inputRef = useRef<HTMLInputElement>(null);
		function handlePlayerNameChange(e: React.ChangeEvent<HTMLInputElement>) {
			setPlayer({ ...player, name: e.target.value });
		}

		const { gameMode } = useGameSettings();

		const [edit, setEdit] = React.useState(false);
		const [historyList] = useAutoAnimate({
			duration: 200,
		});

		useImperativeHandle(ref, () => ({
			focus: startEdit,
		}));

		function handlePlayerBombChange() {
			setPlayer({ ...player, bomb: !player.bomb });
		}

		function startEdit() {
			setEdit(true);
		}

		useEffect(() => {
			inputRef.current?.focus();
		}, [edit]);

		return (
			<div
				onClick={select}
				className={`my-2 w-full rounded border-2 px-3 py-1 text-xl shadow ${
					selected ? "border-primary bg-primary" : "border-white bg-white"
				}`}
			>
				<div className={"flex"}>
					{globalEdit ? (
						<button
							type="button"
							className="mx-1"
							aria-label="edit"
							onClick={remove}
						>
							<GoTrashcan size={30} />
						</button>
					) : null}
					<h2>{player.place.toString()}</h2>
					<input
						ref={inputRef}
						placeholder="Kto gra?"
						onBlur={() => setEdit(false)}
						className={`ml-2 flex-grow rounded disabled:opacity-100 ${
							selected ? "bg-primary" : "bg-white"
						}`}
						value={player.name}
						onChange={handlePlayerNameChange}
						disabled={!edit}
					/>
					<h3>{player.points}</h3>
					{gameMode === "thousand" ? (
						<button
							type="button"
							className="mx-1"
							onClick={handlePlayerBombChange}
							aria-label="bomb"
						>
							{player.bomb ? <FaBomb size={30} /> : <BiBomb size={30} />}
						</button>
					) : null}
					{globalEdit ? (
						<>
							<button
								type="button"
								className="mx-1"
								aria-label="edit"
								onClick={() => {
									void startEdit();
								}}
							>
								<GoPencil size={30} />
							</button>
							<button
								type="button"
								className="mx-1"
								aria-label="edit"
								onClick={moveUp}
							>
								<GoArrowUp size={30} />
							</button>
							<button
								type="button"
								className="mx-1"
								aria-label="edit"
								onClick={moveDown}
							>
								<GoArrowDown size={30} />
							</button>
						</>
					) : null}
				</div>
				<div className="flex text-sm" ref={historyList}>
					{player.history.map((h) => (
						<span className="mr-1" key={h.index}>{`${h.points},`}</span>
					))}
				</div>
			</div>
		);
	}
);

Player.displayName = "Player";

export default memo(Player);
