import React, {useEffect, useRef, useState} from 'react';
import GlobalHeader from "../components/common/header";
import Footer from "../components/common/footer";
import 'react-toastify/dist/ReactToastify.css';
import CallApiButton from "../components/common/callApiButton";
import styles from '../css/index.module.css';
import {infoMatch, joinMatch, quitMatch} from "../apis/match";
import {EventSourcePolyfill} from "event-source-polyfill";
import {useRouter} from "next/router";
import {Box, CircularProgress, FormControl, InputLabel, MenuItem, Select} from "@mui/material";

export default function Index() {
    const eventSource = useRef();
    const router = useRouter();

    const [size, setSize] = useState(0);
    const [gamerSize, setGamerSize] = useState(2);
    const [matching, setMatching] = useState(false);

    useEffect(() => {
        infoMatch().then((response) => {
            if (response.code === "0") {
                if (response.data.choose == null) {
                    setGamerSize(2);
                } else {
                    setGamerSize(parseInt(response.data.choose))
                }
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
            setSize(event.data);
        });

        eventSource.current.addEventListener("match_found", (event) => {
            router.push("/game/" + event.data).then(r => r);
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
            buttonText={'取消匹配'}
            loadingText={'正在取消'}
            api={quitMatch}
            onSuccess={() => {
                setMatching(false);
            }}
        />
    } else {
        button = <CallApiButton
            buttonText={'开始匹配'}
            loadingText={'正在匹配'}
            api={joinMatch}
            params={{
                "gamerSize": gamerSize,
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
                <FormControl sx={{m: 1, minWidth: 80}}>
                    <InputLabel id="demo-simple-select-autowidth-label">人数</InputLabel>
                    <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
                        value={gamerSize}
                        onChange={(event) => {
                            setGamerSize(event.target.value);
                        }}
                        autoWidth
                        label="人数"
                        disabled={matching}
                    >
                        <MenuItem value={2}>2人</MenuItem>
                        <MenuItem value={3}>3人</MenuItem>
                        <MenuItem value={4}>4人</MenuItem>
                        <MenuItem value={5}>5人</MenuItem>
                        <MenuItem value={6}>6人</MenuItem>
                        <MenuItem value={7}>7人</MenuItem>
                        <MenuItem value={8}>8人</MenuItem>
                        <MenuItem value={9}>9人</MenuItem>
                    </Select>
                </FormControl>
                <Box sx={{display: 'flex'}}>
                    {button}
                </Box>
                {
                    matching ?
                        <>
                            <Box sx={{display: 'flex'}}>
                                <CircularProgress/>
                            </Box>
                            <Box sx={{display: 'flex'}}>
                                <p>{'当前队列 ' + size + ' 人'}</p>
                            </Box>
                        </>
                        :
                        <></>
                }
            </div>
            <Footer/>
        </>
    );
}
