import React, {useContext, useEffect, useState} from "react";
import {SSEContext} from "./roomSSE";
import {listByGameRoom} from "../../../apis/unoResult";
import {useRouter} from "next/router";
import styles from './roomResult.module.css';

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

    return <div className={styles.container}>
        <h1 className={styles.title}>排行榜</h1>
        <GameResultUsers users={data}/>
        <button className={styles.button} onClick={() => {
            router.push("/").then(r => r)
        }}>
            再来一局
        </button>
    </div>
}

function GameResultUsers({users}) {
    return <div className={styles.content}>
        <ol className={styles.orderList}>
            {
                users?.map((u) => {
                    return <li key={u.id} className={styles.listItem}>
                        <GameResultUser user={u}/>
                    </li>
                })
            }
        </ol>
    </div>
}

function GameResultUser({user}) {
    return <>
        <p>
            <strong>{user?.userName}</strong>
            <span>{user?.ranking}</span>
        </p>
    </>
}
