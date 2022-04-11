import {useEffect} from 'react';
import {discardCards} from "../apis/unoCard";

export default function useDiscardCards({
                                            data, setData, roomCode, discardCardsMessage
                                        }) {

    useEffect(() => {
        if (discardCardsMessage === null) {
            return;
        }
        let cards = data.splice(0);
        if (cards.length > 9) {
            cards.pop();
        }
        cards.push(discardCardsMessage);
        setData(cards);
    }, [discardCardsMessage])

    useEffect(() => {
        if (roomCode === undefined) return;
        discardCards({roomCode: roomCode}).then((response) => {
            if (response) {
                setData(response.data.reverse());
            } else {
                setData([]);
            }
        })
    }, [roomCode]);

    return data;
}
