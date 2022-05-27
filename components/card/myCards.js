import React, {useContext, useEffect} from 'react';
import styles from './myCards.module.css';
import useMyCards from "../../hooks/useMyCards";
import Card from "./card";
import {SSEContext} from "../../pages/room/components/roomSSE";
import {gameActionType, GameContext} from "../../pages/room/components/roomDetail";

export default function MyCards() {
    const {sseState, sseDispatch} = useContext(SSEContext);
    const {state, dispatch} = useContext(GameContext);

    const cards = useMyCards({
        roomCode: sseState?.roomCode,
        roomStatus: state?.roomStatus
    });

    useEffect(() => {
        dispatch({type: gameActionType.initCards, data: cards.data})
    }, [cards.data])

    return <div className={styles.container}>
        <div className={styles.innerContainer}>
            {state?.cards.map((one, index) => <Card
                key={index}
                roomCode={sseState?.roomCode}
                card={one}
                data={cards.data}
                setData={cards.setData}
            />)}
        </div>
    </div>;
}
