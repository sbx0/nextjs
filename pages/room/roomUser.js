import styles from "./room.module.css";
import React from "react";

export default function RoomUser({roomUser, whoTurnMessage, direction}) {
    return <>
        <div className={`${direction === 'normal' ? styles.normal : styles.reverse}`}>
            <div className={styles.arrowAnim}>
                <div className={styles.arrowSliding}>
                    <div className={styles.arrow}/>
                </div>
                <div className={`${styles.arrowSliding} ${styles.delay1}`}>
                    <div className={styles.arrow}/>
                </div>
                <div className={`${styles.arrowSliding} ${styles.delay2}`}>
                    <div className={styles.arrow}/>
                </div>
                <div className={`${styles.arrowSliding} ${styles.delay3}`}>
                    <div className={styles.arrow}/>
                </div>
            </div>
        </div>
        <div className={styles.playerContainer}>
            {
                roomUser?.data?.map((one, index) => {
                    return <div key={one.id}
                                className={`${((index + "") === whoTurnMessage) ? styles.currentUser : ''} ${styles['player' + index]}`}>
                        <div className={styles.playerName}>{one.nickname}</div>
                        <div className={styles.cardNum}>{one.num}</div>
                    </div>
                })
            }
        </div>
    </>
}