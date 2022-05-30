import React, {useState} from 'react';
import {loginApi, logoutApi} from "../apis/user";
import styles from '../css/login.module.css';
import useUserInfo from "../hooks/useUserInfo";
import {removeCookie, setCookie} from "../utils/cookies";
import GlobalHeader from "../components/common/header";
import {useRouter} from 'next/router'
import Footer from "../components/common/footer";
import 'react-toastify/dist/ReactToastify.css';
import {toast, ToastContainer} from "react-toastify";

export default function Login() {
    const router = useRouter()
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const userInfo = useUserInfo();

    const loginRequest = () => {
        if (username === '') return;
        if (password === '') return;
        removeCookie('token', null)
        if (userInfo.data != null) return;
        loginApi({
            username: username,
            password: password
        }).then((response) => {
            if (response.data?.isLogin) {
                setCookie('token', response.data.tokenValue);
                router.push("/").then(r => r);
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
        })
    }

    const logout = () => {
        localStorage.removeItem("token");
        removeCookie('token', '');
        logoutApi().then(r => r);
        router.reload();
    }

    return (
        <>
            <GlobalHeader/>
            <div className={styles.container}>
                {
                    userInfo.data == null ?
                        <>
                            <div className={styles.row}>
                                <input id="username"
                                       type="text"
                                       className={styles.input}
                                       placeholder=" "
                                       onChange={(event) => setUsername(event.target.value)}/>
                                <label htmlFor="username">用户名</label>
                            </div>
                            <div className={styles.row}>
                                <input id="password"
                                       type="password"
                                       className={styles.input}
                                       placeholder=" "
                                       onChange={(event) => setPassword(event.target.value)}/>
                                <label htmlFor="password">密码</label>
                            </div>
                            <button className={styles.loginButton}
                                    onClick={() => loginRequest()}>
                                登录
                            </button>
                        </>
                        :
                        <>
                            <p>当前登录账号：{userInfo.data.username}</p>
                            <button className={styles.loginButton}
                                    onClick={() => logout()}>
                                退出登录
                            </button>
                        </>
                }
            </div>
            <ToastContainer/>
            <Footer/>
        </>
    );
}
