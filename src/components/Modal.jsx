import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../App";
import { nanoid } from "nanoid";
import audioWinnerSound from "../assets/audios/winner-sound.mp3";
import audioLoserSound from "../assets/audios/loser-sound.mp3";

const Modal = () => {
    const { isUserWon, isUserLost, fetchedWord } = useContext(AppContext);

    //animating winner title
    const titleWinner = [
        { character: "c", delay: 0.25 },
        { character: "o", delay: 0.5 },
        { character: "r", delay: 0.75 },
        { character: "r", delay: 1 },
        { character: "e", delay: 1.25 },
        { character: "c", delay: 1.5 },
        { character: "t", delay: 1.75 },
    ];
    const isInitialRender_USER_WON = useRef(true);
    const isInitialRender_USER_LOST = useRef(true);

    const audioWinnerRef = useRef(null);
    const audioLoserRef = useRef(null);

    useEffect(() => {
        if (isInitialRender_USER_WON.current === true) {
            isInitialRender_USER_WON.current = false;
            return;
        }
        audioWinnerRef.current.play();
    }, [isUserWon]);

    useEffect(() => {
        if (isInitialRender_USER_LOST.current === true) {
            isInitialRender_USER_LOST.current = false;
            return;
        }
        audioLoserRef.current.play();
    }, [isUserLost]);

    return (
        <div
            className={
                isUserWon || isUserLost ? "modal display-modal" : "modal"
            }
        >
            <div className="modal-content">
                {isUserWon ? (
                    <div className="winner-info">
                        <h2>
                            {titleWinner.map((charObject, characterIndex) => {
                                return (
                                    <span
                                        key={nanoid()}
                                        style={{
                                            animationDelay: `${charObject.delay}s`,
                                        }}
                                    >
                                        {charObject.character}
                                    </span>
                                );
                            })}
                        </h2>
                        <audio ref={audioWinnerRef}>
                            <source src={audioWinnerSound} />
                        </audio>
                    </div>
                ) : (
                    ""
                )}
                {isUserLost ? (
                    <div className="loser-info">
                        <h2>
                            you lost. the correct word was <br />{" "}
                            <span>{fetchedWord}</span>
                        </h2>
                        <audio ref={audioLoserRef}>
                            <source src={audioLoserSound} />
                        </audio>
                    </div>
                ) : (
                    ""
                )}
            </div>
        </div>
    );
};

export default Modal;
