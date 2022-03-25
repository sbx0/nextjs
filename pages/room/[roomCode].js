import React, {useEffect, useState} from "react";
import styles from './room.module.css';
import {useRouter} from "next/router";
import GlobalHeader from "../../components/common/header";
import Footer from "../../components/common/footer";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useRoomUser from "../../hooks/useRoomUser";
import CallApiButton from "../../components/common/callApiButton";
import Timer from "../../components/common/timer";
import {joinRoom, quitRoom} from "../../apis/unoRoomUser";
import useRoomInfo from "../../hooks/useRoomInfo";
import cookie from "cookie";
import {infoUnoRoom, startUnoRoom} from "../../apis/unoRoom";
import MyCards from "../../components/card/myCards";
import DiscardCards from "../../components/card/discardCards";
import {drawCard} from "../../apis/unoCard";
import {FullScreen, useFullScreenHandle} from "react-full-screen";


export default function RoomDetail({data}) {
    const handle = useFullScreenHandle();
    const router = useRouter();
    const [flag, setFlag] = useState(false);
    const [roomInfoFlag, setRoomInfoFlag] = useState(false);
    const [myCardsFlag, setMyCardsFlag] = useState(false);
    const [isIAmIn, setIsIAmIn] = useState(data.isIAmIn);
    const [roomStatus, setRoomStatus] = useState(data.roomStatus);
    const roomUser = useRoomUser(router.query.roomCode, flag);
    const roomInfo = useRoomInfo(data, router.query.roomCode, roomInfoFlag);
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
        setRoomSize(
            {
                in: inNumber,
                all: allNumber
            }
        )
    }, [roomUser, roomInfo])

    return (
        <>
            <GlobalHeader onClick={handle.enter}/>
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
                                    "roomCode": router.query.roomCode
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
                                    "roomCode": router.query.roomCode
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
                                    "roomCode": router.query.roomCode
                                }}
                                onSuccess={() => {
                                    setMyCardsFlag(!myCardsFlag);
                                }}
                            />
                            :
                            <></>
                    }
                    <DiscardCards roomCode={router.query.roomCode}
                                  flag={flag}
                                  data={discards}
                                  setData={setDiscards}/>
                    <MyCards roomCode={router.query.roomCode}
                             flag={myCardsFlag}
                             setFlag={setMyCardsFlag}
                             discards={discards}
                             setDiscards={setDiscards}/>
                </div>
                <Footer/>
                <ToastContainer/>
            </FullScreen>
        </>
    );
}

export async function getServerSideProps({req, query}) {
    const cookies = cookie.parse(req ? req.headers.cookie || "" : document.cookie);
    const response = await infoUnoRoom({roomCode: query.roomCode}, cookies);

    if (response.code === "0") {
        return {props: {data: response.data}}
    }

    return {props: {data: []}}
}

