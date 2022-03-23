import React from 'react';
import styles from './discardCard.module.css';

export default function DiscardCard({card}) {
    return <div className={styles.container}>
        <div className={styles['bg-' + card.color]}>
            <div className={styles.numberUp}>
                {card.point}
            </div>
            <div className={styles.number}>
            </div>
            <div className={styles.numberDown}>
                {card.point}
            </div>
        </div>
    </div>
}
