import React, {createContext, useEffect, useState} from 'react';
import styles from '../../css/loading.module.css';
import {useRouter} from "next/router";
import useUserInfo from "../../hooks/useUserInfo";

export const UserContext = createContext(null);

export default function LoginContainer({children}) {
    const router = useRouter()
    const user = useUserInfo();
    const [message, setMessage] = useState('正在检测登录状态');

    useEffect(() => {
        if (user.loading) {
            setMessage('正在检测登录状态');
        } else {
            setMessage('请先登录');
        }
    }, [user.loading])

    let result

    if (user.data == null) {
        result = <div className={styles.container} onClick={() => router.push("/login")}>
            {
                user.loading ?
                    <div className={styles.loading}/>
                    :
                    <></>
            }
            <div className={styles.text}>{message}</div>
        </div>
    } else {
        result = children
    }

    return <UserContext.Provider value={user}>
        {result}
    </UserContext.Provider>
}
