import React, {useEffect, useRef, useState} from "react";
import 'react-toastify/dist/ReactToastify.css';
import RoomDetail from "./roomDetail";
import {useRouter} from "next/router";
import GlobalHeader from "../../components/common/header";
import {ToastContainer} from "react-toastify";
import Footer from "../../components/common/footer";
import {EventSourcePolyfill} from "event-source-polyfill";


export default function RoomDetailRequireLogin() {
    const [userChangeFlag, setUserChangeFlag] = useState(false);
    const router = useRouter();
    const eventSource = useRef();

    useEffect(() => {
        eventSource.current = new EventSourcePolyfill(
            "/UNO/uno/room/subscribe/" + router.query.roomCode, {
                headers: {
                    'version': process.env.NEXT_PUBLIC_VERSION
                }
            }
        )
        eventSource.current.addEventListener("join", (event) => {
            console.log("join " + event.data);
            setUserChangeFlag(!userChangeFlag);
        });
        eventSource.current.addEventListener("quit", (event) => {
            console.log("quit " + event.data);
            setUserChangeFlag(!userChangeFlag);
        });
    }, [])

    useEffect(() => {
        eventSource.current.addEventListener("join", (event) => {
            console.log("join " + event.data);
            setUserChangeFlag(!userChangeFlag);
        });
        eventSource.current.addEventListener("quit", (event) => {
            console.log("quit " + event.data);
            setUserChangeFlag(!userChangeFlag);
        });
    }, [userChangeFlag])

    return <>
        <GlobalHeader/>
        <RoomDetail userChangeFlag={userChangeFlag} setUserChangeFlag={setUserChangeFlag}
                    roomCode={router.query.roomCode}/>
        <ToastContainer/>
        <Footer/>
    </>
}
