import React, {useEffect} from 'react';
import GlobalHeader from "../components/common/header";
import Footer from "../components/common/footer";
import 'react-toastify/dist/ReactToastify.css';
import styles from '../css/index.module.css';
import {todoMissionsPagingList} from "../apis/todo";

export default function Index() {

    useEffect(() => {
        todoMissionsPagingList({page: 1, size: 10}).then((response) => {
            if (response.code === "0") {

            }
        })
    }, [])

    return (
        <>
            <GlobalHeader/>
            <div className={styles.container}>

            </div>
            <Footer/>
        </>
    );
}
