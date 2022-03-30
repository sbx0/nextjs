import {useEffect, useState} from 'react';
import {listRoomUser} from "../apis/unoRoomUser";

export default function useRoomUser(roomCode, flag) {
    const [roomUser, setRoomUser] = useState(null);

    useEffect(() => {
        if (roomCode === undefined) return;
        listRoomUser({roomCode: roomCode}).then((response) => {
            if (response) {
                setRoomUser(response.data);
            } else {
                setRoomUser([]);
            }
        })
    }, [roomCode, flag]);

    return roomUser;
}
