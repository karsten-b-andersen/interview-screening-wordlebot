import { Backdrop, Box, CircularProgress, Menu, MenuItem, Typography } from "@mui/material";
import React, { FunctionComponent, useEffect, useState } from "react";
import { grey } from "@mui/material/colors";
import { fetchWordleResult } from "../api/api";
import { getBgColor, makeNewGuess } from "../utils/utils";
import testData from "../testData/TestData.json";

interface OwnProps {
    initialGuess: GuessType;
    onNewGame: () => void;
}

export type Props = OwnProps;
export type ClueElement = "g" | "y" | "x";
export type ClueType = Array<ClueElement>;
export type GuessType = {
    word: string[];
    clue: ClueType;
};

const TESTING = true;
const MAX_GUESSES = 6;
const Guess: FunctionComponent<Props> = ({ initialGuess, onNewGame }: Props) => {
    const [guesses, setGuesses] = useState<GuessType[]>([]);
    const [guessIndex, setGuessIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMessage] = useState<string | null>();
    const [menuLetterIndex, setMenuLetterIndex] = useState(0);
    const [isWinner, setIsWinner] = useState(false);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const fetchNextGuess = async (feedback: GuessType) => {
        setIsLoading(true);
        setErrorMessage(null);
        if (feedback.clue.join("") === "ggggg") {
            setIsWinner(true);
            setIsLoading(false);
            return;
        }
        if (TESTING) {
            // Simulate response from API

            let updatedGuess = { ...guesses[guessIndex] };
            const updatedClue: ClueElement = testData[guessIndex].clue as ClueElement;
            updatedGuess.clue = updatedClue.split("") as ClueType;
            let newGuess: GuessType | null = null;
            let newGuesses: GuessType[] = [];
            if (guessIndex < MAX_GUESSES - 1) {
                newGuess = makeNewGuess(testData[guessIndex + 1].word);
                newGuesses = [
                    ...guesses.slice(0, guessIndex + 1),
                    newGuess,
                    ...guesses.slice(guessIndex + 2),
                ];
            } else {
                newGuesses = [...guesses];
            }

            newGuesses[guessIndex] = updatedGuess;
            setGuesses(newGuesses);
        } else {
            // Make API request
            const updatedGuesses = [...guesses.slice(0, guessIndex + 1)];
            updatedGuesses[updatedGuesses.length - 1] = feedback;

            // Convert guesses to proper structure
            const newRequest = updatedGuesses.map(({ word, clue }) => ({
                word: word.join(""),
                clue: clue.join(""),
            }));
            const botGuess = await fetchWordleResult(newRequest);

            const newGuess: GuessType = makeNewGuess(botGuess.guess);
            if (guessIndex < MAX_GUESSES - 1) {
                setGuesses((prev) => {
                    const prevCopy = [...prev];
                    prevCopy[guessIndex] = feedback;
                    prevCopy[guessIndex + 1] = newGuess;
                    return prevCopy;
                });
            } else {
                setGuesses((prev) => {
                    const prevCopy = [...prev];
                    prevCopy[guessIndex] = feedback;
                    return prevCopy;
                });
            }
        }
        setIsLoading(false);

        setGuessIndex((prev) => prev + 1);
    };

    const handleFeedback = (feedback: GuessType) => {
        fetchNextGuess(feedback).catch((error) => {
            setErrorMessage(error.toString());
            setIsLoading(false);
        });
    };

    useEffect(() => {
        const emptyGuess = {
            word: Array(5).fill(""),
            clue: Array(5).fill("x"),
        };

        setIsWinner(false);
        setGuessIndex(0);
        setGuesses([initialGuess, emptyGuess, emptyGuess, emptyGuess, emptyGuess, emptyGuess]);
    }, [initialGuess]);

    const handleOpenMenu = (
        event: React.MouseEvent<HTMLElement>,
        lineIndex: number,
        letterIndex: number
    ) => {
        if (lineIndex === guessIndex) {
            setAnchorEl(event.currentTarget);
            setMenuLetterIndex(letterIndex);
        }
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };
    const handleMenuItemClick = (color: ClueElement) => {
        setGuesses((prev) => {
            const newGuesses = [...prev];
            newGuesses[guessIndex].clue = [...newGuesses[guessIndex].clue];
            newGuesses[guessIndex].clue[menuLetterIndex] = color;
            return newGuesses;
        });
        handleCloseMenu();
    };

    const isMenuOpen = Boolean(anchorEl);

    return (
        <>
            {guesses.map(({ word, clue }, lineIndex) => (
                <Box
                    key={`WordLine_${lineIndex}`}
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 0.5,
                        marginBottom: 0.5,
                    }}
                >
                    <Backdrop sx={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }} open={isLoading}>
                        <CircularProgress color="inherit" />
                    </Backdrop>
                    {word.map((letter, letterIndex) => {
                        const bgColor = getBgColor(clue[letterIndex]);
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
                                onClick={(event) => handleOpenMenu(event, lineIndex, letterIndex)}
                            >
                                {letter}
                            </Box>
                        );
                    })}
                    <Menu
                        anchorEl={anchorEl}
                        open={isMenuOpen}
                        onClose={handleCloseMenu}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "left",
                        }}
                    >
                        <Typography variant="h6" sx={{ px: 2, py: 1 }}>
                            Pick Color
                        </Typography>
                        <MenuItem
                            sx={{ backgroundColor: getBgColor("g") }}
                            onClick={() => handleMenuItemClick("g")}
                        >
                            Correct Location
                        </MenuItem>
                        <MenuItem
                            sx={{ backgroundColor: getBgColor("y") }}
                            onClick={() => handleMenuItemClick("y")}
                        >
                            Wrong Location
                        </MenuItem>
                        <MenuItem
                            sx={{ backgroundColor: getBgColor("x") }}
                            onClick={() => handleMenuItemClick("x")}
                        >
                            Not Included
                        </MenuItem>
                    </Menu>

                    <Box
                        sx={{
                            width: 80,
                            paddingLeft: "1rem",
                        }}
                    >
                        {lineIndex === guessIndex && guessIndex < MAX_GUESSES && !isWinner ? (
                            <button
                                onClick={() =>
                                    handleFeedback({
                                        word: word,
                                        // clue: ["g", "y", "y", "x", "g"], // leaves no possible suggestion
                                        clue: clue,
                                    })
                                }
                            >
                                Submit
                            </button>
                        ) : null}
                    </Box>
                </Box>
            ))}
            {errorMsg && <Typography>{errorMsg}</Typography>}
            {isWinner && <Typography>Congratulation, you won!</Typography>}
            {isWinner && <button onClick={() => onNewGame()}>New Game</button>}
        </>
    );
};

export default Guess;
