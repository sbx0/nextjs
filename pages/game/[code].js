import React from "react";
import GameView from "./gameView";
import useGameData from "./useGameData";

export default function Game() {
    const {gameInfo, setGameInfo} = useGameData();
    return <GameView gameInfo={gameInfo} setGameInfo={setGameInfo}/>
}
