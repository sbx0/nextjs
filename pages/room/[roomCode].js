import React from "react";
import 'react-toastify/dist/ReactToastify.css';
import RoomDetail from "./roomDetail";
import {useRouter} from "next/router";
import GlobalHeader from "../../components/common/header";
import {ToastContainer} from "react-toastify";
import Footer from "../../components/common/footer";


export default function RoomDetailRequireLogin() {
    const router = useRouter();

    return <>
        <GlobalHeader/>
        <RoomDetail roomCode={router.query.roomCode}/>
        <ToastContainer/>
        <Footer/>
    </>
}
