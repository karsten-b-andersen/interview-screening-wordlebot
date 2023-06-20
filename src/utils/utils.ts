import { green, grey, yellow } from "@mui/material/colors";
import { GuessType } from "../components/GameBoard";

export const emptyGuess = {
    clueStr: "xxxxx",
    wordStr: "",
};

export const getBgColor = (clue: string) =>
    clue === "g" ? green[500] : clue === "y" ? yellow[400] : grey[100];

export const makeNewGuess = (newGuess: string): GuessType => {
    return {
        wordStr: newGuess,
        clueStr: "xxxxx",
    };
};
