import {useEffect} from 'react';
import {discardCards} from "../apis/unoCard";

export default function useDiscardCards({
                                            data, setData, roomCode, discardCardsMessage
                                        }) {

    useEffect(() => {
        if (discardCardsMessage === null) {
            return;
        }
        let cards = data.concat();
        if (cards.length > 5) {
            cards.pop();
        }
        cards.push(discardCardsMessage);
        setData(cards);
    }, [discardCardsMessage])

    useEffect(() => {
        if (roomCode === undefined) return;
        discardCards({roomCode: roomCode}).then((response) => {
            if (response) {
                setData(response.data.splice(0, 5).reverse());
            } else {
                setData([]);
            }
        })
    }, [roomCode]);

    return data;
}
