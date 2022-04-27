import React, {createContext, useContext, useEffect, useReducer} from "react";
import styles from './room.module.css';
import useRoomUser from "../../../hooks/useRoomUser";
import useRoomInfo from "../../../hooks/useRoomInfo";
import MyCards from "../../../components/card/myCards";
import DiscardCards from "../../../components/card/discardCards";
import RoomDashboard from "./roomDashboard";
import RoomUser from "./roomUser";
import {UserContext} from "../../../components/common/loginContainer";
import {SSEContext} from "./roomSSE";
import {LanguageContext} from "../../../components/i18n/i18n";

export const gameActionType = {
    initUser: 'initUser',
    initRoomInfo: 'initRoomInfo',
    join: 'join',
    quit: 'quit',
    in: 'in',
    out: 'out',
    startGame: 'startGame',
    whoTurn: 'whoTurn',
    discards: 'discards',
}

const gameInfo = {
    roomInfo: null, roomUser: null, discards: [], myTurn: false, inNumber: 0, allNumber: 0,
}

const gameReducer = (state, action) => {
    switch (action.type) {
        case gameActionType.discards:
            if (action.data == null) {
                return state;
            }
            return {...state, discards: action.data}
        case gameActionType.whoTurn:
            let whoTurnMessage = action.data;
            let index = parseInt(whoTurnMessage);
            if (index == null) {
                index = state.roomInfo.currentGamer;
            }
            if (index == null) {
                return state;
            }
            let users = state.roomUser;
            if (users === null) {
                return state;
            }
            let currentPlayer = users[index];
            if (currentPlayer == null) return state;
            if (currentPlayer.id === action.user?.data.id) {
                return {
                    ...state, myTurn: true
                }
            } else {
                return {
                    ...state, myTurn: false
                }
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
            return {
                ...state, roomInfo: action.data, allNumber: action.data?.playersSize
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

export default function RoomDetail() {
    const [state, dispatch] = useReducer(gameReducer, gameInfo);
    const language = useContext(LanguageContext);
    const user = useContext(UserContext);
    const {sseState, sseDispatch} = useContext(SSEContext);
    const roomInfo = useRoomInfo(sseState?.roomCode);
    const roomUser = useRoomUser(sseState?.roomCode, sseState?.numberOfCardsMessage);

    useEffect(() => {
        dispatch({type: gameActionType.initRoomInfo, data: roomInfo.data})
    }, [roomInfo.data])

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
        dispatch({type: gameActionType.whoTurn, data: sseState?.whoTurnMessage, user: user})
    }, [sseState?.whoTurnMessage, roomUser.data, user])

    return (<GameContext.Provider value={{state: state, dispatch: dispatch}}>
        <div className={styles.container}>
            <RoomUser/>
            <DiscardCards/>
            <RoomDashboard/>
            <MyCards/>
        </div>
    </GameContext.Provider>);
}
