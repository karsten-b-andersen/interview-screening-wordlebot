import { Box } from "@mui/material";
import { grey } from "@mui/material/colors";
import React, { FunctionComponent } from "react";
import { getBgColor } from "../utils/utils";

interface OwnProps {
    clueStr: string;
    handleOpenMenu: (event: React.MouseEvent<HTMLElement>, letterIndex: number) => void;
    wordStr: string;
}

type Props = OwnProps;

const Guess: FunctionComponent<Props> = ({ clueStr, handleOpenMenu, wordStr }) => {
    const letters = wordStr.length > 0 ? wordStr.split("") : Array(5).fill("");
    return (
        <>
            {letters.map((letter, letterIndex) => {
                const bgColor = getBgColor(clueStr.charAt(letterIndex));
                return (
                    <Box
                        key={`${letter}_${letterIndex}`}
                        sx={{
                            alignItems: "center",
                            bgcolor: bgColor,
                            border: "2px solid",
                            borderColor: grey[300],
                            borderRadius: 2,
                            display: "flex",
                            height: 40,
                            justifyContent: "center",
                            width: 40,
                        }}
                        onClick={(event) => handleOpenMenu(event, letterIndex)}
                    >
                        {letter}
                    </Box>
                );
            })}
        </>
    );
};

export default Guess;
