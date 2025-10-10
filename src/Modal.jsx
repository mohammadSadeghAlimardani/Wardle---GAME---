import { FaStar } from "react-icons/fa";
import victoryAudio from "./audios/victory.mp3";
import gameOverAudio from "./audios/game-over.mp3";

import { useEffect, useRef } from "react";

const Modal = (props) => {
    const { isWin, isEnded } = props;

    const victoryAudioRef = useRef(null);
    const gameOverAudioRef = useRef(null);

    useEffect(() => {
        if (isWin === true) {
            victoryAudioRef.current.play();
        } else if (isWin === false && isEnded === true) {
            gameOverAudioRef.current.play();
        }
    }, [isEnded]);

    return (
        <div
            // className="modal show-modal"
            className={isWin === "notFinished" ? "modal" : "modal show-modal"}
        >
            <div className="section-center modal-center">
                {isWin === true ? (
                    <>
                        <p>That's exactly true</p>
                        <ul className="animated">
                            <li>
                                <FaStar />
                            </li>
                            <li>
                                <FaStar />
                            </li>
                            <li>
                                <FaStar />
                            </li>
                        </ul>
                    </>
                ) : (
                    <p>you lost your chances</p>
                )}
                <audio src={victoryAudio} ref={victoryAudioRef}></audio>
                <audio src={gameOverAudio} ref={gameOverAudioRef}></audio>
            </div>
        </div>
    );
};

export default Modal;
