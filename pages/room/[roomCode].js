import React from "react";
import 'react-toastify/dist/ReactToastify.css';

import GlobalHeader from "../../components/common/header";
import Footer from "../../components/common/footer";
import LoginContainer from "../../components/common/loginContainer";
import RoomSSE from "./roomSSE";


export default function RoomDetailRequireLogin() {
    return <>
        <GlobalHeader/>
        <LoginContainer>
            <RoomSSE/>
        </LoginContainer>
        <Footer/>
    </>
}
