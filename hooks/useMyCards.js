import {useEffect} from 'react';
import {myCards} from "../apis/unoCard";

export default function useMyCards({
                                       data, setData, roomCode, flag
                                   }) {

    let colorWeight = {
        red: 1,
        blue: 2,
        green: 3,
        yellow: 4
    }

    useEffect(() => {
        if (roomCode === undefined) return;
        myCards({roomCode: roomCode}).then((response) => {
            if (response.code === "0") {
                let sorted = response.data.splice(0);
                let temp;

                for (let i = sorted.length; i > 0; i--) {
                    for (let j = 0; j < i - 1; j++) {
                        if (colorWeight[sorted[j].color] > colorWeight[sorted[j + 1].color]) {
                            temp = sorted[j];
                            sorted[j] = sorted[j + 1];
                            sorted[j + 1] = temp;
                        }
                    }
                }

                for (let i = sorted.length; i > 0; i--) {
                    for (let j = 0; j < i - 1; j++) {
                        if (sorted[j].color !== sorted[j + 1].color) {
                            continue;
                        }
                        if (sorted[j].point > sorted[j + 1].point) {
                            temp = sorted[j];
                            sorted[j] = sorted[j + 1];
                            sorted[j + 1] = temp;
                        }
                    }
                }

                setData(sorted);
            } else {
                setData([]);
            }
        })
    }, [roomCode, flag]);
    return data;
}
