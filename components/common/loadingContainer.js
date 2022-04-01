import React from 'react';
import styles from '../../css/loading.module.css';

export default function LoadingContainer({loading, text, children}) {
    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}/>
                <div className={styles.text}>{text}</div>
            </div>
        );
    } else {
        return <>{children}</>
    }
}
