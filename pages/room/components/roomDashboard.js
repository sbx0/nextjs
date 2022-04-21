import styles from './roomDashboard.module.css';
import CallApiButton from "../../../components/common/callApiButton";
import {drawCard, nextPlay} from "../../../apis/unoCard";
import {ToastContainer} from "react-toastify";
import React, {useContext} from "react";
import {actionType, SSEContext} from "./roomSSE";
import {LanguageContext} from "../../../components/i18n/i18n";
import {GameContext} from "./roomDetail";

export default function RoomDashboard({
                                          myTurn,
                                          roomSize,
                                          isIAmIn,
                                          roomStatus
                                      }) {
    const language = useContext(LanguageContext);
    const {sseState, sseDispatch} = useContext(SSEContext);
    const {state, dispatch} = useContext(GameContext);

    return <>
        <div className={styles.board}>
            {
                state.inNumber === state.allNumber && isIAmIn && roomStatus === 1 ?
                    <CallApiButton
                        buttonText={parseInt(sseState.penaltyCards) > 0 ? language.draw + sseState.penaltyCards + language.numCard : language.drawCard}
                        loadingText={language.drawingCard}
                        api={drawCard}
                        params={{
                            "roomCode": sseState.roomCode,
                            "instance-id": sseState.serviceInstanceId,
                        }}
                        onSuccess={(params) => {
                            sseDispatch({type: actionType.draw, data: params})
                        }}
                    />
                    :
                    <></>
            }
            {
                myTurn ?
                    <CallApiButton
                        buttonText={language.skip}
                        loadingText={language.skipping}
                        api={nextPlay}
                        params={{
                            "roomCode": sseState.roomCode,
                            "instance-id": sseState.serviceInstanceId,
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