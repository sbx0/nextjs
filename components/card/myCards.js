import React, {useEffect, useState} from 'react';
import styles from './myCards.module.css';
import useMyCards from "../../hooks/useMyCards";
import Card from "./card";

export default function MyCards({drawCardMessage, roomCode, flag, setFlag, discards, setDiscards}) {
    const [data, setData] = useState([]);
    const cards = useMyCards({
        data: data,
        setData: setData,
        roomCode: roomCode,
        flag: flag
    });

    useEffect(() => {
        console.log(drawCardMessage)
    }, [drawCardMessage])

    return <div className={styles.container}>
        <div className={styles.innerContainer}>
            {
                cards.map((one, index) => <Card
                    key={index}
                    roomCode={roomCode}
                    card={one}
                    flag={flag}
                    setFlag={setFlag}
                    data={data}
                    setData={setData}
                    discards={discards}
                    setDiscards={setDiscards}
                />)
            }
        </div>
    </div>;
}
