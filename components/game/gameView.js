import React, {useContext, useEffect, useState} from "react";
import styles from "./gameView.module.css"
import {gameInfoApi} from "../../apis/game";
import {useRouter} from "next/router";
import {Box, CircularProgress} from "@mui/material";
import {startUnoRoom} from "../../apis/unoRoom";
import {drawCard, nextPlay, playCards} from "../../apis/unoCard";
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
                <div className={styles.cardDeckContainer}
                     onClick={() => {
                         drawCard({roomCode: router.query.code}).then((r) => {
                             if (r.code === '0') {
                                 let cards = gameData.cards.slice(0);
                                 let drawCards = r.data;
                                 for (let i = 0; i < drawCards.length; i++) {
                                     cards.push(drawCards[i]);
                                 }
                                 gameData.setCards(cards);
                             }
                         })
                     }}>
                    Draw Card
                </div>
                <div className={styles.discardDeckContainer}>
                    {
                        gameData.discards.size > 0 ?
                            <>{gameData.discards[0].color + ' ' + gameData.discards[0].point}</>
                            :
                            <>Discards</>
                    }
                </div>
            </div>
            <GameMessage code={router.query.code}
                         gameData={gameData}/>
            <div className={styles.fixBottom}>
                <div className={styles.controllerContainer}>
                    <div className={styles.controllerScroll}>
                        <GameStartButton code={router.query.code}
                                         gameData={gameData}
                                         status={gameData.roomInfo.roomStatus}/>
                        <SkipButton code={router.query.code}
                                    gameData={gameData}
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
    const [chooseColor, setChooseColor] = useState(false);

    const clickToPlayCard = (color) => {
        let discards = gameData.discards;
        if (card.color === 'black' && color == null) {
            toast("please choose color", {
                position: "bottom-center",
                autoClose: 1000,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        // todo local check

        setLoading(true);
        playCards({
            roomCode: code, uuid: card.uuid, color: color != null ? color : card.color
        }, null).then((r) => {
            if (r.code === '0') {
                let cards = gameData.cards.slice(0);
                let newCards = [];
                for (let i = 0; i < cards.length; i++) {
                    if (cards[i].uuid !== card.uuid) {
                        newCards.push(cards[i]);
                    }
                }
                gameData.setCards(newCards);
            } else {
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
        setChooseColor(!chooseColor);
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
                    {
                        chooseColor && card.color === 'black' ?
                            <div className={styles.colorChooseContainer}>
                                <div className={styles.colorChooseInnerContainer}>
                                    <div className={styles.colorButton}
                                         onClick={() => {
                                             clickToPlayCard('red');
                                         }}>
                                        red
                                    </div>
                                    <div className={styles.colorButton}
                                         onClick={() => {
                                             clickToPlayCard('yellow');
                                         }}>
                                        yellow
                                    </div>
                                    <div className={styles.colorButton}
                                         onClick={() => {
                                             clickToPlayCard('blue');
                                         }}>
                                        blue
                                    </div>
                                    <div className={styles.colorButton}
                                         onClick={() => {
                                             clickToPlayCard('green');
                                         }}>
                                        green
                                    </div>
                                </div>
                            </div>
                            :
                            <></>
                    }
                </>
        }
    </div>
}

function SkipButton({code, status, turn, gameData}) {
    if (status === 1 && turn) {
        return <div className={styles.controllerButton}
                    onClick={() => {
                        nextPlay({roomCode: code}).then(r => {
                            if (r.code === '0') {
                                let cards = gameData.cards.slice(0);
                                let drawCards = r.data;
                                for (let i = 0; i < drawCards.length; i++) {
                                    cards.push(drawCards[i]);
                                }
                                gameData.setCards(cards);
                            }
                        })
                    }}>Skip</div>
    } else {
        return <></>
    }
}

function GameStartButton({code, status, gameData}) {
    if (status === 0) {
        return <div className={styles.controllerButton}
                    onClick={() => {
                        startUnoRoom({roomCode: code}).then(r => {
                            if (r.code === '0') {
                                let newRoomInfo = {...gameData.roomInfo};
                                newRoomInfo.roomStatus = 1;
                                gameData.setRoomInfo(newRoomInfo);
                            }
                        })
                    }}>Start Game</div>
    } else {
        return <></>
    }
}
