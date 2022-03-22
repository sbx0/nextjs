import React from 'react';
import styles from './card.module.css';

export default function Card({card}) {

    // card.color
    // card.point
    return <div className={styles.container}>
        <div className={styles['bg-' + card.color]}>
            <div className={styles.numberUp}>
                {card.point}
            </div>
            <div className={styles.number}>
                {card.point}
            </div>
            <div className={styles.numberDown}>
                {card.point}
            </div>
        </div>
    </div>;
}
