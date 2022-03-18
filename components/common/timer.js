import React, {useEffect, useState} from "react";


export default function Timer({something, timeout}) {
    const [currentCount, setCount] = useState(18000);
    const timer = () => setCount(currentCount - 1);

    useEffect(() => {
        if (currentCount <= 0) {
            return;
        }
        if (something) {
            something()
        }
        const id = setInterval(timer, timeout);
        return () => clearInterval(id);
    }, [currentCount])

    return <></>;
}
