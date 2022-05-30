import React, {useEffect, useState} from "react";

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

    useEffect(() => {
        console.log('gameInfo change ', gameInfo)
    }, [gameInfo])

    return {
        gameInfo,
        setGameInfo
    }
}
