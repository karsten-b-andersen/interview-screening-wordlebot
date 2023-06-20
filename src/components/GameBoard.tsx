import { Box, Menu } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import React, { FunctionComponent, useEffect, useState } from "react";
import { fetchWordleResult } from "../api/api";
import { emptyGuess, makeNewGuess } from "../utils/utils";
import testData from "../testData/TestData.json";
import Guess from "./Guess";
import GameStatus from "./GameStatus";
import GuessAction from "./GuessAction";
import LetterMenuItems from "./LetterMenuItems";

export type ClueElement = "g" | "y" | "x";
export type GuessType = {
    clueStr: string;
    wordStr: string;
};

const MAX_GUESSES = 6;
const TESTING = false;
const WINNING_CLUE = "ggggg";

const GameBoard: FunctionComponent = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [errorMsg, setErrorMessage] = useState<string | null>(null);
    const [guesses, setGuesses] = useState<GuessType[]>(Array(6).fill(emptyGuess));
    const [guessIndex, setGuessIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isWinner, setIsWinner] = useState(false);
    const [menuLetterIndex, setMenuLetterIndex] = useState(0);

    async function fetchInitialGuess() {
        setIsInitialLoading(true);
        setErrorMessage(null);

        const setupNewGame = (firstWord: string) => {
            setIsLoading(false);
            setIsWinner(false);
            setGuessIndex(0);
            setGuesses([makeNewGuess(firstWord), ...Array(5).fill(emptyGuess)]);
            setIsInitialLoading(false);
        };

        if (TESTING) {
            setTimeout(() => {
                setupNewGame(testData[0].word);
            }, 1000);
        } else {
            setIsLoading(true);
            const data = await fetchWordleResult([]);
            setupNewGame(data.guess);
        }
    }

    async function fetchNextGuess(feedback: GuessType) {
        setIsLoading(true);
        setErrorMessage(null);
        if (feedback.clueStr === WINNING_CLUE) {
            setIsWinner(true);
            setIsLoading(false);
            return;
        }
        if (TESTING) {
            // Simulate response from API
            setTimeout(() => {
                let updatedGuess = { ...guesses[guessIndex] };
                updatedGuess.clueStr = testData[guessIndex].clue;
                let newGuess: GuessType | null = null;
                let newGuesses: GuessType[];
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
                setIsLoading(false);

                setGuessIndex((prev) => prev + 1);
            }, 100);
        } else {
            // Make API request
            const updatedGuesses = [...guesses.slice(0, guessIndex + 1)];
            updatedGuesses[updatedGuesses.length - 1] = feedback;
            const newRequest = updatedGuesses.map(({ wordStr, clueStr }) => ({
                word: wordStr,
                clue: clueStr,
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
            setIsLoading(false);

            setGuessIndex((prev) => prev + 1);
        }
    }

    function handleCloseMenu() {
        setAnchorEl(null);
    }

    function handleFeedback(feedback: GuessType) {
        fetchNextGuess(feedback).catch((error) => {
            setErrorMessage(error.toString());
            setIsLoading(false);
        });
    }

    function handleMenuItemClick(color: ClueElement) {
        setGuesses((prev) => {
            const newGuesses = [...prev];
            newGuesses[guessIndex].clueStr =
                newGuesses[guessIndex].clueStr.substring(0, menuLetterIndex) +
                color +
                newGuesses[guessIndex].clueStr.substring(menuLetterIndex + 1);
            return newGuesses;
        });
        handleCloseMenu();
    }

    function handleOpenMenu(event: React.MouseEvent<HTMLElement>, letterIndex: number) {
        setAnchorEl(event.currentTarget);
        setMenuLetterIndex(letterIndex);
    }

    useEffect(() => {
        fetchInitialGuess().catch((error) => {
            setErrorMessage(error.toString());
            setIsLoading(false);
        });
    }, []);

    return (
        <>
            {isInitialLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box sx={{ marginTop: "2rem" }}>
                    {isInitialLoading && (
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                            <CircularProgress />
                        </Box>
                    )}
                    {guesses.map(({ wordStr, clueStr }, lineIndex) => {
                        const isLastGuessLine = lineIndex === guessIndex;
                        const addSubmitButton: boolean =
                            isLastGuessLine && guessIndex < MAX_GUESSES && !isWinner;
                        return (
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
                                <Guess
                                    clueStr={clueStr}
                                    handleOpenMenu={isLastGuessLine ? handleOpenMenu : () => {}}
                                    wordStr={wordStr}
                                />

                                <GuessAction
                                    addSubmitButton={addSubmitButton}
                                    handleFeedback={() => {
                                        handleFeedback({
                                            wordStr: wordStr,
                                            clueStr: clueStr,
                                        });
                                    }}
                                    isLoading={isLoading}
                                />
                            </Box>
                        );
                    })}

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
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
                        <LetterMenuItems handleMenuItemClick={handleMenuItemClick} />
                    </Menu>

                    <GameStatus
                        errorMsg={errorMsg}
                        isInitialLoading={isInitialLoading}
                        isWinner={isWinner}
                        isLastGuess={guessIndex === MAX_GUESSES}
                        handleNewGame={() => {
                            fetchInitialGuess().catch(console.error);
                        }}
                    />
                </Box>
            )}
        </>
    );
};

export default GameBoard;
