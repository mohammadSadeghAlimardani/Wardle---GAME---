import "./App.css";
import { createContext, useEffect, useState } from "react";
import AlphabetLetters from "./components/AlphabetLetters";
import Chances from "./components/Chances";
import { toast, ToastContainer } from "react-toastify";
import { chars } from "./data";
import Modal from "./components/Modal";
import Loading from "./components/Loading";
import Error from "./components/Error";

export const AppContext = createContext();

const getRandomWordAPI =
    "https://randomapi.dev/api/words?type=noun&minLength=5&maxLength=5&count=1";

const checkWordInDictionaryAPI =
    "https://freedictionaryapi.com/api/v1/entries/en/";

const App = () => {
    const wordSize = 5;
    const sizeOfChances = 6;
    const [chancesArray, setChancesArray] = useState(
        new Array(sizeOfChances).fill(
            new Array(wordSize).fill({ isInitialRender: true }),
        ),
    );
    const [currentChanceIndex, setCurrentChanceIndex] = useState(0);
    const [activeBox, setActiveBox] = useState(0);
    const [fetchedWord, setFetchedWord] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [isUserWon, setIsUserWon] = useState(null);
    const [isUserLost, setIsUserLost] = useState(null);

    const fetchRandomWord = async () => {
        try {
            const response = await fetch(getRandomWordAPI);
            const data = await response.json();
            setFetchedWord(data.data[0].word);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            setIsError(error);
            console.log(error);
        }
    };

    const doesWordExistsInDictionary = async (presentChance) => {
        const typedWord = presentChance.map((chance) => chance.letter).join("");
        try {
            const response = await fetch(
                `${checkWordInDictionaryAPI}${typedWord}`,
            );
            const data = await response.json();
            if (data.entries.length === 0) {
                return false;
            } else {
                return true;
            }
        } catch (error) {
            console.log(error);
            setIsError(error);
        }
    };

    useEffect(() => {
        fetchRandomWord();
    }, []);

    const clickLetterBtn = async (letter) => {
        if (letter === "delete") {
            let updatedChancesArray = [...chancesArray];
            if (activeBox - 1 === -1) {
                toast.error("there is no letter to delete");
                return;
            }
            setActiveBox(activeBox - 1);
            updatedChancesArray[currentChanceIndex][activeBox - 1] = {
                isInitialRender: true,
            };
            setChancesArray(updatedChancesArray);
            return;
        }
        if (letter === "enter") {
            if (activeBox === wordSize) {
                let updatedChancesArray = [...chancesArray];
                let presentChance = updatedChancesArray[currentChanceIndex];

                //does word exists in dictiionary ?
                const doesExists =
                    await doesWordExistsInDictionary(presentChance);
                if (!doesExists) {
                    toast.error("there is no such word");
                    return;
                }

                //check validity of typed word.....
                presentChance = presentChance.map((boxObject, index) => {
                    let newBoxObject = {
                        letter: boxObject.letter,
                        isInitialRender: false,
                        isCorrectPosition: null,
                        isContains: null,
                    };
                    const updatedChars = [...chars];
                    const typedChar = updatedChars.find(
                        (updatedChar) =>
                            updatedChar.letter === boxObject.letter,
                    );
                    typedChar.isUsed = true;
                    if (fetchedWord[index] === boxObject.letter) {
                        newBoxObject.isCorrectPosition = true;
                        newBoxObject.isContains = true;
                        typedChar.isCorrect = true;
                        return newBoxObject;
                    } else if (
                        fetchedWord[index] !== boxObject.letter &&
                        fetchedWord.includes(boxObject.letter)
                    ) {
                        newBoxObject.isCorrectPosition = false;
                        newBoxObject.isContains = true;
                        return newBoxObject;
                    } else if (
                        fetchedWord[index] !== boxObject.letter &&
                        !fetchedWord.includes(boxObject.letter)
                    ) {
                        newBoxObject.isCorrectPosition = false;
                        newBoxObject.isContains = false;
                        typedChar.isCorrect = false;
                        return newBoxObject;
                    }
                });
                updatedChancesArray[currentChanceIndex] = presentChance;
                setChancesArray(updatedChancesArray);
                setActiveBox(0);
                setCurrentChanceIndex(currentChanceIndex + 1);

                if (currentChanceIndex + 1 <= sizeOfChances) {
                    const typedWord = presentChance
                        .map((chance) => chance.letter)
                        .join("");
                    if (typedWord === fetchedWord) {
                        //victory
                        setIsUserWon(true);
                    }
                    if (currentChanceIndex + 1 === sizeOfChances) {
                        //game over
                        if (typedWord !== fetchedWord) {
                            setIsUserLost(true);
                        }
                    }
                }
                return;
            }
            toast.error(`you must exactly enter ${wordSize} letter`);
            return;
        }
        if (activeBox === wordSize) {
            toast.error("you can not enter more letters");
            return;
        }

        const newBoxObject = {
            letter: letter,
            isInitialRender: true,
            isCorrectPosition: null,
            isContains: null,
        };
        let updatedChancesArray = [...chancesArray];
        updatedChancesArray[currentChanceIndex] = [
            ...updatedChancesArray[currentChanceIndex],
        ];
        updatedChancesArray[currentChanceIndex][activeBox] = newBoxObject;
        setChancesArray(updatedChancesArray);
        setActiveBox(activeBox + 1);
    };

    if (isLoading) {
        return <Loading />;
    }

    if (isError) {
        return <Error error={isError} />;
    }

    return (
        <AppContext.Provider
            value={{
                wordSize,
                sizeOfChances,
                chancesArray,
                clickLetterBtn,
                chars,
                isUserWon,
                isUserLost,
                fetchedWord,
            }}
        >
            <ToastContainer position="top-center" />
            <Modal />
            <div className="game">
                <div className="game-center">
                    <Chances />
                    <AlphabetLetters />
                </div>
            </div>
        </AppContext.Provider>
    );
};

export default App;
