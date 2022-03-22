import React, {useState} from 'react';
import styles from './myCards.module.css';
import useMyCards from "../../hooks/useMyCards";
import Card from "./card";

export default function MyCards({roomCode}) {
    const [flag, setFlag] = useState(false);
    const cards = useMyCards(roomCode, flag);

    return <div className={styles.container}>
        {
            cards.map((one, index) => <Card key={index} card={one}/>)
        }
    </div>;
}
