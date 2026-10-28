import { nanoid } from "nanoid";

const SingleChance = (props) => {
    const { singleChanceArray } = props;
    return (
        <article className="single-chance">
            {singleChanceArray.map((chanceObject) => {
                let classNameText;
                if (chanceObject.isInitialRender === true) {
                    classNameText = "box";
                } else if (chanceObject.isCorrectPosition === true) {
                    classNameText = "box correct";
                } else if (chanceObject.isContains === true) {
                    classNameText = "box contains";
                } else {
                    classNameText = "box does-not-exists";
                }
                return (
                    <div className={classNameText} key={nanoid()}>
                        {chanceObject.letter}
                    </div>
                );
            })}
        </article>
    );
};

export default SingleChance;
