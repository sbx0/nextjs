import React, {useEffect, useState} from "react";
import styles from './room.module.css';
import 'react-toastify/dist/ReactToastify.css';
import useRoomUser from "../../hooks/useRoomUser";
import CallApiButton from "../../components/common/callApiButton";
import Timer from "../../components/common/timer";
import {joinRoom, quitRoom} from "../../apis/unoRoomUser";
import useRoomInfo from "../../hooks/useRoomInfo";
import {startUnoRoom} from "../../apis/unoRoom";
import MyCards from "../../components/card/myCards";
import DiscardCards from "../../components/card/discardCards";
import {drawCard} from "../../apis/unoCard";
import {FullScreen, useFullScreenHandle} from "react-full-screen";


export default function RoomDetail({roomCode}) {
    const handle = useFullScreenHandle();
    const [flag, setFlag] = useState(false);
    const [roomInfoFlag, setRoomInfoFlag] = useState(false);
    const [myCardsFlag, setMyCardsFlag] = useState(false);
    const roomInfo = useRoomInfo(roomCode, roomInfoFlag);
    const [isIAmIn, setIsIAmIn] = useState(roomInfo);
    const [roomStatus, setRoomStatus] = useState(0);
    const roomUser = useRoomUser(roomCode, flag);
    const [roomSize, setRoomSize] = useState({
        in: 0,
        all: 0
    });
    const [discards, setDiscards] = useState([]);

    useEffect(() => {
        let inNumber = 0;
        let allNumber = 0;
        if (roomUser !== undefined && roomUser?.length !== undefined) {
            inNumber = roomUser.length;
        }
        if (roomInfo !== undefined && roomInfo?.playersSize !== undefined) {
            allNumber = roomInfo.playersSize;
        }
        setRoomStatus(roomInfo.roomStatus)
        setIsIAmIn(roomInfo.isIAmIn)
        setRoomSize(
            {
                in: inNumber,
                all: allNumber
            }
        )
    }, [roomUser, roomInfo])

    return (
        <>
            <div onClick={handle.enter} className={styles.enter} hidden={handle.active}>
                全屏
            </div>
            <FullScreen handle={handle} className={styles.fullscreen}>
                <Timer something={() => setFlag(!flag)} timeout={2000}/>
                {/*<div onClick={handle.exit} className={styles.exit} hidden={!handle.active}>*/}
                {/*    X*/}
                {/*</div>*/}
                <div className={styles.container}>
                    {
                        roomStatus === 0 || roomStatus === 1 ?
                            <CallApiButton
                                buttonText={(isIAmIn ? '退出房间 ' : '加入房间 ') + roomSize.in + '/' + roomSize.all}
                                loadingText={(isIAmIn ? '正在退出 ' : '正在加入')}
                                api={isIAmIn ? quitRoom : joinRoom}
                                params={{
                                    "roomCode": roomCode
                                }}
                                onSuccess={() => {
                                    setIsIAmIn(!isIAmIn)
                                    setFlag(!flag);
                                    setRoomInfoFlag(!roomInfoFlag);
                                }}
                            />
                            :
                            <></>
                    }
                    <div className={styles.playerContainer}>
                        {
                            roomUser?.map((one, index) => {
                                return <div key={one.id} className={styles['player' + index]}>
                                    <div className={styles.playerName}>{one.username}</div>
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
                                    "roomCode": roomCode
                                }}
                                onSuccess={() => {
                                    setRoomStatus(1);
                                    setFlag(!flag);
                                    setRoomInfoFlag(!roomInfoFlag);
                                }}
                            />
                            :
                            <></>
                    }
                    {
                        roomSize.in === roomSize.all && isIAmIn && roomStatus === 1 ?
                            <CallApiButton
                                buttonText={'抽牌'}
                                loadingText={'正在抽牌'}
                                api={drawCard}
                                params={{
                                    "roomCode": roomCode
                                }}
                                onSuccess={() => {
                                    setMyCardsFlag(!myCardsFlag);
                                }}
                            />
                            :
                            <></>
                    }
                    <DiscardCards roomCode={roomCode}
                                  flag={flag}
                                  data={discards}
                                  setData={setDiscards}/>
                    <MyCards roomCode={roomCode}
                             flag={myCardsFlag}
                             setFlag={setMyCardsFlag}
                             discards={discards}
                             setDiscards={setDiscards}/>
                </div>
            </FullScreen>
        </>
    );
}

