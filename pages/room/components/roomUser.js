import styles from "./room.module.css";
import React, {useContext} from "react";
import {SSEContext} from "./roomSSE";
import {GameContext} from "./roomDetail";

export default function RoomUser() {
    const {sseState, sseDispatch} = useContext(SSEContext);
    const {state, dispatch} = useContext(GameContext);

    return <>
        <div className={styles.playerContainer}>
            {
                state?.roomUser?.map((one, index) => {
                    return <div key={one.id}
                                className={`${((index + "") === sseState?.whoTurnMessage) ? styles.currentUser : ''} ${styles['player' + index]}`}>
                        <div className={styles.playerName}>{one.nickname}</div>
                        <div className={styles.cardNum}>{one.numberOfCards}</div>
                    </div>
                })
            }
        </div>
    </>
}
