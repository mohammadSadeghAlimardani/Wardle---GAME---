import { useEffect, useRef, useState } from "react";
import "./App.css";
import { nanoid } from "nanoid";
import axios from "axios";
import Loading from "./assets/Loading";
import Error from "./assets/Error";
import { toast, ToastContainer } from "react-toastify";
import Modal from "./Modal";

const getWordURL = "https://random-word-api.vercel.app/api?words=1&length=5";

const isSearchValueExistsURL =
    "https://api.dictionaryapi.dev/api/v2/entries/en/";

const App = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const [searchValue, setSearchValue] = useState("");
    const [word, setWord] = useState("");

    const [isWin, setIsWin] = useState("notFinished");
    const [isEnded, setIsEnded] = useState(false);

    const [chances, setChances] = useState(["", "", "", "", "", ""]);
    const [compare, setCompare] = useState([]);

    const fetchWord = async () => {
        try {
            let response = await axios.get(getWordURL);
            let data = response.data;
            data = data[0];
            setWord(data);
        } catch (error) {
            setIsLoading(false);
            setIsError(true);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchWord();
    }, []);

    const inputRef = useRef(null);
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    });

    const handleInput = (event) => {
        if (event.target.value.length <= 5) {
            setSearchValue(event.target.value.toLowerCase());
        }
    };

    const submitForm = async (event) => {
        event.preventDefault();

        //check searchValue in english dictionary (does exists ?)
        try {
            const response = await axios.get(
                `${isSearchValueExistsURL}${searchValue}`
            );
        } catch (error) {
            if (error.status !== 200) {
                toast.error("This Word Does Not Exists");
                return;
            }
        }

        //check if searchValue is empty
        if (searchValue.length === 0) {
            toast.error("Please Enter some Value");
            return;
        }

        //check correct characters and display them
        let emptyItemIndex = chances.indexOf("");
        let newChances = chances;
        const newCompare = [];
        for (let index = 0; index < searchValue.length; index++) {
            if (searchValue[index] === word[index]) {
                newCompare[index] = "truePlace";
            } else if (word.includes(searchValue[index])) {
                newCompare[index] = "falsePlace";
            } else {
                newCompare[index] = "notAvailable";
            }
        }
        setCompare([...compare, newCompare]);
        newChances[emptyItemIndex] = searchValue;
        setChances(newChances);
        setSearchValue("");

        //check finish game and win
        const isAlltrue = newCompare.every(
            (compareItem) => compareItem === "truePlace"
        );
        const isFinish = chances.every((strChance) => strChance.length > 0);
        if (isFinish || isAlltrue) {
            setIsWin(isAlltrue);
            setIsEnded(true);
        }
    };

    if (isLoading) {
        return <Loading />;
    }

    if (isError) {
        return <Error />;
    }

    return (
        <main>
            <Modal isWin={isWin} isEnded={isEnded} word={word}/>
            <ToastContainer position="top-center" />
            <div className="game">
                <div className="section-center game-center">
                    <h1 className="title">wardle</h1>
                    <section className="chances">
                        {chances.map((strChance, chanceIndex) => {
                            const arrayOfStrChance = [...strChance];
                            return (
                                <div className="single-chance" key={nanoid()}>
                                    {arrayOfStrChance.length > 0 ? (
                                        arrayOfStrChance.map(
                                            (char, charIndex) => {
                                                if (
                                                    compare[chanceIndex][
                                                        charIndex
                                                    ] === "truePlace"
                                                ) {
                                                    return (
                                                        <article
                                                            key={nanoid()}
                                                            className="truePlace"
                                                        >
                                                            {char}
                                                        </article>
                                                    );
                                                }
                                                if (
                                                    compare[chanceIndex][
                                                        charIndex
                                                    ] === "falsePlace"
                                                ) {
                                                    return (
                                                        <article
                                                            key={nanoid()}
                                                            className="falsePlace"
                                                        >
                                                            {char}
                                                        </article>
                                                    );
                                                }
                                                if (
                                                    compare[chanceIndex][
                                                        charIndex
                                                    ] === "notAvailable"
                                                ) {
                                                    return (
                                                        <article
                                                            key={nanoid()}
                                                            className="notAvailable"
                                                        >
                                                            {char}
                                                        </article>
                                                    );
                                                }
                                            }
                                        )
                                    ) : (
                                        <>
                                            <article></article>
                                            <article></article>
                                            <article></article>
                                            <article></article>
                                            <article></article>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </section>
                    <form onSubmit={submitForm}>
                        <input
                            value={searchValue}
                            onChange={handleInput}
                            type="text"
                            name="searchValue"
                            ref={inputRef}
                        />
                        <button type="submit" className="btn btn-primary">
                            enter
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default App;
