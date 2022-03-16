import {useEffect, useState} from 'react';
import {getSysUserInfo} from "../apis/user";

export default function useUserInfo() {
    const [userInfo, setUserInfo] = useState(null);
    useEffect(() => {
        getSysUserInfo().then((response) => {
            console.log(response);
            if (response?.code === 500) {
                setUserInfo(null);
            } else {
                setUserInfo(response);
            }
        })
    }, []);
    return userInfo;
}
