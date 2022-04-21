import React, {useContext} from 'react';
import styles from './discardCards.module.css';
import useDiscardCards from "../../hooks/useDiscardCards";
import DiscardCard from "./discardCard";
import {SSEContext} from "../../pages/room/roomSSE";

export default function DiscardCards({data, setData}) {
    const {sseState, sseDispatch} = useContext(SSEContext);

    const cards = useDiscardCards({
        roomCode: sseState.roomCode,
        discardCardsMessage: sseState.discardCardsMessage,
        data: data,
        setData: setData
    });

    return <div className={styles.container}>
        <div className={styles.innerContainer}>
            {
                cards.map((one, index) => <DiscardCard
                    key={index}
                    card={one}
                />)
            }
        </div>
    </div>;
}
