import React from 'react';
import styles from './myCards.module.css';
import useMyCards from "../../hooks/useMyCards";
import Card from "./card";

export default function MyCards({drawCardMessage, roomCode, discards, setDiscards}) {
    const cards = useMyCards({
        drawCardMessage: drawCardMessage,
        roomCode: roomCode
    });

    return <div className={styles.container}>
        <div className={styles.innerContainer}>
            {
                cards.data.map((one, index) => <Card
                    key={index}
                    roomCode={roomCode}
                    card={one}
                    data={cards.data}
                    setData={cards.setData}
                    discards={discards}
                    setDiscards={setDiscards}
                />)
            }
        </div>
    </div>;
}
