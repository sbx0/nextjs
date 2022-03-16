import 'react-markdown-editor-lite/lib/index.css';
import {toast} from 'react-toastify';
import {joinRoom} from "../../apis/unoRoomUser";


export default function JoinRoomButton({roomCode}) {

    const join = () => {
        joinRoom({roomCode: roomCode}).then((response) => {
            if (response) {
                toast('🦄 成功加入', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        })
    }

    return (
        <button onClick={join}>加入</button>
    );
}
