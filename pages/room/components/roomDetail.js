import React, {createContext, useContext, useEffect, useReducer} from "react";
import styles from './room.module.css';
import useRoomUser from "../../../hooks/useRoomUser";
import useRoomInfo from "../../../hooks/useRoomInfo";
import MyCards from "../../../components/card/myCards";
import DiscardCards from "../../../components/card/discardCards";
import RoomDashboard from "./roomDashboard";
import RoomUser from "./roomUser";
import {UserContext} from "../../../components/common/loginContainer";
import {actionType, SSEContext} from "./roomSSE";

export const gameActionType = {
    initUser: 'initUser',
    initRoomInfo: 'initRoomInfo',
    initCards: 'initCards',
    join: 'join',
    quit: 'quit',
    in: 'in',
    out: 'out',
    startGame: 'startGame',
    whoTurn: 'whoTurn',
    discards: 'discards',
    showColor: 'showColor',
    hideColor: 'hideColor',
    chooseColor: 'chooseColor',
    chooseCard: 'chooseCard',
}

const gameInfo = {
    roomInfo: null,
    roomUser: null,
    cards: [],
    discards: [],
    myTurn: false,
    inNumber: 0,
    allNumber: 0,
    showColor: false,
    chooseColor: null,
    chooseCard: null,
}

const gameReducer = (state, action) => {
    switch (action.type) {
        case gameActionType.chooseCard:
            return {...state, chooseCard: action.data}
        case gameActionType.initCards:
            return {...state, cards: action.data}
        case gameActionType.chooseColor:
            return {...state, chooseColor: action.data}
        case gameActionType.showColor:
            return {...state, showColor: true}
        case gameActionType.hideColor:
            return {...state, showColor: false}
        case gameActionType.discards:
            if (action.data == null) {
                return state;
            }
            return {...state, discards: action.data}
        case gameActionType.whoTurn:
            let whoTurnMessage = action.data;
            let index = parseInt(whoTurnMessage);
            if (index == null) {
                return state;
            }
            let users = action.users;
            if (users === null) {
                return state;
            }
            let currentPlayer = users[index];
            if (currentPlayer == null) return state;
            let my = false;
            if (currentPlayer.id === action.user?.data.id) {
                my = true;
            }

            return {
                ...state, myTurn: my
            }
        case gameActionType.startGame:
            return {
                ...state, roomInfo: {
                    ...state.roomInfo, roomStatus: 1
                }
            }
        case gameActionType.in:
            return {
                ...state, roomInfo: {
                    ...state.roomInfo, isIAmIn: true
                }
            }
        case gameActionType.out:
            return {
                ...state, roomInfo: {
                    ...state.roomInfo, isIAmIn: false
                }
            }
        case gameActionType.initRoomInfo:
            let myTurn = state.myTurn;
            if (action.data?.message == null) {
                let currentGamerIndex = action.data?.currentGamer;
                if (currentGamerIndex == null) {
                    return {
                        ...state, roomInfo: action.data, allNumber: action.data?.playersSize, myTurn: myTurn
                    }
                }
                let roomUsers = action.users;
                if (roomUsers === null) {
                    return {
                        ...state, roomInfo: action.data, allNumber: action.data?.playersSize, myTurn: myTurn
                    }
                }

                let currentPlayerData = roomUsers[currentGamerIndex];
                if (currentPlayerData?.id === action.user?.data.id) {
                    myTurn = true;
                }
            }

            return {
                ...state, roomInfo: action.data, allNumber: action.data?.playersSize, myTurn: myTurn
            }
        case gameActionType.initUser:
            if (action.data == null) {
                return state;
            }
            return {...state, roomUser: action.data, inNumber: action.data.length};
        case gameActionType.join:
            let joinUser = action.data;
            if (joinUser == null || state.roomUser == null) {
                return state;
            }
            for (let i = 0; i < state.roomUser.length; i++) {
                if (state.roomUser[i].id === joinUser.id) {
                    return state;
                }
            }
            let afterJoinUser = state.roomUser.concat().reverse();
            afterJoinUser.push(joinUser);
            return {
                ...state, roomUser: afterJoinUser.reverse(), inNumber: afterJoinUser.length
            };
        case gameActionType.quit:
            let quitUser = action.data;
            if (quitUser == null || state.roomUser == null) {
                return state;
            }
            let afterQuitUser = [];
            for (let i = 0; i < state.roomUser.length; i++) {
                if (state.roomUser[i].id !== quitUser.id) {
                    afterQuitUser.push(state.roomUser[i]);
                }
            }
            return {
                ...state, roomUser: afterQuitUser, inNumber: afterQuitUser.length
            };
        default:
            console.error('error')
    }
}

