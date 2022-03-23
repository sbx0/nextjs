import React, {useState} from 'react';
import styles from './myCards.module.css';
import useMyCards from "../../hooks/useMyCards";
import Card from "./card";

export default function MyCards({roomCode, flag, setFlag}) {
    const [data, setData] = useState([]);
    const cards = useMyCards({
        data: data,
        setData: setData,
        roomCode: roomCode,
        flag: flag
    });

    return <div className={styles.container}>
        {
            cards.map((one, index) => <Card
                key={index}
                roomCode={roomCode}
                card={one}
                flag={flag}
                setFlag={setFlag}
                data={data}
                setData={setData}
            />)
        }
    </div>;
}
