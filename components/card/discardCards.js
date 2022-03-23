import React from 'react';
import styles from './discardCards.module.css';
import useDiscardCards from "../../hooks/useDiscardCards";
import DiscardCard from "./discardCard";

export default function DiscardCards({roomCode, flag, data, setData}) {
    const cards = useDiscardCards({
        data: data,
        setData: setData,
        roomCode: roomCode,
        flag: flag
    });

    return <div className={styles.container}>
        {
            cards.map((one, index) => <DiscardCard
                key={index}
                card={one}
            />)
        }
    </div>;
}
