import React from "react";
import useUserInfo from "../../hooks/useUserInfo";
import styles from './requireLogin.module.css';

export default function RequireLogin({children}) {
    const user = useUserInfo();

    if (user != null) {
        return <>{children}</>
    } else {
        return <div className={styles.container}>
            Sorry, You need login...
        </div>
    }
}
