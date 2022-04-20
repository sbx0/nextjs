import styles from './roomDashboard.module.css';
import CallApiButton from "../../components/common/callApiButton";
import {drawCard, nextPlay} from "../../apis/unoCard";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import React from "react";

export default function RoomDashboard({
                                          myTurn,
                                          penaltyCards,
                                          roomSize,
                                          isIAmIn,
                                          roomStatus,
                                          serviceInstanceId,
                                          setDrawCardMessage,
                                          roomCode
                                      }) {

    return <>
        <div className={styles.board}>
            {
                roomSize?.in === roomSize?.all && isIAmIn && roomStatus === 1 ?
                    <CallApiButton
                        buttonText={parseInt(penaltyCards) > 0 ? '抽牌' + penaltyCards + '张' : '抽牌'}
                        loadingText={'正在抽牌'}
                        api={drawCard}
                        params={{
                            "roomCode": roomCode,
                            "instance-id": serviceInstanceId,
                        }}
                        onSuccess={(params) => {
                            setDrawCardMessage(params);
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
                            "roomCode": roomCode,
                            "instance-id": serviceInstanceId,
                        }}
                        onSuccess={(params) => {
                            setDrawCardMessage(params)
                        }}
                    />
                    :
                    <></>
            }
            <ToastContainer/>
        </div>
    </>
}