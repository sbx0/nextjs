import React, {useEffect, useRef, useState} from 'react';
import GlobalHeader from "../components/common/header";
import Footer from "../components/common/footer";
import 'react-toastify/dist/ReactToastify.css';
import CallApiButton from "../components/common/callApiButton";
import styles from '../css/index.module.css';
import {infoMatch, joinMatch, quitMatch} from "../apis/match";
import {EventSourcePolyfill} from "event-source-polyfill";
import {useRouter} from "next/router";

export default function Index() {
    const eventSource = useRef();
    const router = useRouter();

    const [size, setSize] = useState(0);
    const [matching, setMatching] = useState(false);

    useEffect(() => {
        infoMatch().then((response) => {
            if (response.code === "0") {
                setSize(response.data.size);
                setMatching(response.data.join);
            }
        })
    }, [])

    useEffect(() => {
        eventSource.current = new EventSourcePolyfill(
            "/UNO/message/subscribe/match", {
                headers: {
                    'version': process.env.NEXT_PUBLIC_VERSION,
                }
            }
        )

        eventSource.current.onmessage = (event) => {
        }

        eventSource.current.onerror = (event) => {
            console.log('onerror')
        }

        eventSource.current.onopen = (event) => {
            console.log('onopen')
        }

        eventSource.current.addEventListener("match_info", (event) => {
            console.log("match_info ", event.data)
            setSize(event.data);
        });

        eventSource.current.addEventListener("match_found", (event) => {
            console.log("match_found ", event.data)
            router.push("/room/" + event.data).then(r => r);
        });

        return () => {
            eventSource.current.removeEventListener("match_info");
            eventSource.current.removeEventListener("match_found");
            eventSource.current.close();
        }
    }, [])

    let button;

    if (matching) {
        button = <CallApiButton
            buttonText={'取消匹配，' + size + '人正在匹配中'}
            loadingText={'正在取消'}
            api={quitMatch}
            onSuccess={() => {
                setMatching(false);
            }}
        />
    } else {
        button = <CallApiButton
            buttonText={'开始匹配，' + size + '人正在匹配中'}
            loadingText={'正在匹配'}
            api={joinMatch}
            params={{
                "gamerSize": 2,
                "allowBot": false
            }}
            onSuccess={() => {
                setMatching(true);
            }}
        />
    }

    return (
        <>
            <GlobalHeader/>
            <div className={styles.container}>
                {button}
            </div>
            <Footer/>
        </>
    );
}
