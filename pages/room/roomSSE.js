import React, {createContext, useEffect, useReducer, useRef} from "react";
import {useRouter} from "next/router";
import {EventSourcePolyfill} from "event-source-polyfill";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import LoadingContainer from "../../components/common/loadingContainer";
import RoomDetail from "./roomDetail";
import {serviceInstanceChoose} from "../../apis/serviceInstance";

export const actionType = {
    roomCode: "roomCode",
    ready: "ready",
    notReady: "notReady",
    instance: "instance",
    join: "join",
    quit: "quit",
    draw: "draw",
    discard: "discard",
    number: "number",
    who: "who",
    penalty: "penalty",
    direction: "direction",
};

const message = {
    ready: false,
    serviceInstanceId: null,
    joinMessage: null,
    quitMessage: null,
    drawCardMessage: null,
    discardCardsMessage: null,
    numberOfCardsMessage: null,
    whoTurnMessage: '0',
    penaltyCards: '0',
    direction: 'normal',
    roomCode: null
};

export const SSEContext = createContext(message);

const reducer = (state, action) => {
    switch (action.type) {
        case actionType.roomCode:
            return {...state, roomCode: action.data};
        case actionType.ready:
            return {...state, ready: true};
        case actionType.notReady:
            return {...state, ready: false};
        case actionType.instance:
            return {...state, serviceInstanceId: action.data};
        case actionType.join:
            return {...state, joinMessage: action.data};
        case actionType.quit:
            return {...state, quitMessage: action.data};
        case actionType.draw:
            return {...state, drawCardMessage: action.data};
        case actionType.discard:
            return {...state, discardCardsMessage: action.data};
        case actionType.number:
            return {...state, numberOfCardsMessage: action.data};
        case actionType.who:
            return {...state, whoTurnMessage: action.data};
        case actionType.penalty:
            return {...state, penaltyCards: action.data};
        case actionType.direction:
            return {...state, direction: action.data};
        default:
            throw new Error('Unexpected action');
    }
};

export default function RoomSSE() {
    const [state, dispatch] = useReducer(reducer, message);
    const router = useRouter();
    const eventSource = useRef();

    useEffect(() => {
        dispatch({type: actionType.roomCode, data: router.query.roomCode})
    }, [])

    useEffect(() => {
        if (router.query.roomCode === null || router.query.roomCode === undefined || router.query.roomCode === '') {
            return;
        }
        serviceInstanceChoose({roomCode: router.query.roomCode}).then((response) => {
            if (response.code === '0') {
                dispatch({type: actionType.instance, data: response.data})
            }
        })
    }, [router.query.roomCode])

    useEffect(() => {
        if (state.serviceInstanceId === null) {
            return;
        }

        if (router.query.roomCode === null || router.query.roomCode === undefined || router.query.roomCode === '') {
            return;
        }

        eventSource.current = new EventSourcePolyfill(
            "/UNO/uno/room/subscribe/" + router.query.roomCode, {
                headers: {
                    'version': process.env.NEXT_PUBLIC_VERSION,
                    'instance-id': state.serviceInstanceId
                }
            }
        )

        eventSource.current.onmessage = (event) => {
            console.log('onmessage')
        }

        eventSource.current.onerror = (event) => {
            console.log('onerror')
            dispatch({type: 'notReady'})
        }

        eventSource.current.onopen = (event) => {
            console.log('onopen')
            dispatch({type: 'ready'})
        }

        eventSource.current.addEventListener("join", (event) => dispatch({
            type: actionType.join,
            data: JSON.parse(event.data.toString())
        }));
        eventSource.current.addEventListener("quit", (event) => dispatch({
            type: actionType.quit,
            data: JSON.parse(event.data.toString())
        }));
        eventSource.current.addEventListener("draw_card", (event) => dispatch({
            type: actionType.draw,
            data: JSON.parse(event.data.toString())
        }));
        eventSource.current.addEventListener("discard_cards", (event) => dispatch({
            type: actionType.discard,
            data: JSON.parse(event.data.toString())
        }));
        eventSource.current.addEventListener("number_of_cards", (event) => dispatch({
            type: actionType.number,
            data: event.data.toString()
        }));
        eventSource.current.addEventListener("who_turn", (event) => dispatch({
            type: actionType.who,
            data: event.data.toString()
        }));
        eventSource.current.addEventListener("penalty_cards", (event) => dispatch({
            type: actionType.penalty,
            data: event.data.toString()
        }));
        eventSource.current.addEventListener("direction", (event) => dispatch({
            type: actionType.direction,
            data: event.data.toString()
        }));

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
    }, [state.serviceInstanceId])

    return <>
        <LoadingContainer loading={!state.ready} text={'连接中'}>
            <SSEContext.Provider value={{sseState: state, sseDispatch: dispatch}}>
                <RoomDetail/>
                <ToastContainer/>
            </SSEContext.Provider>
        </LoadingContainer>
    </>
}
