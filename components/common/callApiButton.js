import {toast} from 'react-toastify';
import styles from "../../css/index.module.css";
import React, {useState} from "react";
import {useRouter} from 'next/router'
import Loading from "./loading";


export default function CallApiButton({loadingText, buttonText, onSuccess, api, params}) {
    const router = useRouter()
    const [loading, setLoading] = useState(false);

    const createRoom = () => {
        setLoading(true);
        api(params, null, {
            'instance-id': params['instance-id']
        }).then((response) => {
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
                    <Loading text={loadingText ? loadingText : '正在加载'}/>
                    :
                    <div className={styles.loginButton}
                         onClick={createRoom}
                    >
                        {buttonText ? buttonText : '点击'}
                    </div>
            }
        </div>
    );
}
