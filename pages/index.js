import React, {useState} from 'react';
import Link from 'next/link';
import {pagingUnoRoomsApi} from "../apis/unoRoom";
import styles from '../css/index.module.css';
import GlobalHeader from "../components/common/header";
import Footer from "../components/common/footer";
import cookie from "cookie";

export default function Index({data}) {
    const [page, setPage] = useState(2);
    const [pageSize, setPageSize] = useState(20);
    const [records, setRecords] = useState(data);
    const [hasMore, setHasMore] = useState(true);

    const listContent = () => {
        if (!hasMore) {
            return;
        }
        pagingUnoRoomsApi({
            page: page,
            size: pageSize
        }).then((response) => {
            let data = response.data;
            if (page === 1) {
                setRecords(data);
            } else {
                let slice = records.slice(0);
                for (let i = 0; i < data.length; i++) {
                    slice.push(data[i]);
                }
                setRecords(slice);
            }
            let total = response.total;
            let pageSize = response.size;
            let totalPages = Math.ceil(total / pageSize);
            if (page + 1 > totalPages) {
                setHasMore(false);
            } else {
                setPage(page + 1);
                setHasMore(true);
            }
        })
    }

    return (
        <>
            <GlobalHeader/>
            <div className={styles.container}>
                {
                    records.map(record => <div key={record.id}
                                               className={styles.card}>
                        <p>{record.crateTime}</p>
                        <Link href={'/room/' + record.roomCode}>
                            <h4>{record.roomName}</h4>
                        </Link>
                        <p>{record.remark}</p>
                    </div>)
                }
                <div className={styles.loadingButtonDiv}>
                    {
                        hasMore ? <button onClick={() => listContent()}>Loading More</button> : <></>
                    }
                </div>
            </div>
            <Footer/>
        </>
    );
}

export async function getServerSideProps({req, query}) {
    const cookies = cookie.parse(req ? req.headers.cookie || "" : document.cookie);
    const response = await pagingUnoRoomsApi({
        pageIndex: 1,
        pageSize: 20
    }, cookies);
    if (response) {
        return {props: {data: response.data}}
    } else {
        return {props: {data: []}}
    }
}
