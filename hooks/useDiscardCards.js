import {useContext, useEffect, useState} from 'react';
import {discardCards} from "../apis/unoCard";
import {gameActionType, GameContext} from "../pages/room/components/roomDetail";
import {SSEContext} from "../pages/room/components/roomSSE";

export default function useDiscardCards() {
    const {sseState, sseDispatch} = useContext(SSEContext);
    const {state, dispatch} = useContext(GameContext);
    const [data, setData] = useState([]);

    useEffect(() => {
        if (sseState?.discardCardsMessage === null) {
            return;
        }
        let cards = data.concat();
        while (cards.length > 5) {
            cards.reverse();
            cards.pop();
        }
        cards.reverse();
        cards.push(sseState?.discardCardsMessage);
        setData(cards);
        dispatch({type: gameActionType.discards, data: cards})
    }, [sseState?.discardCardsMessage])

    useEffect(() => {
        if (sseState?.roomCode === undefined) return;
        discardCards({roomCode: sseState?.roomCode}).then((response) => {
            let d = response.data.reverse();
            if (response.code === '0') {
                dispatch({type: gameActionType.discards, data: d})
                setData(d);
            } else {
                dispatch({type: gameActionType.discards, data: []})
                setData([]);
            }
        })
    }, [sseState?.roomCode]);

    return data;
}
