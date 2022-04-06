import React, {useEffect, useRef, useState} from "react";
import {useRouter} from "next/router";
import {EventSourcePolyfill} from "event-source-polyfill";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import LoadingContainer from "../../components/common/loadingContainer";
import RoomDetail from "./roomDetail";


export default function RoomSSE() {
    const [ready, setReady] = useState(false);
    const [joinMessage, setJoinMessage] = useState(null);
    const [quitMessage, setQuitMessage] = useState(null);
    const router = useRouter();
    const eventSource = useRef();

    useEffect(() => {
        if (router.query.roomCode === null || router.query.roomCode === undefined || router.query.roomCode === '') {
            return;
        }
        eventSource.current = new EventSourcePolyfill(
            "/UNO/uno/room/subscribe/" + router.query.roomCode, {
                headers: {
                    'version': process.env.NEXT_PUBLIC_VERSION
                }
            }
        )

        eventSource.current.onmessage = (event) => {
            console.log('onmessage')
            toast(event.data, {
                position: "bottom-center",
                autoClose: 1000,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
        }

        eventSource.current.onerror = (event) => {
            console.log('onerror')
            setReady(false);
        }

        eventSource.current.onopen = (event) => {
            console.log('onopen')
            setReady(true);
        }

        eventSource.current.addEventListener("join", (event) => {
            console.log('join ' + event.data)
            setJoinMessage(JSON.parse(event.data));
        });
        eventSource.current.addEventListener("quit", (event) => {
            console.log('quit ' + event.data)
            setQuitMessage(JSON.parse(event.data));
        });

        return () => {
            eventSource.current.removeEventListener("join");
            eventSource.current.removeEventListener("quit");
            eventSource.current.close();
        }
    }, [router.query.roomCode])

    return <>
        <LoadingContainer loading={!ready} text={'连接中'}>
            <RoomDetail
                ready={ready}
                joinMessage={joinMessage}
                quitMessage={quitMessage}
                roomCode={router.query.roomCode}/>
            <ToastContainer/>
        </LoadingContainer>
    </>
}
