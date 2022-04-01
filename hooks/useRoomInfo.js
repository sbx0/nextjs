import {useEffect, useState} from 'react';
import {infoUnoRoom} from "../apis/unoRoom";

export default function useRoomInfo(roomCode) {
    const [data, setData] = useState({});
    const [flag, setFlag] = useState(false);

    useEffect(() => {
        if (roomCode === undefined) return;
        infoUnoRoom({roomCode: roomCode}).then((response) => {
            if (response.code === "0") {
                setData(response.data);
            } else {
                setData(null);
            }
        })
    }, [roomCode, flag]);

    return {data, flag, setFlag};
}
