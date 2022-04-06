import {useEffect, useState} from 'react';
import {getSysUserInfo} from "../apis/user";

export default function useUserInfo() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        getSysUserInfo().then((response) => {
            if (response?.code === 500) {
                setData(null);
            } else {
                setData(response);
            }
            setLoading(false);
        })
    }, []);
    return {data, loading};
}
