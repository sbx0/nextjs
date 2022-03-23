import {useEffect} from 'react';
import {myCards} from "../apis/unoCard";

export default function useMyCards({
                                       data, setData, roomCode, flag
                                   }) {

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
