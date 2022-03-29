import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import {createUnoRoom, pagingUnoRoomsApi} from "../apis/unoRoom";
import styles from '../css/index.module.css';
import GlobalHeader from "../components/common/header";
import Footer from "../components/common/footer";
import cookie from "cookie";
import 'react-toastify/dist/ReactToastify.css';
import CallApiButton from "../components/common/callApiButton";
import {sseSend} from "../apis/sse";
import {EventSourcePolyfill} from 'event-source-polyfill';
import {toast} from "react-toastify";

export default function Index({data}) {
    const [page, setPage] = useState(2);
    const [pageSize, setPageSize] = useState(20);
    const [records, setRecords] = useState(data);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        if (data.length < pageSize) {
            setHasMore(false);
        }
    }, [])

    useEffect(() => {
        listContent();

        let eventSource = new EventSourcePolyfill(
            "/UNO/sse/subscribe", {
                headers: {
                    'version': process.env.NEXT_PUBLIC_VERSION
                }
            }
        );

        eventSource.addEventListener("message", (event) => {
            toast(event.data, {
                position: "bottom-center",
                autoClose: 1000,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
        });

        sseSend().then(r => {
            console.log(r)
        })

    }, [page])

    const refresh = () => {
        setHasMore(true);
        setPage(1);
    }

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
                <CallApiButton
                    buttonText={'创建房间'}
                    loadingText={'正在创建'}
                    api={createUnoRoom}
                    params={{
                        "roomName": "Friendship first",
                        "playersSize": 4,
                        "privacyFlag": 0,
                        "remark": "Auto Create"
                    }}
                    onSuccess={refresh}
                />
                {
                    records.map(record => <div key={record.id}
                                               className={styles.card}>
                        <p>{record.createTime} [{record.playersInSize}/{record.playersSize}]</p>
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
        page: 1,
        size: 20
    }, cookies);

    if (response.code === "0") {
        return {props: {data: response.data}}
    }

    return {props: {data: []}}
}
