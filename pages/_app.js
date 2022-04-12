import {useEffect} from "react";
import NProgress from "nprogress";
import '../styles/globals.css';
import '../css/nprogress.css';
import {useRouter} from "next/router";

function MyApp({Component, pageProps}) {
    const router = useRouter();

    useEffect(() => {
        router.events.on("routeChangeStart", () => {
            NProgress.start();
        });
        router.events.on("routeChangeComplete", () => {
            NProgress.done();
        });
        router.events.on("routeChangeError", () => {
            NProgress.done();
        });
    }, []);

    return <Component {...pageProps} />
}

export default MyApp
