import { nanoid } from "nanoid";
import LetterBtn from "./LetterBtn";
import { useContext } from "react";
import { AppContext } from "../App";

const AlphabetLetters = () => {
    const { chars } = useContext(AppContext);
    return (
        <div className="alphabet-letters">
            {chars.map((objectLetter) => {
                return <LetterBtn objectLetter={objectLetter} key={nanoid()} />;
            })}
        </div>
    );
};

export default AlphabetLetters;
