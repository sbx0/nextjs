import React, {useContext, useEffect, useState} from "react";
import {SSEContext} from "./roomSSE";
import {listByGameRoom} from "../../../apis/unoResult";
import {useRouter} from "next/router";

export default function RoomResult() {
    const router = useRouter()
    const {sseState, sseDispatch} = useContext(SSEContext);
    const [data, setData] = useState(null);

    useEffect(() => {
        listByGameRoom({roomCode: sseState?.roomCode}).then((r => {
            if (r.code === "0") {
                setData(r.data);
            }
        }))
    }, [])

    return <>
        {
            data?.map((u) => {
                return <p key={u.id}>{u.userName} {u.ranking}</p>
            })
        }
        <button onClick={() => {
            router.push("/").then(r => r)
        }}>
            再来一局
        </button>
    </>
}
