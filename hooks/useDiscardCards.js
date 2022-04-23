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
        if (cards.length > 5) {
            cards.pop();
        }
        cards.push(sseState?.discardCardsMessage);
        setData(cards);
        dispatch({type: gameActionType.discards, data: cards})
    }, [sseState?.discardCardsMessage])

    useEffect(() => {
        if (sseState?.roomCode === undefined) return;
        discardCards({roomCode: sseState?.roomCode}).then((response) => {
            if (response) {
                dispatch({type: gameActionType.discards, data: response.data.splice(0, 5).reverse()})
                setData(response.data.splice(0, 5).reverse());
            } else {
                dispatch({type: gameActionType.discards, data: []})
                setData([]);
            }
        })
    }, [sseState?.roomCode]);

    return data;
}
