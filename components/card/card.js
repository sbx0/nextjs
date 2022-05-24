import React, {useContext, useEffect, useState} from 'react';
import styles from './card.module.css';
import {playCards} from "../../apis/unoCard";
import {toast} from "react-toastify";
import {LanguageContext} from "../i18n/i18n";
import {gameActionType, GameContext} from "../../pages/room/components/roomDetail";
import useSingleAndDoubleClick from "../common/useSingleAndDoubleClick";

export default function Card({roomCode, card, serviceInstanceId}) {
    const language = useContext(LanguageContext);
    const [debug, setDebug] = useState(false);
    const [can, setCan] = useState(false);
    const [choose, setChoose] = useState(false);
    const {state, dispatch} = useContext(GameContext);

    useEffect(() => {
        let canPlay = false;

        if (state?.discards == null || state?.discards.length === 0) {
            canPlay = true;
        } else {
            if (state?.discards[state?.discards.length - 1].color === "black") {
                canPlay = true;
            }
            if (card.color === "black") {
                canPlay = true;
            }
            if (card.color === state?.discards[state?.discards.length - 1].color) {
                canPlay = true;
            }
            if (card.point === state?.discards[state?.discards.length - 1].point) {
                canPlay = true;
            }
        }

        setCan(canPlay);
    }, [state?.discards])

    const clickToPlayCard = () => {
        dispatch({type: gameActionType.chooseCard, data: card})
        let canPlay = false;

        if (state?.discards == null || state?.discards.length === 0) {
            canPlay = true;
        } else {
            if (state?.discards[state?.discards.length - 1].color === "black") {
                canPlay = true;
            }
            if (card.color === "black") {
                canPlay = true;
            }
            if (card.color === state?.discards[state?.discards.length - 1].color) {
                canPlay = true;
            }
            if (card.point === state?.discards[state?.discards.length - 1].point) {
                canPlay = true;
            }
        }

        let original = state?.cards.concat();
        let originalDiscards = state?.discards.concat();
        let data = state?.cards;

        let nd = [];
        let j = 0;
        for (let i = 0; i < data.length; i++) {
            if (card.uuid !== data[i].uuid) {
                nd[j++] = data[i];
            }
        }

        let ndd = state?.discards.concat();
        for (let i = 0; i < ndd.length - 1; i++) {
            ndd[i] = ndd[i + 1];
        }
        ndd[ndd.length - 1] = card;

        if (card.color === 'black') {
            if (state.chooseColor === null) {
                dispatch({type: gameActionType.showColor})
                return;
            }
        }

        dispatch({type: gameActionType.initCards, data: nd})
        dispatch({type: gameActionType.discards, data: ndd})

        playCards({
            roomCode: roomCode, uuid: card.uuid, color: state.chooseColor != null ? state.chooseColor : card.color
        }, null, {
            'instance-id': serviceInstanceId
        }).then((response) => {
            if (response.code !== '0') {
                dispatch({type: gameActionType.initCards, data: original})
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
            dispatch({type: gameActionType.chooseColor, data: null})
            dispatch({type: gameActionType.hideColor, data: null})
            dispatch({type: gameActionType.chooseCard, data: null})
        })

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

    const click = useSingleAndDoubleClick(null, clickToPlayCard);

    return <div onClick={click}
                className={styles.container}>
        {debug ? <div>
            <div>
                {better(card.point)}
            </div>
            <div>
                {card.color}
            </div>
            <div>
                {better(card.point)}
            </div>
        </div> : <div className={styles['bg-' + card.color]}>
            <div className={styles.numberUp}>
                {better(card.point)}
            </div>
            <div className={styles.number}>
                {better(card.point)}
            </div>
            <div className={styles.numberDown}>
                {better(card.point)}
            </div>
        </div>}
    </div>
}
