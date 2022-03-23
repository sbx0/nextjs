import React from 'react';
import styles from './card.module.css';
import {playCards} from "../../apis/unoCard";

export default function Card({roomCode, card, flag, setFlag, setData, data}) {
    // card.uuid
    // card.color
    // card.point

    const clickToPlayCard = () => {
        let nd = [];
        let j = 0;
        for (let i = 0; i < data.length; i++) {
            if (card.uuid !== data[i].uuid) {
                nd[j++] = data[i];
            }
        }
        setData(nd);
        playCards({roomCode: roomCode, uuid: card.uuid}).then((response) => {
                if (response.code === '0') {
                    setFlag(!flag)
                }
            }
        )
    }

    return <div onClick={clickToPlayCard} className={styles.container}>

        <div>
            {card.color + ' ' + card.point}
        </div>

        {/*<div className={styles['bg-' + card.color]}>*/}
        {/*    <div className={styles.numberUp}>*/}
        {/*        {card.point}*/}
        {/*    </div>*/}
        {/*    <div className={styles.number}>*/}
        {/*    </div>*/}
        {/*    <div className={styles.numberDown}>*/}
        {/*        {card.point}*/}
        {/*    </div>*/}
        {/*</div>*/}
    </div>
}
