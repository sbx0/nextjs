import {useEffect} from 'react';
import {discardCards} from "../apis/unoCard";

export default function useDiscardCards({
                                            data, setData, roomCode, flag
                                        }) {

    useEffect(() => {
        if (roomCode === undefined) return;
        discardCards({roomCode: roomCode}).then((response) => {
            if (response) {
                setData(response.data.reverse());
            } else {
                setData([]);
            }
        })
    }, [roomCode, flag]);
    return data;
}
