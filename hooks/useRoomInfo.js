import {useEffect, useState} from 'react';
import {infoUnoRoom} from "../apis/unoRoom";

export default function useRoomInfo(initData, roomCode, flag) {
    const [data, setData] = useState(initData);

    useEffect(() => {
        if (initData !== undefined) return;
        if (roomCode === undefined) return;
        infoUnoRoom({roomCode: roomCode}).then((response) => {
            if (response.code === "0") {
                setData(response.data);
            } else {
                setData(null);
            }
        })
    }, [roomCode, flag]);
    return data;
}
