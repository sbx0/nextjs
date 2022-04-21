import styles from './roomDashboard.module.css';
import CallApiButton from "../../components/common/callApiButton";
import {drawCard, nextPlay} from "../../apis/unoCard";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import React, {useContext} from "react";
import {actionType, SSEContext} from "./roomSSE";

export default function RoomDashboard({
                                          myTurn,
                                          roomSize,
                                          isIAmIn,
                                          roomStatus
                                      }) {
    const {sseState, sseDispatch} = useContext(SSEContext);

    return <>
        <div className={styles.board}>
            {
                roomSize?.in === roomSize?.all && isIAmIn && roomStatus === 1 ?
                    <CallApiButton
                        buttonText={parseInt(sseState.penaltyCards) > 0 ? '抽牌' + sseState.penaltyCards + '张' : '抽牌'}
                        loadingText={'正在抽牌'}
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
                        buttonText={'跳过'}
                        loadingText={'正在跳过'}
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