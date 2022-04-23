import React, {useContext, useEffect, useState} from 'react';
import styles from './card.module.css';
import {playCards} from "../../apis/unoCard";
import {toast} from "react-toastify";
import {LanguageContext} from "../i18n/i18n";
import {gameActionType, GameContext} from "../../pages/room/components/roomDetail";

export default function Card({roomCode, card, setData, data, serviceInstanceId}) {
    const language = useContext(LanguageContext);
    const [debug, setDebug] = useState(false);
    const [can, setCan] = useState(false);
    const [choose, setChoose] = useState(false);
    const {state, dispatch} = useContext(GameContext);

    useEffect(() => {
        let canPlay = false;

        if (user?.discards == null || user?.discards.length === 0) {
            canPlay = true;
        } else {
            if (user?.discards[user?.discards.length - 1].color === "black") {
                canPlay = true;
            }
            if (card.color === "black") {
                canPlay = true;
            }
            if (card.color === user?.discards[user?.discards.length - 1].color) {
                canPlay = true;
            }
            if (card.point === user?.discards[user?.discards.length - 1].point) {
                canPlay = true;
            }
        }

        setCan(canPlay);
    }, [user?.discards])

    const clickToPlayCard = (color) => {
        let canPlay = false;

        if (user?.discards == null || user?.discards.length === 0) {
            canPlay = true;
        } else {
            if (user?.discards[user?.discards.length - 1].color === "black") {
                canPlay = true;
            }
            if (card.color === "black") {
                canPlay = true;
            }
            if (card.color === user?.discards[user?.discards.length - 1].color) {
                canPlay = true;
            }
            if (card.point === user?.discards[user?.discards.length - 1].point) {
                canPlay = true;
            }
        }

        let original = data.concat();
        let originalDiscards = user?.discards.concat();

        let nd = [];
        let j = 0;
        for (let i = 0; i < data.length; i++) {
            if (card.uuid !== data[i].uuid) {
                nd[j++] = data[i];
            }
        }

        let ndd = user?.discards.concat();
        for (let i = 0; i < ndd.length - 1; i++) {
            ndd[i] = ndd[i + 1];
        }
        ndd[ndd.length - 1] = card;

        if (card.color === 'black') {
            if (color === null) {
                setChoose(true);
                setTimeout(() => {
                    setChoose(false);
                }, [5000])
                return;
            }
        }

        setData(nd);
        dispatch({type: gameActionType.discards, data: ndd})

        playCards({roomCode: roomCode, uuid: card.uuid, color: color != null ? color : card.color}, null, {
            'instance-id': serviceInstanceId
        }).then((response) => {
                if (response.code !== '0') {
                    setData(original);
                    dispatch({type: gameActionType.discards, data: originalDiscards})
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
                return language.wild;
            case 'wild draw four':
                return language.wildDrawFour;
            case 'draw two':
                return language.drawTwo;
            case 'reverse':
                return language.reverse;
            case 'skip':
                return language.skip;
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
