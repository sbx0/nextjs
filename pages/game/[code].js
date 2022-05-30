import React from "react";
import GameView from "../../components/game/gameView";
import useGameData from "../../hooks/useGameData";

export default function Game() {
    const {gameInfo, setGameInfo} = useGameData();
    return <GameView gameInfo={gameInfo} setGameInfo={setGameInfo}/>
}
