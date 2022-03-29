import React from "react";
import 'react-toastify/dist/ReactToastify.css';
import RoomDetail from "./roomDetail";
import {useRouter} from "next/router";
import cookie from "cookie";
import {infoUnoRoom} from "../../apis/unoRoom";
import GlobalHeader from "../../components/common/header";
import {ToastContainer} from "react-toastify";
import Footer from "../../components/common/footer";


export default function RoomDetailRequireLogin({data, isLogin}) {
    const router = useRouter();

    if (!isLogin) {
        router.push("/login").then(r => r);
        return <></>
    }

    return <>
        <GlobalHeader/>
        <RoomDetail data={data} roomCode={router.query.roomCode}/>
        <ToastContainer/>
        <Footer/>
    </>
}

export async function getServerSideProps({req, query}) {
    const cookies = cookie.parse(req ? req.headers.cookie || "" : document.cookie);
    const response = await infoUnoRoom({roomCode: query.roomCode}, cookies);


    if (response.code === 500) {
        return {props: {data: [], isLogin: false}}
    } else if (response.code === "0") {
        return {props: {data: response.data, isLogin: true}}
    }

    return {props: {data: [], isLogin: true}}
}

