import React from 'react';
import styles from './discardCards.module.css';
import useDiscardCards from "../../hooks/useDiscardCards";
import DiscardCard from "./discardCard";

export default function DiscardCards({discardCardsMessage, roomCode, data, setData}) {
    const cards = useDiscardCards({
        discardCardsMessage: discardCardsMessage,
        data: data,
        setData: setData,
        roomCode: roomCode
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
