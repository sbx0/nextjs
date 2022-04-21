import React from "react";

import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from "react-toastify";

import {LanguageContext} from "../../components/i18n/i18n";
import LoginContainer from "../../components/common/loginContainer";
import RoomSSE from "./components/roomSSE";
import {zhCN} from "../../components/i18n/zhCN";

export default function Room() {

    return <>
        <LanguageContext.Provider value={zhCN}>
            <LoginContainer>
                <RoomSSE/>
            </LoginContainer>
            <ToastContainer/>
        </LanguageContext.Provider>
    </>
}
