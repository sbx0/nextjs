import styles from './roomDashboard.module.css';
import CallApiButton from "../../../components/common/callApiButton";
import {drawCard, nextPlay} from "../../../apis/unoCard";
import {ToastContainer} from "react-toastify";
import React, {useContext} from "react";
import {actionType, SSEContext} from "./roomSSE";
import {LanguageContext} from "../../../components/i18n/i18n";
import {GameContext} from "./roomDetail";
import {startUnoRoom} from "../../../apis/unoRoom";
import {joinRoom, quitRoom} from "../../../apis/unoRoomUser";

export default function RoomDashboard() {
    const language = useContext(LanguageContext);
    const {sseState, sseDispatch} = useContext(SSEContext);
    const {state, dispatch} = useContext(GameContext);

    return <>
        <div className={styles.board}>
            {
                state?.roomInfo?.roomStatus === 0 ?
                    <CallApiButton
                        buttonText={(state?.roomInfo?.isIAmIn ? language.quitRoom : language.joinRoom) + state?.inNumber + '/' + state?.allNumber}
                        loadingText={(state?.roomInfo?.isIAmIn ? language.quitingRoom : language.joiningRoom)}
                        api={state?.roomInfo?.isIAmIn ? quitRoom : joinRoom}
                        params={{
                            "roomCode": sseState?.roomCode,
                            "instance-id": sseState?.serviceInstanceId,
                        }}
                        onSuccess={() => {
                            if (state?.roomInfo?.isIAmIn) {
                                dispatch({type: actionType.out})
                            } else {
                                dispatch({type: actionType.in})
                            }
                        }}
                    />
                    :
                    <></>
            }
            {
                state?.inNumber === state?.allNumber && state?.roomInfo?.isIAmIn && state?.roomInfo?.roomStatus === 0 ?
                    <CallApiButton
                        buttonText={language.begin}
                        loadingText={language.loading}
                        api={startUnoRoom}
                        params={{
                            "roomCode": sseState?.roomCode,
                            "instance-id": sseState?.serviceInstanceId,
                        }}
                        onSuccess={() => {
                            dispatch({type: actionType.startGame})
                        }}
                    />
                    :
                    <></>
            }
            {
                state?.myTurn && state?.inNumber === state?.allNumber && state?.roomInfo?.isIAmIn && state?.roomInfo?.roomStatus === 1 ?
                    <CallApiButton
                        buttonText={parseInt(sseState?.penaltyCards) > 0 ? language.draw + sseState?.penaltyCards + language.numCard : language.drawCard}
                        loadingText={language.drawingCard}
                        api={drawCard}
                        params={{
                            "roomCode": sseState?.roomCode,
                            "instance-id": sseState?.serviceInstanceId,
                        }}
                        onSuccess={(params) => {
                            sseDispatch({type: actionType.draw, data: params})
                        }}
                    />
                    :
                    <></>
            }
            {
                state?.myTurn ?
                    <CallApiButton
                        buttonText={language.skip}
                        loadingText={language.skipping}
                        api={nextPlay}
                        params={{
                            "roomCode": sseState?.roomCode,
                            "instance-id": sseState?.serviceInstanceId,
                        }}
                        onSuccess={(params) => {
                            sseDispatch({type: actionType.draw, data: params})
                        }}
                    />
                    :
                    <></>
            }
            <ToastContainer/>
        </div>
    </>
}