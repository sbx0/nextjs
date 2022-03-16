import React, {useEffect, useState} from 'react';
import moment from "moment";
import 'moment/locale/zh-cn';
import styles from '../../css/account/index.module.css';
import GlobalHeader from "../../components/common/header";
import Footer from "../../components/common/footer";

export default function Index({}) {
    const weeks = [1, 2, 3, 4, 5, 6];
    return (
        <>
            <GlobalHeader/>
            <div className={styles.table}>
                <h1>{moment().format('YYYY')} / {moment().format('MM')}</h1>
            </div>
            <table className={styles.table}>
                <thead>
                <Weeks/>
                </thead>
                <tbody className={styles.tbody}>
                {
                    weeks.map((week) => <Days key={'weeks_' + week} col={week}/>)
                }
                </tbody>
            </table>
            <Footer/>
        </>
    );
}

function Weeks() {
    moment.locale('zh-cn');
    const [choose, setChoose] = useState(true);
    const [weeks, setWeeks] = useState([]);

    useEffect(() => {
        // choose 为 false 时 周一开始
        // choose 为 true 时 周日开始
        let index = moment().format('E');
        let w = []
        for (let i = 0; i < 7; i++) {
            w[i] = moment().subtract(index - i - 1, 'days').format('dddd');
        }
        setWeeks(w);
    }, [choose])

    return <tr>
        {
            weeks.map((value, index) => {
                return <td key={index} className={styles.week}>{value}</td>;
            })
        }
    </tr>;
}

function Days({col}) {
    moment.locale('zh-cn');
    const [choose, setChoose] = useState(true);
    const [weeks, setWeeks] = useState([]);

    useEffect(() => {
        let now = moment();
        let todayMonth = now.format('M');
        let monthBegin = moment().startOf('month');
        let weekBegin = monthBegin.startOf('weeks');
        weekBegin.subtract(1, 'days');
        for (let i = 0; i < (col - 1) * 7; i++) {
            weekBegin.add(1, 'days');
        }
        let w = [];
        for (let i = 0; i < 7; i++) {
            let today = weekBegin.add(1, 'days');
            let month = today.format('M');
            if (now.format('YYYYMMDD') === today.format('YYYYMMDD')) {
                w[i] = <span className={styles.now}>{today.format('D')}</span>;
            } else if (todayMonth === month) {
                w[i] = today.format('D');
            } else {
                w[i] = '';
            }
        }
        setWeeks(w);
    }, [choose])

    return <tr>
        {
            weeks.map((value, index) => {
                return <td key={index} className={styles.day}>
                    <DayDetail value={value}/>
                </td>;
            })
        }
    </tr>
}

function DayDetail({value}) {
    return <div className={styles.dayDetail}>
        {value}
    </div>
}
