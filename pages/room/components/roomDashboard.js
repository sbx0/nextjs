import React, {useContext} from "react";
import styles from './roomDashboard.module.css';
import CallApiButton from "../../../components/common/callApiButton";
import {drawCard, nextPlay, playCards} from "../../../apis/unoCard";
import {toast} from "react-toastify";
import {actionType, SSEContext} from "./roomSSE";
import {LanguageContext} from "../../../components/i18n/i18n";
import {gameActionType, GameContext} from "./roomDetail";
import {startUnoRoom} from "../../../apis/unoRoom";
import {joinRoom, quitRoom} from "../../../apis/unoRoomUser";
import {addUnoBot, removeUnoBot} from "../../../apis/unoBot";

export default function RoomDashboard() {
    const language = useContext(LanguageContext);
    const {sseState, sseDispatch} = useContext(SSEContext);
    const {state, dispatch} = useContext(GameContext);

    const clickToPlayCard = () => {
        let card = state?.chooseCard;
        let data = state?.cards;
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

        let original = data.concat();
        let originalDiscards = state?.discards.concat();

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
            roomCode: sseState?.roomCode,
            uuid: card.uuid,
            color: state.chooseColor != null ? state.chooseColor : card.color
        }, null, {
            'instance-id': sseState?.serviceInstanceId
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

    return <>
        {state?.showColor ? <div className={styles.colorDiv}>
            <div className={`${styles.colorButton} ${styles.colorYellow}`}
                 onClick={() => {
                     clickToPlayCard();
                     dispatch({type: gameActionType.chooseColor, data: 'yellow'})
                 }}>
                {language.yellow}
            </div>
            <div className={`${styles.colorButton} ${styles.colorBlue}`}
                 onClick={() => {
                     clickToPlayCard();
                     dispatch({type: gameActionType.chooseColor, data: 'blue'})
                 }}>
                {language.blue}
            </div>
            <div className={`${styles.colorButton} ${styles.colorRed}`}
                 onClick={() => {
                     clickToPlayCard();
                     dispatch({type: gameActionType.chooseColor, data: 'red'})
                 }}>
                {language.red}
            </div>
            <div className={`${styles.colorButton} ${styles.colorGreen}`}
                 onClick={() => {
                     clickToPlayCard();
                     dispatch({type: gameActionType.chooseColor, data: 'green'})
                 }}>
                {language.green}
            </div>
        </div> : <></>}
        {state?.roomInfo?.roomStatus === 0 ? <div className={styles.colorDiv}>
            <CallApiButton
                buttonText={language.addBot}
                loadingText={language.addingBot}
                api={addUnoBot}
                params={{
                    "roomCode": sseState?.roomCode, "instance-id": sseState?.serviceInstanceId,
                }}
                onSuccess={() => {

                }}
            />
            <CallApiButton
                buttonText={language.removeBot}
                loadingText={language.removingBot}
                api={removeUnoBot}
                params={{
                    "roomCode": sseState?.roomCode, "instance-id": sseState?.serviceInstanceId,
                }}
                onSuccess={() => {

                }}
            /></div> : <></>}
        <div className={styles.board}>
            {state?.roomInfo?.roomStatus === 0 ? <>

                <CallApiButton
                    buttonText={(state?.roomInfo?.isIAmIn ? language.quitRoom : language.joinRoom) + state?.inNumber + '/' + state?.allNumber}
                    loadingText={(state?.roomInfo?.isIAmIn ? language.quitingRoom : language.joiningRoom)}
                    api={state?.roomInfo?.isIAmIn ? quitRoom : joinRoom}
                    params={{
                        "roomCode": sseState?.roomCode, "instance-id": sseState?.serviceInstanceId,
                    }}
                    onSuccess={() => {
                        if (state?.roomInfo?.isIAmIn) {
                            dispatch({type: gameActionType.out})
                        } else {
                            dispatch({type: gameActionType.in})
                        }
                    }}
                />
            </> : <></>}
            {state?.inNumber === state?.allNumber && state?.roomInfo?.isIAmIn && state?.roomInfo?.roomStatus === 0 ?
                <CallApiButton
                    buttonText={language.begin}
                    loadingText={language.loading}
                    api={startUnoRoom}
                    params={{
                        "roomCode": sseState?.roomCode, "instance-id": sseState?.serviceInstanceId,
                    }}
                    onSuccess={() => {
                        dispatch({type: gameActionType.startGame})
                    }}
                /> : <></>}
            {state?.myTurn && state?.inNumber === state?.allNumber && state?.roomInfo?.isIAmIn && state?.roomInfo?.roomStatus === 1 ?
                <CallApiButton
                    buttonText={parseInt(sseState?.penaltyCards) > 0 ? language.draw + sseState?.penaltyCards + language.numCard : language.drawCard}
                    loadingText={language.drawingCard}
                    api={drawCard}
                    params={{
                        "roomCode": sseState?.roomCode, "instance-id": sseState?.serviceInstanceId,
                    }}
                    onSuccess={(params) => {
                        sseDispatch({type: actionType.draw, data: params})
                    }}
                /> : <></>}
            {state?.myTurn && state?.inNumber === state?.allNumber && state?.roomInfo?.isIAmIn && state?.roomInfo?.roomStatus === 1 ?
                <CallApiButton
                    buttonText={language.skip}
                    loadingText={language.skipping}
                    api={nextPlay}
                    params={{
                        "roomCode": sseState?.roomCode, "instance-id": sseState?.serviceInstanceId,
                    }}
                    onSuccess={(params) => {
                        sseDispatch({type: actionType.draw, data: params})
                    }}
                /> : <></>}
        </div>
    </>
}
