import {useEffect, useState} from 'react';
import {myCards} from "../apis/unoCard";

export default function useMyCards(roomCode, flag) {
    const [data, setData] = useState([]);

    useEffect(() => {
        if (roomCode === undefined) return;
        myCards({roomCode: roomCode}).then((response) => {
            if (response) {
                setData(response.data);
            } else {
                setData([]);
            }
        })
    }, [roomCode, flag]);
    return data;
}
