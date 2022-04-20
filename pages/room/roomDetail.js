import React, {useEffect, useState} from "react";
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


export default function RoomDetail({
                                       user,
                                       ready,
                                       roomCode,
                                       serviceInstanceId,
                                       joinMessage,
                                       quitMessage,
                                       drawCardMessage,
                                       setDrawCardMessage,
                                       discardCardsMessage,
                                       numberOfCardsMessage,
                                       whoTurnMessage,
                                       penaltyCards,
                                       direction,
                                       setDirection,
                                       setPenaltyCards,
                                       setWhoTurnMessage
                                   }) {
    const handle = useFullScreenHandle();
    const roomInfo = useRoomInfo(roomCode);
    const roomUser = useRoomUser(roomCode, joinMessage, quitMessage, numberOfCardsMessage);
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
        let index = parseInt(whoTurnMessage);
        if (index == null) {
            index = roomInfo.data.currentGamer;
        }
        if (index == null) {
            return;
        }
        let users = roomUser.data;
        let currentPlayer = users[index];
        if (currentPlayer == null) return;
        if (currentPlayer.id === user.id) {
            setMyTurn(true);
        } else {
            setMyTurn(false);
        }
    }, [roomUser.data, roomInfo.data, whoTurnMessage])

    useEffect(() => {
        if (roomStatus === 0) {
            roomInfo.setFlag(!roomInfo.flag);
        }
    }, [drawCardMessage])

    useEffect(() => {
        roomUser.setFlag(!roomUser.flag);
        roomInfo.setFlag(!roomInfo.flag);
    }, [ready])

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
        setWhoTurnMessage(roomInfo.data.currentGamer + '')
    }, [roomInfo.data])

    return (
        <>
            <div className={styles.container}>
                <div>{penaltyCards}</div>
                <div>{direction === 'normal' ? '->' : '<-'}</div>
                {
                    roomStatus === 0 ?
                        <CallApiButton
                            buttonText={(isIAmIn ? '退出房间 ' : '加入房间 ') + roomSize.in + '/' + roomSize.all}
                            loadingText={(isIAmIn ? '正在退出 ' : '正在加入')}
                            api={isIAmIn ? quitRoom : joinRoom}
                            params={{
                                "roomCode": roomCode,
                                "instance-id": serviceInstanceId,
                            }}
                            onSuccess={() => {
                                roomInfo.setFlag(!roomInfo.flag);
                                setIsIAmIn(!isIAmIn);
                            }}
                        />
                        :
                        <></>
                }
                <div className={styles.playerContainer}>
                    {
                        roomUser.data?.map((one, index) => {
                            return <div key={one.id}
                                        className={`${((index + "") === whoTurnMessage) ? styles.currentUser : ''} ${styles['player' + index]}`}>
                                <div className={styles.playerName}>{one.nickname}</div>
                                <div className={styles.cardNum}>{one.num}</div>
                            </div>
                        })
                    }
                </div>
                {
                    roomSize.in === roomSize.all && isIAmIn && roomStatus === 0 ?
                        <CallApiButton
                            buttonText={'开始'}
                            loadingText={'正在加载'}
                            api={startUnoRoom}
                            params={{
                                "roomCode": roomCode,
                                "instance-id": serviceInstanceId,
                            }}
                            onSuccess={() => {
                                setRoomStatus(1);
                            }}
                        />
                        :
                        <></>
                }
                <DiscardCards discardCardsMessage={discardCardsMessage}
                              roomCode={roomCode}
                              data={discards}
                              setData={setDiscards}/>
                {
                    myTurn ?
                        <RoomDashboard myTurn={myTurn}
                                       penaltyCards={penaltyCards}
                                       roomSize={roomSize}
                                       roomCode={roomCode}
                                       roomStatus={roomStatus}
                                       serviceInstanceId={serviceInstanceId}
                                       isIAmIn={isIAmIn}
                                       setDrawCardMessage={setDrawCardMessage}/>
                        :
                        <></>
                }
                <MyCards drawCardMessage={drawCardMessage}
                         roomCode={roomCode}
                         serviceInstanceId={serviceInstanceId}
                         discards={discards}
                         setDiscards={setDiscards}/>
            </div>
        </>
    );
}
