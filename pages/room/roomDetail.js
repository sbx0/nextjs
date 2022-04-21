import React, {useContext, useEffect, useState} from "react";
import styles from './room.module.css';
import 'react-toastify/dist/ReactToastify.css';
import useRoomUser from "../../hooks/useRoomUser";
import CallApiButton from "../../components/common/callApiButton";
import {joinRoom, quitRoom} from "../../apis/unoRoomUser";
import useRoomInfo from "../../hooks/useRoomInfo";
import {startUnoRoom} from "../../apis/unoRoom";
import MyCards from "../../components/card/myCards";
import DiscardCards from "../../components/card/discardCards";
import {useFullScreenHandle} from "react-full-screen";
import RoomDashboard from "./roomDashboard";
import RoomUser from "./roomUser";
import {UserContext} from "../../components/common/loginContainer";
import {actionType as sseActionType, SSEContext} from "./roomSSE";


export default function RoomDetail() {
    const user = useContext(UserContext);
    const {sseState, sseDispatch} = useContext(SSEContext);
    const handle = useFullScreenHandle();
    const roomInfo = useRoomInfo(sseState.roomCode);
    const roomUser = useRoomUser(sseState.roomCode, sseState.joinMessage, sseState.quitMessage, sseState.numberOfCardsMessage);
    const [isIAmIn, setIsIAmIn] = useState(false);
    const [roomStatus, setRoomStatus] = useState(0);
    const [roomSize, setRoomSize] = useState({
        in: 0,
        all: 0
    });
    const [discards, setDiscards] = useState([]);
    const [myTurn, setMyTurn] = useState(false);

    useEffect(() => {
        if (roomUser.data == null) return;
        if (roomInfo.data == null) return;
        let index = parseInt(sseState.whoTurnMessage);
        if (index == null) {
            index = roomInfo.data.currentGamer;
        }
        if (index == null) {
            return;
        }
        let users = roomUser.data;
        let currentPlayer = users[index];
        if (currentPlayer == null) return;
        if (currentPlayer.id === user.data.id) {
            setMyTurn(true);
        } else {
            setMyTurn(false);
        }
    }, [roomUser.data, roomInfo.data, sseState.whoTurnMessage])

    useEffect(() => {
        if (roomStatus === 0) {
            roomInfo.setFlag(!roomInfo.flag);
        }
    }, [sseState.drawCardMessage])

    useEffect(() => {
        roomUser.setFlag(!roomUser.flag);
        roomInfo.setFlag(!roomInfo.flag);
    }, [sseState.ready])

    useEffect(() => {
        let inNumber = 0;
        let allNumber = 0;
        if (roomUser.data !== undefined && roomUser.data?.length !== undefined) {
            inNumber = roomUser.data?.length;
        }
        if (roomInfo.data !== undefined && roomInfo.data?.playersSize !== undefined) {
            allNumber = roomInfo.data.playersSize;
        }
        setRoomSize(
            {
                in: inNumber,
                all: allNumber
            }
        )
    }, [roomUser.data, roomInfo.data])

    useEffect(() => {
        setRoomStatus(roomInfo.data.roomStatus);
        setIsIAmIn(roomInfo.data.isIAmIn);
        sseDispatch({type: sseActionType.who, data: roomInfo.data.currentGamer + ''})
    }, [roomInfo.data])

    return (
        <>
            <div className={styles.container}>
                {
                    roomStatus === 0 ?
                        <CallApiButton
                            buttonText={(isIAmIn ? '退出房间 ' : '加入房间 ') + roomSize.in + '/' + roomSize.all}
                            loadingText={(isIAmIn ? '正在退出 ' : '正在加入')}
                            api={isIAmIn ? quitRoom : joinRoom}
                            params={{
                                "roomCode": sseState.roomCode,
                                "instance-id": sseState.serviceInstanceId,
                            }}
                            onSuccess={() => {
                                roomInfo.setFlag(!roomInfo.flag);
                                setIsIAmIn(!isIAmIn);
                            }}
                        />
                        :
                        <></>
                }
                <RoomUser roomUser={roomUser}/>
                {
                    roomSize.in === roomSize.all && isIAmIn && roomStatus === 0 ?
                        <CallApiButton
                            buttonText={'开始'}
                            loadingText={'正在加载'}
                            api={startUnoRoom}
                            params={{
                                "roomCode": sseState.roomCode,
                                "instance-id": sseState.serviceInstanceId,
                            }}
                            onSuccess={() => {
                                setRoomStatus(1);
                            }}
                        />
                        :
                        <></>
                }
                <DiscardCards data={discards}
                              setData={setDiscards}/>
                {
                    myTurn ?
                        <RoomDashboard myTurn={myTurn}
                                       roomSize={roomSize}
                                       roomStatus={roomStatus}
                                       isIAmIn={isIAmIn}/>
                        :
                        <></>
                }
                <MyCards discards={discards}
                         setDiscards={setDiscards}/>
            </div>
        </>
    );
}
