import { nanoid } from "nanoid";
import SingleChance from "./SingleChance";
import { useContext } from "react";
import { AppContext } from "../App";

const Chances = () => {
    const { chancesArray } = useContext(AppContext);

    return (
        <div className="chances">
            {chancesArray.map((singleChanceArray) => {
                return (
                    <SingleChance
                        singleChanceArray={singleChanceArray}
                        key={nanoid()}
                    />
                );
            })}
        </div>
    );
};

export default Chances;
