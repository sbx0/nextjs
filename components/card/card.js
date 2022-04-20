import React, {useEffect, useState} from 'react';
import styles from './card.module.css';
import {playCards} from "../../apis/unoCard";
import {toast} from "react-toastify";

export default function Card({roomCode, card, setData, data, discards, setDiscards, serviceInstanceId}) {
    const [can, setCan] = useState(false);
    const [debug, setDebug] = useState(false);
    const [choose, setChoose] = useState(false);

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

    const clickToPlayCard = (color) => {
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

        let original = data.concat();
        let originalDiscards = discards.concat();

        let nd = [];
        let j = 0;
        for (let i = 0; i < data.length; i++) {
            if (card.uuid !== data[i].uuid) {
                nd[j++] = data[i];
            }
        }

        let ndd = discards.concat();
        for (let i = 0; i < ndd.length - 1; i++) {
            ndd[i] = ndd[i + 1];
        }
        ndd[ndd.length - 1] = card;

        if (card.color === 'black') {
            if (color === null) {
                setChoose(true);
                return;
            }
        }

        setData(nd);
        setDiscards(ndd);

        playCards({roomCode: roomCode, uuid: card.uuid, color: color != null ? color : card.color}, null, {
            'instance-id': serviceInstanceId
        }).then((response) => {
            if (response.code !== '0') {
                setData(original);
                setDiscards(originalDiscards);
                toast("can't play", {
                    position: "bottom-center",
                        autoClose: 1000,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined,
                    });
                }
            setChoose(false);
            }
        )

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

    return <div onDoubleClick={() => clickToPlayCard(null)} className={styles.container}>
        <div className={`${styles.chooseColor} ${choose ? '' : styles.hidden}`}>
            <div className={styles.colorButton}
                 onClick={() => {
                     clickToPlayCard('yellow');
                 }}>
                yellow
            </div>
            <div className={styles.colorButton}
                 onClick={() => {
                     clickToPlayCard('blue');
                 }}>
                blue
            </div>
            <div className={styles.colorButton}
                 onClick={() => {
                     clickToPlayCard('red');
                 }}>
                red
            </div>
            <div className={styles.colorButton}
                 onClick={() => {
                     clickToPlayCard('green');
                 }}>
                green
            </div>
        </div>
        {
            debug ?
                <div onFocusCapture={() => setChoose(true)}>
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
