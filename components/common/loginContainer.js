import React, {createContext, useContext, useEffect, useState} from 'react';
import styles from '../../css/loading.module.css';
import {useRouter} from "next/router";
import useUserInfo from "../../hooks/useUserInfo";
import {LanguageContext} from "../i18n/i18n";

export const UserContext = createContext(null);

export default function LoginContainer({children}) {
    const language = useContext(LanguageContext);
    const router = useRouter()
    const user = useUserInfo();
    const [message, setMessage] = useState(language.checkingLoginStatus);

    useEffect(() => {
        if (user.loading) {
            setMessage(language.checkingLoginStatus);
        } else {
            setMessage(language.pleaseLogin);
        }
    }, [user.loading])

    let result;

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
        result = children;
    }

    return <UserContext.Provider value={user}>
        {result}
    </UserContext.Provider>
}
