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


export default function RoomDetail({data}) {
    const router = useRouter();
    const [flag, setFlag] = useState(false);
    const [roomInfoFlag, setRoomInfoFlag] = useState(false);
    const [isIAmIn, setIsIAmIn] = useState(data.isIAmIn);
    const [roomStatus, setRoomStatus] = useState(data.roomStatus);
    const roomUser = useRoomUser(router.query.roomCode, flag);
    const roomInfo = useRoomInfo(data, router.query.roomCode, roomInfoFlag);
    const [roomSize, setRoomSize] = useState({
        in: 0,
        all: 0
    });

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
        console.log('roomInfo?.isIAmIn ', roomInfo?.isIAmIn)
    }, [roomUser, roomInfo])

    return (
        <>
            <GlobalHeader/>
            <Timer something={() => setFlag(!flag)} timeout={10000}/>
            <div className={styles.container}>
                <h1>{roomInfo?.roomName}</h1>
                {
                    roomStatus === 0 ?
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
                <div>
                    {
                        roomUser?.map((one, index) => {
                            return <div key={one.id} className={styles['player-' + index]}>
                                <div className={styles.playerName}>{one.username}</div>
                            </div>
                        })
                    }
                </div>
                {
                    roomSize.in === roomSize.all && isIAmIn ?
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
                <MyCards roomCode={router.query.roomCode}/>
            </div>
            <Footer/>
            <ToastContainer/>
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

