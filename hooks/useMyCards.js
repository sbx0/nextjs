import {useEffect, useState} from 'react';
import {myCards} from "../apis/unoCard";

export default function useMyCards({
                                       roomCode, drawCardMessage
                                   }) {
    const [data, setData] = useState([]);

    const colorWeight = {
        black: 0,
        red: 1,
        blue: 2,
        green: 3,
        yellow: 4
    }

    useEffect(() => {
        if (drawCardMessage === null) {
            return;
        }
        let sorted = data.concat();
        for (let i = 0; i < drawCardMessage.length; i++) {
            sorted.push(drawCardMessage[i]);
        }
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
    }, [drawCardMessage])

    useEffect(() => {
        if (roomCode === undefined) return;
        myCards({roomCode: roomCode}).then((response) => {
            if (response.code === "0") {
                let sorted = response.data.concat();
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
    }, [roomCode]);

    return {data, setData};
}
