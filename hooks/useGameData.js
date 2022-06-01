import React, {useState} from "react";

export default function useGameData() {
    const [gameInfo, setGameInfo] = useState({
        gamers: [{
            id: undefined,
            nickname: undefined,
            numberOfCards: undefined,
        }],
        cards: undefined,
        roomInfo: undefined,
    });

    return {
        gameInfo,
        setGameInfo
    }
}
