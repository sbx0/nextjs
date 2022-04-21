import React, {createContext, useContext, useEffect, useReducer, useState} from "react";
import styles from './room.module.css';
import useRoomUser from "../../../hooks/useRoomUser";
import CallApiButton from "../../../components/common/callApiButton";
import {joinRoom, quitRoom} from "../../../apis/unoRoomUser";
import useRoomInfo from "../../../hooks/useRoomInfo";
import {startUnoRoom} from "../../../apis/unoRoom";
import MyCards from "../../../components/card/myCards";
import DiscardCards from "../../../components/card/discardCards";
import RoomDashboard from "./roomDashboard";
import RoomUser from "./roomUser";
import {UserContext} from "../../../components/common/loginContainer";
import {SSEContext} from "./roomSSE";
import {LanguageContext} from "../../../components/i18n/i18n";

const actionType = {
    initUser: 'initUser',
    initRoomInfo: 'initRoomInfo',
    join: 'join',
    quit: 'quit',
    in: 'in',
    out: 'out',
    startGame: 'startGame',
}

const gameInfo = {
    roomInfo: null,
    roomUser: null,
    discards: null,
    myTurn: null,
    inNumber: 0,
    allNumber: 0,
}

const gameReducer = (state, action) => {
    switch (action.type) {
        case actionType.startGame:
            return {
                ...state,
                roomInfo: {
                    ...state.roomInfo,
                    roomStatus: 1
                }
            }
        case actionType.in:
            return {
                ...state,
                roomInfo: {
                    ...state.roomInfo,
                    isIAmIn: true
                }
            }
        case actionType.out:
            return {
                ...state,
                roomInfo: {
                    ...state.roomInfo,
                    isIAmIn: false
                }
            }
        case actionType.initRoomInfo:
            return {
                ...state,
                roomInfo: action.data,
                allNumber: action.data?.playersSize
            }
        case actionType.initUser:
            if (action.data == null) {
                return state;
            }
            return {...state, roomUser: action.data, inNumber: action.data.length};
        case actionType.join:
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
                ...state,
                roomUser: afterJoinUser.reverse(),
                inNumber: afterJoinUser.length
            };
        case actionType.quit:
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
                ...state,
                roomUser: afterQuitUser,
                inNumber: afterQuitUser.length
            };
        default:
            throw new Error('Unexpected action');
    }
}

export const GameContext = createContext(null);

export default function RoomDetail() {
    const [state, dispatch] = useReducer(gameReducer, gameInfo);
    const language = useContext(LanguageContext);
    const user = useContext(UserContext);
    const {sseState, sseDispatch} = useContext(SSEContext);
    const roomInfo = useRoomInfo(sseState.roomCode);
    const roomUser = useRoomUser(sseState.roomCode, sseState.numberOfCardsMessage);
    const [isIAmIn, setIsIAmIn] = useState(false);
    const [roomStatus, setRoomStatus] = useState(0);
    const [roomSize, setRoomSize] = useState({
        in: 0,
        all: 0
    });
    const [discards, setDiscards] = useState([]);
    const [myTurn, setMyTurn] = useState(false);

    useEffect(() => {
        console.log('state ', state)
    }, [state])

    useEffect(() => {
        dispatch({type: actionType.initRoomInfo, data: roomInfo.data})
    }, [roomInfo.data])

    useEffect(() => {
        dispatch({type: actionType.initUser, data: roomUser.data})
    }, [roomUser.data])

    useEffect(() => {
        dispatch({type: actionType.join, data: sseState.joinMessage})
    }, [sseState.joinMessage])

    useEffect(() => {
        dispatch({type: actionType.quit, data: sseState.quitMessage})
    }, [sseState.quitMessage])

    return (
        <GameContext.Provider value={{gameState: state, gameDispatch: dispatch}}>
            <div className={styles.container}>
                {
                    state.roomInfo?.roomStatus === 0 ?
                        <CallApiButton
                            buttonText={(state.roomInfo?.isIAmIn ? language.quitRoom : language.joinRoom) + state.inNumber + '/' + state.allNumber}
                            loadingText={(state.roomInfo?.isIAmIn ? language.quitingRoom : language.joiningRoom)}
                            api={state.roomInfo?.isIAmIn ? quitRoom : joinRoom}
                            params={{
                                "roomCode": sseState.roomCode,
                                "instance-id": sseState.serviceInstanceId,
                            }}
                            onSuccess={() => {
                                if (state.roomInfo?.isIAmIn) {
                                    dispatch({type: actionType.out})
                                } else {
                                    dispatch({type: actionType.in})
                                }
                            }}
                        />
                        :
                        <></>
                }
                <RoomUser roomUser={state.roomUser}/>
                {
                    state.inNumber === state.allNumber && state.roomInfo?.isIAmIn && state.roomInfo?.roomStatus === 0 ?
                        <CallApiButton
                            buttonText={language.begin}
                            loadingText={language.loading}
                            api={startUnoRoom}
                            params={{
                                "roomCode": sseState.roomCode,
                                "instance-id": sseState.serviceInstanceId,
                            }}
                            onSuccess={() => {
                                dispatch({type: actionType.startGame})
                            }}
                        />
                        :
                        <></>
                }
                <DiscardCards data={discards}
                              setData={setDiscards}/>
                {
                    myTurn ?
                        <RoomDashboard myTurn={myTurn}
                                       roomSize={roomSize}
                                       roomStatus={roomStatus}
                                       isIAmIn={isIAmIn}/>
                        :
                        <></>
                }
                <MyCards discards={discards}
                         setDiscards={setDiscards}/>
            </div>
        </GameContext.Provider>
    );
}
