import React, {useEffect, useState} from "react";
import styles from "./gameView.module.css"
import {gameInfoApi} from "../../apis/game";
import {useRouter} from "next/router";
import {Box, CircularProgress} from "@mui/material";
import {startUnoRoom} from "../../apis/unoRoom";
import {nextPlay} from "../../apis/unoCard";
import GameMessage from "./gameMessage";

export default function GameView({gameInfo, setGameInfo}) {
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
                setGameInfo(r.data);
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
                    {gameInfo.gamers.map((gamer) =>
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
                    Discard Card
                </div>
            </div>
            <GameMessage code={router.query.code}
                         gameInfo={gameInfo}
                         setGameInfo={setGameInfo}/>
            <div className={styles.fixBottom}>
                <div className={styles.controllerContainer}>
                    <div className={styles.controllerScroll}>
                        <GameStartButton code={router.query.code}
                                         status={gameInfo.roomInfo.roomStatus}/>
                        <SkipButton code={router.query.code}
                                    status={gameInfo.roomInfo.roomStatus}
                                    turn={gameInfo.roomInfo.whoTurn}/>
                    </div>
                </div>
                <div className={styles.panelContainer}>
                    <div className={styles.myCardsContainer}>
                        {gameInfo.cards.map((card) =>
                            <div key={card.uuid} className={styles.cardContainer}>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className={styles.gamersContainer} hidden>
                {gameInfo.gamers.map((gamer) =>
                    <div key={gamer.id}>
                        <a href={'#' + gamer.id}>{gamer.name}</a>&nbsp;
                    </div>
                )}
            </div>
        </div>
    }
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
