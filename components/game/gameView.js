import React, {useContext, useEffect, useState} from "react";
import styles from "./gameView.module.css"
import {gameInfoApi} from "../../apis/game";
import {useRouter} from "next/router";
import {Box, CircularProgress} from "@mui/material";
import {startUnoRoom} from "../../apis/unoRoom";
import {nextPlay, playCards} from "../../apis/unoCard";
import GameMessage from "./gameMessage";
import {toast} from "react-toastify";
import useSingleAndDoubleClick from "../common/useSingleAndDoubleClick";
import {LanguageContext} from "../i18n/i18n";

export default function GameView({gameData}) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (router.query.code === null || router.query.code === undefined || router.query.code === '') {
            return;
        }
        gameInfoApi({code: router.query.code}).then(r => {
            if (r.code === '0') {
                // who turn begin
                let currentId = r.data.currentGamer.id;
                let currentTurnId = r.data.gamers[r.data.roomInfo.currentGamer].id;
                r.data.roomInfo.whoTurn = currentId === currentTurnId;
                // who turn end
                gameData.setRoomInfo(r.data.roomInfo);
                gameData.setCurrentGamer(r.data.currentGamer);
                gameData.setGamers(r.data.gamers);
                gameData.setCards(r.data.cards);
                gameData.setDiscards(r.data.discards);
                setLoading(false);
            }
        })
    }, [router.query.code]);

    if (loading) {
        return <Box sx={{display: 'flex'}}>
            <CircularProgress/>
        </Box>
    } else {
        return <div className={styles.viewContainer}>
            <div className={styles.gamersContainer}>
                <div className={styles.gamersScroll}>
                    {gameData.gamers.map((gamer) =>
                        <div key={gamer.id}
                             id={gamer.id}
                             className={styles.gamerContainer}>
                            <div className={styles.gamerName}>
                                {gamer.nickname}
                            </div>
                            <div className={styles.gamerName}>
                                {gamer.numberOfCards}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className={styles.deckContainer}>
                <div className={styles.cardDeckContainer}>
                    Draw Card
                </div>
                <div className={styles.discardDeckContainer}>
                    {
                        gameData.discards[0].color + ' ' + gameData.discards[0].point
                    }
                </div>
            </div>
            <GameMessage code={router.query.code}
                         gameData={gameData}/>
            <div className={styles.fixBottom}>
                <div className={styles.controllerContainer}>
                    <div className={styles.controllerScroll}>
                        <GameStartButton code={router.query.code}
                                         status={gameData.roomInfo.roomStatus}/>
                        <SkipButton code={router.query.code}
                                    status={gameData.roomInfo.roomStatus}
                                    turn={gameData.roomInfo.whoTurn}/>
                    </div>
                </div>
                <div className={styles.panelContainer}>
                    <div className={styles.myCardsContainer}>
                        {gameData.cards.map((card) =>
                            <Card key={card.uuid}
                                  card={card}
                                  code={router.query.code}
                                  gameData={gameData}/>
                        )}
                    </div>
                </div>
            </div>
            <div className={styles.gamersContainer} hidden>
                {gameData.gamers.map((gamer) =>
                    <div key={gamer.id}>
                        <a href={'#' + gamer.id}>{gamer.name}</a>&nbsp;
                    </div>
                )}
            </div>
        </div>
    }
}

function Card({card, code, gameData}) {
    const language = useContext(LanguageContext);
    const [loading, setLoading] = useState(false);

    const clickToPlayCard = () => {
        let discards = gameData.discards;

        // todo local check

        setLoading(true);
        playCards({
            roomCode: code, uuid: card.uuid, color: card.color
        }, null).then((response) => {
            if (response.code !== '0') {
                toast("can't play", {
                    position: "bottom-center",
                    autoClose: 1000,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                });
            }
            setLoading(false);
        })

    }

    const better = (text) => {
        switch (text) {
            case 'wild':
                return language.wild;
            case 'wild draw four':
                return language.wildDrawFour;
            case 'draw two':
                return language.drawTwo;
            case 'reverse':
                return language.reverse;
            case 'skip':
                return language.skip;
            default:
                return text;
        }
    }

    const singleClick = () => {

    }

    const click = useSingleAndDoubleClick(singleClick, clickToPlayCard);

    return <div className={styles.cardContainer} onClick={click}>
        {
            loading ?
                <CircularProgress/>
                :
                <>
                    <p>{card.color}</p>
                    <p>{better(card.point)}</p>
                </>
        }
    </div>
}

function SkipButton({code, status, turn}) {
    if (status === 1 && turn) {
        return <div className={styles.controllerButton}
                    onClick={() => {
                        nextPlay({roomCode: code}).then(r => {
                            if (r.code === '0') {
                                console.log('next play')
                            }
                        })
                    }}>Skip</div>
    } else {
        return <></>
    }
}

function GameStartButton({code, status}) {
    if (status === 0) {
        return <div className={styles.controllerButton}
                    onClick={() => {
                        startUnoRoom({roomCode: code}).then(r => {
                            if (r.code === '0') {
                                console.log('game start')
                            }
                        })
                    }}>Start Game</div>
    } else {
        return <></>
    }
}
