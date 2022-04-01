import React, {useEffect, useRef, useState} from "react";
import 'react-toastify/dist/ReactToastify.css';
import RoomDetail from "./roomDetail";
import {useRouter} from "next/router";
import GlobalHeader from "../../components/common/header";
import {ToastContainer} from "react-toastify";
import Footer from "../../components/common/footer";
import {EventSourcePolyfill} from "event-source-polyfill";
import LoadingContainer from "../../components/common/loadingContainer";


export default function RoomDetailRequireLogin() {
    const [ready, setReady] = useState(false);
    const [joinMessage, setJoinMessage] = useState(null);
    const [quitMessage, setQuitMessage] = useState(null);
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

        eventSource.current.onmessage = (event) => {
            console.log('onmessage')
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
    }, [])

    return <>
        <GlobalHeader/>
        <LoadingContainer loading={!ready} text={'连接中'}>
            <RoomDetail
                ready={ready}
                joinMessage={joinMessage}
                quitMessage={quitMessage}
                roomCode={router.query.roomCode}/>
            <ToastContainer/>
        </LoadingContainer>
        <Footer/>
    </>
}
