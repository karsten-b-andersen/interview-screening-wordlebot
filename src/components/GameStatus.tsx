import { Box, Button, Typography } from "@mui/material";
import React, { FunctionComponent } from "react";

interface OwnProps {
    errorMsg: string | null;
    isInitialLoading: boolean;
    isWinner: boolean;
    isLastGuess: boolean;
    handleNewGame: () => void;
}

type Props = OwnProps;

const GameStatus: FunctionComponent<Props> = ({
    errorMsg,
    handleNewGame,
    isInitialLoading,
    isLastGuess,
    isWinner,
}) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "2rem",
                gap: 2,
            }}
        >
            {errorMsg && <Typography color="red">{errorMsg}</Typography>}
            {isWinner && <Typography>Congratulation, you won!</Typography>}
            {!isWinner && !isInitialLoading && isLastGuess && (
                <Typography>You did not win!</Typography>
            )}
            {!isInitialLoading && (isWinner || errorMsg || (!isWinner && isLastGuess)) && (
                <Button variant="outlined" onClick={() => handleNewGame()}>
                    Start a New Game
                </Button>
            )}
        </Box>
    );
};

export default GameStatus;
