import styles from '../../css/post.module.css';
import 'react-markdown-editor-lite/lib/index.css';
import 'highlight.js/styles/github.css';
import {useRouter} from "next/router";
import GlobalHeader from "../../components/common/header";
import Footer from "../../components/common/footer";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useRoomUser from "../../hooks/useRoomUser";
import JoinRoomButton from "../../components/room/joinRoomButton";


export default function RoomDetail({match}) {
    const router = useRouter();
    const roomUser = useRoomUser(router.query.roomCode);

    return (
        <>
            <GlobalHeader/>
            <div className={styles.container}>
                <h1>{router.query.roomCode}</h1>
                <JoinRoomButton roomCode={router.query.roomCode}/>
                <div>
                    <ul>
                        {
                            roomUser?.map(one => {
                                return <li key={one.id}>{one.username}</li>
                            })
                        }
                    </ul>
                </div>
            </div>
            <Footer/>
            <ToastContainer/>
        </>
    );
}
