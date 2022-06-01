import React, {useEffect, useRef, useState} from "react";
import styles from "./gameMessage.module.css";
import {EventSourcePolyfill} from "event-source-polyfill";
import {useRouter} from "next/router";
import moment from "moment/moment";

export default function GameMessage({code, gameInfo, setGameInfo}) {
    const [messages, setMessages] = useState([]);
    const router = useRouter();
    const eventSource = useRef();

    const addMessage = ({type, content}) => {
        messages.push({
            type: type,
            content: moment().format('HH:mm:ss ') + type + ' ' + content,
        })

        if (messages.length > 20) {
            messages.reverse();
            messages.pop();
            messages.reverse();
        }

        setMessages(messages.slice(0));
    }

    useEffect(() => {
        if (code === null || code === undefined || code === '') {
            return;
        }

        eventSource.current = new EventSourcePolyfill(
            "/UNO/message/subscribe/" + code, {
                headers: {
                    'version': process.env.NEXT_PUBLIC_VERSION
                }
            }
        )

        eventSource.current.onmessage = (event) => {
            console.log(moment().format('HH:mm:ss ') + 'ping')
        }

        eventSource.current.onerror = (event) => {
            addMessage({type: 'error', content: 'error'})
        }

        eventSource.current.onopen = (event) => {
            addMessage({type: 'connect', content: 'connect'})
        }

        eventSource.current.addEventListener("join", (event) => {
            addMessage({type: 'join', content: event.data.toString()})
        });
        eventSource.current.addEventListener("quit", (event) => {
            addMessage({type: 'quit', content: event.data.toString()})
        });
        eventSource.current.addEventListener("draw_card", (event) => {
            addMessage({type: 'draw_card', content: event.data.toString()})
        });
        eventSource.current.addEventListener("discard_cards", (event) => {
            addMessage({type: 'discard_cards', content: event.data.toString()})
        });
        eventSource.current.addEventListener("number_of_cards", (event) => {
            let data = event.data.toString();
            let message = data.split('=');
            let userId = parseInt(message[0]);
            let numbers = message[1];
            let newGameInfo = {...gameInfo};
            let gamers = newGameInfo.gamers;
            for (let i = 0; i < gamers.length; i++) {
                if (gamers[i].id === userId) {
                    gamers[i].numberOfCards = numbers;
                    break;
                }
            }
            newGameInfo.gamers = gamers;
            setGameInfo(newGameInfo);
            console.log(moment().format('HH:mm:ss ') + 'number_of_cards')
        });
        eventSource.current.addEventListener("who_turn", (event) => {
            let newGameInfo = {...gameInfo};
            let currentId = gameInfo.currentGamer.id;
            newGameInfo.roomInfo.currentGamer = parseInt(event.data.toString());
            let currentTurnGamer = gameInfo.gamers[parseInt(event.data.toString())];
            let currentTurnId = currentTurnGamer.id;
            let myTurn = currentId === currentTurnId;
            newGameInfo.roomInfo.whoTurn = myTurn;
            setGameInfo(newGameInfo);
            if (!myTurn) {
                addMessage({type: 'who_turn', content: "It's time for " + currentTurnGamer.nickname});
            } else {
                addMessage({type: 'who_turn', content: "Your turn!!!"});
            }
        });
        eventSource.current.addEventListener("penalty_cards", (event) => {
            addMessage({type: 'penalty_cards', content: event.data.toString()})
        });
        eventSource.current.addEventListener("direction", (event) => {
            addMessage({type: 'direction', content: event.data.toString()})
        });
        eventSource.current.addEventListener("ending", (event) => {
            addMessage({type: 'ending', content: event.data.toString()})
        });

        return () => {
            eventSource.current.removeEventListener("join");
            eventSource.current.removeEventListener("quit");
            eventSource.current.removeEventListener("draw_card");
            eventSource.current.removeEventListener("discard_cards");
            eventSource.current.removeEventListener("number_of_cards");
            eventSource.current.removeEventListener("who_turn");
            eventSource.current.removeEventListener("penalty_cards");
            eventSource.current.removeEventListener("direction");
            eventSource.current.removeEventListener("ending");
            eventSource.current.close();
        }
    }, []);

    return <div className={styles.messageContainer}>
        <div className={styles.messageScrollContainer}>
            {messages.reverse().map((m, index) => <p key={index + m.type}>
                {m.content}
            </p>)}
        </div>
    </div>
}
