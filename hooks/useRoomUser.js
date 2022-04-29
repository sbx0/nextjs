import {useEffect, useState} from 'react';
import {listRoomUser} from "../apis/unoRoomUser";

export default function useRoomUser(roomCode, numberOfCardsMessage) {
    const [data, setData] = useState(null);
    const [flag, setFlag] = useState(false);

    useEffect(() => {
        if (numberOfCardsMessage === null || numberOfCardsMessage === undefined) return;
        let message = numberOfCardsMessage.split('=');
        let userId = message[0];
        let numbers = message[1];

        let users = data.concat();
        for (let i = 0; i < users.length; i++) {
            if (users[i].id.toString() === userId) {
                users[i].numberOfCards = numbers;
                break;
            }
        }
        setData(users);
    }, [numberOfCardsMessage])

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

    return {data, flag, setFlag};
}
