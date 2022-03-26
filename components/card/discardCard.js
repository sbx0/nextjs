import React from 'react';
import styles from './discardCard.module.css';

export default function DiscardCard({card}) {

    const better = (text) => {
        switch (text) {
            case 'wild':
                return '变色';
            case 'wild draw four':
                return '+4';
            case 'draw two':
                return '+2';
            case 'reverse':
                return '逆转';
            case 'skip':
                return '跳过';
            default:
                return text;
        }
    }

    return <div className={styles.container}>
        <div className={styles['bg-' + card.color]}>
            <div className={styles.numberUp}>
                {better(card.point)}
            </div>
            <div className={styles.number}>
                {better(card.point)}
            </div>
            <div className={styles.numberDown}>
                {better(card.point)}
            </div>
        </div>
    </div>
}