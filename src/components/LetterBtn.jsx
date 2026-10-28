import { useContext } from "react";
import { AppContext } from "../App";
import { FiDelete } from "react-icons/fi";

const LetterBtn = (props) => {
    const { objectLetter } = props;
    const { letter, isCorrect, isUsed } = objectLetter;
    const { clickLetterBtn } = useContext(AppContext);

    let classNameText = "letter-btn";
    if (isUsed === false) {
        classNameText = "letter-btn";
    } else if (isUsed === true && isCorrect === true) {
        classNameText = "letter-btn correct-btn";
    } else if (isUsed === true && isCorrect === false) {
        classNameText = "letter-btn false-btn";
    }
    return (
        <span className={classNameText} onClick={() => clickLetterBtn(letter)}>
            {letter === "delete" ? <FiDelete /> : letter.toUpperCase()}
        </span>
    );
};

export default LetterBtn;
