import React, {useContext} from 'react';
import styles from './myCards.module.css';
import useMyCards from "../../hooks/useMyCards";
import Card from "./card";
import {SSEContext} from "../../pages/room/components/roomSSE";
import {GameContext} from "../../pages/room/components/roomDetail";

export default function MyCards() {
    const {sseState, sseDispatch} = useContext(SSEContext);
    const {state, dispatch} = useContext(GameContext);

    const cards = useMyCards({
        drawCardMessage: sseState.drawCardMessage,
        roomCode: sseState.roomCode
    });

    return <div className={styles.container}>
        <div className={styles.innerContainer}>
            {
                cards.data.map((one, index) => <Card
                    key={index}
                    serviceInstanceId={sseState.serviceInstanceId}
                    roomCode={sseState.roomCode}
                    card={one}
                    data={cards.data}
                    setData={cards.setData}
                />)
            }
        </div>
    </div>;
}