export const GameContext = createContext({});

const colorWeight = {
    black: 0, red: 1, blue: 2, green: 3, yellow: 4
}

export default function RoomDetail() {
    const [state, dispatch] = useReducer(gameReducer, gameInfo);
    const user = useContext(UserContext);
    const {sseState, sseDispatch} = useContext(SSEContext);
    const roomInfo = useRoomInfo(sseState?.roomCode);
    const roomUser = useRoomUser(sseState?.roomCode, sseState?.numberOfCardsMessage);

    useEffect(() => {
        dispatch({
            type: gameActionType.initRoomInfo,
            data: roomInfo.data,
            user: user,
            users: roomUser.data,
            message: sseState?.whoTurnMessage
        })
        if (roomInfo?.data?.roomStatus > 1) {
            sseDispatch({type: actionType.ending, data: null})
        }
    }, [roomInfo.data, roomUser.data, user])

    useEffect(() => {
        dispatch({type: gameActionType.whoTurn, data: sseState?.whoTurnMessage, user: user, users: roomUser.data})
    }, [sseState?.whoTurnMessage])

    useEffect(() => {
        dispatch({type: gameActionType.initUser, data: roomUser.data})
    }, [roomUser.data])

    useEffect(() => {
        dispatch({type: gameActionType.join, data: sseState?.joinMessage})
    }, [sseState?.joinMessage])

    useEffect(() => {
        dispatch({type: gameActionType.quit, data: sseState?.quitMessage})
    }, [sseState?.quitMessage])

    useEffect(() => {
        if (state.roomInfo?.roomStatus === 0) {
            roomInfo.setFlag(!roomInfo.flag);
        }

        let drawCardMessage = sseState?.drawCardMessage;
        let cards = state?.cards;

        if (drawCardMessage === null) {
            return;
        }
        let sorted = cards.concat();
        for (let i = 0; i < drawCardMessage?.length; i++) {
            sorted.push(drawCardMessage[i]);
        }
        let temp;

        for (let i = sorted.length; i > 0; i--) {
            for (let j = 0; j < i - 1; j++) {
                if (colorWeight[sorted[j].color] > colorWeight[sorted[j + 1].color]) {
                    temp = sorted[j];
                    sorted[j] = sorted[j + 1];
                    sorted[j + 1] = temp;
                }
            }
        }

        for (let i = sorted.length; i > 0; i--) {
            for (let j = 0; j < i - 1; j++) {
                if (sorted[j].color !== sorted[j + 1].color) {
                    continue;
                }
                if (sorted[j].point > sorted[j + 1].point) {
                    temp = sorted[j];
                    sorted[j] = sorted[j + 1];
                    sorted[j + 1] = temp;
                }
            }
        }

        dispatch({type: gameActionType.initCards, data: sorted})
    }, [sseState?.drawCardMessage])

    return (<GameContext.Provider value={{state: state, dispatch: dispatch}}>
        <div className={styles.container}>
            <RoomUser/>
            <DiscardCards/>
            <RoomDashboard/>
            <MyCards/>
        </div>
    </GameContext.Provider>);
}
