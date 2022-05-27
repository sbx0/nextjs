import React from "react";
import styles from "./gameView.module.css"

export default function GameView() {
    const gamers = [
        {'id': 'gamer1', 'name': 'gamer1'},
        {'id': 'gamer2', 'name': 'gamer2'},
        {'id': 'gamer3', 'name': 'gamer3'},
        {'id': 'gamer4', 'name': 'gamer4'},
        {'id': 'gamer5', 'name': 'gamer5'},
    ];

    return <div className={styles.viewContainer}>
        <div className={styles.gamersContainer}>
            <div className={styles.gamersScroll}>
                {gamers.map((gamer) =>
                    <div key={gamer.id}
                         id={gamer.id}
                         className={styles.gamerContainer}>
                        <div className={styles.gamerName}>
                            {gamer.name}
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
        <div className={styles.fixBottom}>
            <div className={styles.panelContainer}>

            </div>
        </div>
        <div className={styles.gamersContainer} hidden>
            {gamers.map((gamer) =>
                <div>
                    <a href={'#' + gamer.id}>{gamer.name}</a>&nbsp;
                </div>
            )}
        </div>
    </div>
}
