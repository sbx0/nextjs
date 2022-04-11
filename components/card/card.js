import React, {useEffect, useState} from 'react';
import styles from './card.module.css';
import {playCards} from "../../apis/unoCard";

export default function Card({roomCode, card, setData, data, discards, setDiscards}) {
    const [can, setCan] = useState(false);
    const [debug, setDebug] = useState(false);

    useEffect(() => {
        let canPlay = false;

        if (discards == null || discards.length === 0) {
            canPlay = true;
        } else {
            if (discards[discards.length - 1].color === "black") {
                canPlay = true;
            }
            if (card.color === "black") {
                canPlay = true;
            }
            if (card.color === discards[discards.length - 1].color) {
                canPlay = true;
            }
            if (card.point === discards[discards.length - 1].point) {
                canPlay = true;
            }
        }

        setCan(canPlay);
    }, [discards])

    const clickToPlayCard = () => {
        let canPlay = false;

        if (discards == null || discards.length === 0) {
            canPlay = true;
        } else {
            if (discards[discards.length - 1].color === "black") {
                canPlay = true;
            }
            if (card.color === "black") {
                canPlay = true;
            }
            if (card.color === discards[discards.length - 1].color) {
                canPlay = true;
            }
            if (card.point === discards[discards.length - 1].point) {
                canPlay = true;
            }
        }

        if (canPlay) {
            let nd = [];
            let j = 0;
            for (let i = 0; i < data.length; i++) {
                if (card.uuid !== data[i].uuid) {
                    nd[j++] = data[i];
                }
            }
            setData(nd);
            let ndd = discards.splice(0);
            for (let i = 0; i < ndd.length - 1; i++) {
                ndd[i] = ndd[i + 1];
            }
            ndd[ndd.length - 1] = card;
            setDiscards(ndd);
            playCards({roomCode: roomCode, uuid: card.uuid, color: card.color}).then((response) => {
                    if (response.code === '0') {

                    }
                }
            )
        } else {
            console.log("can't play");
        }

    }

    const better = (text) => {
        switch (text) {
            case 'wild':
                return '变色';
            case 'wild draw four':
                return '+4';
            case 'draw two':
                return '+2';
            case 'reverse':
                return '逆转';
            case 'skip':
                return '跳过';
            default:
                return text;
        }
    }

    return <div onDoubleClick={clickToPlayCard} className={styles.container}>
        {
            debug ?
                <div>
                    <div>
                        {better(card.point)}
                    </div>
                    <div>
                        {card.color}
                    </div>
                    <div>
                        {better(card.point)}
                    </div>
                </div>
                :
                <div className={styles['bg-' + card.color]}>
                    <div className={styles.numberUp}>
                        {better(card.point)}
                    </div>
                    <div className={styles.number}>
                        {better(card.point)}
                    </div>
                    <div className={styles.numberDown}>
                        {better(card.point)}
                    </div>
                </div>
        }
    </div>
}
