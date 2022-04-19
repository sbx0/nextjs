import styles from './roomDashboard.module.css';
import CallApiButton from "../../components/common/callApiButton";
import {drawCard, nextPlay} from "../../apis/unoCard";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import React from "react";

export default function RoomDashboard({
                                          myTurn,
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
                        buttonText={'抽牌'}
                        loadingText={'正在抽牌'}
                        api={drawCard}
                        params={{
                            "roomCode": roomCode,
                            "instance-id": serviceInstanceId,
                        }}
                        onSuccess={(params) => {
                            setDrawCardMessage(params);
                            toast(params[0]?.color + ' ' + params[0]?.point, {
                                position: "bottom-center",
                                autoClose: 1000,
                                closeOnClick: true,
                                pauseOnHover: false,
                                draggable: true,
                                progress: undefined,
                            });
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
                            toast(params[0]?.color + ' ' + params[0]?.point, {
                                position: "bottom-center",
                                autoClose: 1000,
                                closeOnClick: true,
                                pauseOnHover: false,
                                draggable: true,
                                progress: undefined,
                            });
                        }}
                    />
                    :
                    <></>
            }
            <ToastContainer/>
        </div>
    </>
}