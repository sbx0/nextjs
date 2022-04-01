import {useEffect, useState} from 'react';
import {listRoomUser} from "../apis/unoRoomUser";

export default function useRoomUser(roomCode, joinMessage, quitMessage) {
    const [data, setData] = useState(null);
    const [flag, setFlag] = useState(false);

    useEffect(() => {
        if (roomCode === undefined) return;
        listRoomUser({roomCode: roomCode}).then((response) => {
            if (response) {
                setData(response.data);
            } else {
                setData([]);
            }
        })
    }, [roomCode, flag]);

    useEffect(() => {
        if (joinMessage != null) {
            let u = data.splice(0);
            u.push(joinMessage);
            setData(u);
        }
    }, [joinMessage]);

    useEffect(() => {
        if (quitMessage != null) {
            let u = [];
            for (let i = 0; i < data.length; i++) {
                if (data[i].id !== quitMessage.id) {
                    u.push(data[i]);
                }
            }
            setData(u);
        }
    }, [quitMessage])

    return {data, flag, setFlag};
}
