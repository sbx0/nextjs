import React from 'react';
import styles from '../../css/loading.module.css';

export default function Loading({text}) {
    return (
        <>
            <div className={styles.loading}/>
            <div className={styles.text}>{text}</div>
        </>
    );
}
