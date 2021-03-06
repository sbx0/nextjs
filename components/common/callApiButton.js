import {toast} from 'react-toastify';
import styles from "../../css/index.module.css";
import React, {useContext, useState} from "react";
import {useRouter} from 'next/router'
import Loading from "./loading";
import {LanguageContext} from "../i18n/i18n";


export default function CallApiButton({loadingText, buttonText, onSuccess, api, params}) {
    const language = useContext(LanguageContext);
    const router = useRouter()
    const [loading, setLoading] = useState(false);

    const createRoom = () => {
        setLoading(true);
        if (params == null) {
            params = {}
        }
        api(params, null).then((response) => {
            if (response.code === 500) {
                router.push("/login").then(r => r);
            }
            if (response.code === "0") {
                if (onSuccess != null) {
                    onSuccess(response.data)
                }
            } else {
                toast(response.message, {
                    position: "bottom-center",
                    autoClose: 1000,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                });
            }
        }).finally(() => {
            setLoading(false);
        })
    }

    return (
        <div className={styles.fixHeight}>
            {
                loading ?
                    <Loading text={loadingText ? loadingText : language.loading}/>
                    :
                    <div className={styles.loginButton}
                         onClick={createRoom}>
                        {buttonText ? buttonText : language.click}
                    </div>
            }
        </div>
    );
}
