import React, {useEffect, useRef, useState} from "react";
import {useRouter} from "next/router";
import {EventSourcePolyfill} from "event-source-polyfill";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import LoadingContainer from "../../components/common/loadingContainer";
import RoomDetail from "./roomDetail";
import {serviceInstanceChoose} from "../../apis/serviceInstance";


export default function RoomSSE({user}) {
    const [ready, setReady] = useState(false);
    const [serviceInstanceId, setServiceInstanceId] = useState(null);
    const [joinMessage, setJoinMessage] = useState(null);
    const [quitMessage, setQuitMessage] = useState(null);
    const [drawCardMessage, setDrawCardMessage] = useState(null);
    const [discardCardsMessage, setDiscardCardsMessage] = useState(null);
    const [numberOfCardsMessage, setNumberOfCardsMessage] = useState(null);
    const [whoTurnMessage, setWhoTurnMessage] = useState('0');
    const [penaltyCards, setPenaltyCards] = useState('0');
    const [direction, setDirection] = useState('normal');
    const router = useRouter();
    const eventSource = useRef();

    useEffect(() => {
        if (router.query.roomCode === null || router.query.roomCode === undefined || router.query.roomCode === '') {
            return;
        }
        serviceInstanceChoose({roomCode: router.query.roomCode}).then((response) => {
            if (response.code === '0') {
                setServiceInstanceId(response.data);
            }
        })
    }, [router.query.roomCode])

    useEffect(() => {
        if (serviceInstanceId === null) {
            return;
        }

        if (router.query.roomCode === null || router.query.roomCode === undefined || router.query.roomCode === '') {
            return;
        }

        eventSource.current = new EventSourcePolyfill(
            "/UNO/uno/room/subscribe/" + router.query.roomCode, {
                headers: {
                    'version': process.env.NEXT_PUBLIC_VERSION,
                    'instance-id': serviceInstanceId
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

        eventSource.current.addEventListener("join", (event) => setJoinMessage(JSON.parse(event.data.toString())));
        eventSource.current.addEventListener("quit", (event) => setQuitMessage(JSON.parse(event.data.toString())));
        eventSource.current.addEventListener("draw_card", (event) => setDrawCardMessage(JSON.parse(event.data.toString())));
        eventSource.current.addEventListener("discard_cards", (event) => setDiscardCardsMessage(JSON.parse(event.data.toString())));
        eventSource.current.addEventListener("number_of_cards", (event) => setNumberOfCardsMessage(event.data.toString()));
        eventSource.current.addEventListener("who_turn", (event) => setWhoTurnMessage(event.data.toString()));
        eventSource.current.addEventListener("penalty_cards", (event) => setPenaltyCards(event.data.toString()));
        eventSource.current.addEventListener("direction", (event) => setPenaltyCards(event.data.toString()));

        return () => {
            eventSource.current.removeEventListener("join");
            eventSource.current.removeEventListener("quit");
            eventSource.current.removeEventListener("draw_card");
            eventSource.current.removeEventListener("discard_cards");
            eventSource.current.removeEventListener("number_of_cards");
            eventSource.current.removeEventListener("who_turn");
            eventSource.current.removeEventListener("penalty_cards");
            eventSource.current.removeEventListener("direction");
            eventSource.current.close();
        }
    }, [serviceInstanceId])

    return <>
        <LoadingContainer loading={!ready} text={'连接中'}>
            <RoomDetail
                user={user}
                ready={ready}
                joinMessage={joinMessage}
                quitMessage={quitMessage}
                drawCardMessage={drawCardMessage}
                setDrawCardMessage={setDrawCardMessage}
                discardCardsMessage={discardCardsMessage}
                numberOfCardsMessage={numberOfCardsMessage}
                whoTurnMessage={whoTurnMessage}
                setWhoTurnMessage={setWhoTurnMessage}
                penaltyCards={penaltyCards}
                setPenaltyCards={setPenaltyCards}
                direction={direction}
                setDirection={setDirection}
                serviceInstanceId={serviceInstanceId}
                roomCode={router.query.roomCode}/>
            <ToastContainer/>
        </LoadingContainer>
    </>
}
