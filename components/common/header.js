import {useState} from 'react';
import {useRouter} from 'next/router';
import styles from '../../css/header.module.css';

export default function GlobalHeader() {
    const router = useRouter();
    const [checked, setChecked] = useState(false);

    return (
        <div className={styles.body}>
            <header className={checked ? styles.headerBlack : styles.header}>
                <input id="toggler"
                       className={styles.toggler}
                       type="checkbox"
                       checked={checked}
                       onChange={() => {
                       }}
                       onClick={(event) => setChecked(event.currentTarget.checked)}/>
                <label htmlFor="toggler">
                    <div className={styles.hamburgerContainer}>
                        <span/>
                        <span/>
                    </div>
                </label>
                <div className={styles.navItems}>
                    <ul>
                        <li onClick={() => {
                            setChecked(false);
                            router.push("/")
                        }}>
                            首页
                        </li>
                        <li onClick={() => {
                            setChecked(false);
                            router.push("/login")
                        }}>
                            登录
                        </li>
                    </ul>
                </div>
            </header>
        </div>
    );
}
