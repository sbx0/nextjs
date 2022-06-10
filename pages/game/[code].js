import React from "react";
import GameView from "../../components/game/gameView";
import useGameData from "../../hooks/useGameData";

export default function Game() {
    const gameData = useGameData();
    return <GameView gameData={gameData}/>
}
