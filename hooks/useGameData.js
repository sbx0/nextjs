import React, {useState} from "react";

export default function useGameData() {
    const [roomInfo, setRoomInfo] = useState({});
    const [currentGamer, setCurrentGamer] = useState({});
    const [gamers, setGamers] = useState([]);
    const [cards, setCards] = useState([]);
    const [discards, setDiscards] = useState([]);

    return {
        roomInfo,
        setRoomInfo,
        currentGamer,
        setCurrentGamer,
        gamers,
        setGamers,
        cards,
        setCards,
        discards,
        setDiscards
    }
}
