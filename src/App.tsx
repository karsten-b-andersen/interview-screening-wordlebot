import { Container } from "@mui/material";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

import { useEffect, useState } from "react";
import { fetchWordleResult } from "./api/api";
import Guess, { GuessType } from "./components/Guess";
import Layout from "./components/Layout";
import Header from "./components/Header";
import testData from "./testData/TestData.json";

const TESTING = true;

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [initialGuess, setInitialGuess] = useState<GuessType | null>();
    useEffect(() => {
        if (TESTING) {
            setTimeout(() => setIsLoading(false), 1000);
            setInitialGuess({ word: testData[0].word.split(""), clue: Array(5).fill("x") });
        } else {
            const fetchInitialGuess = async () => {
                setIsLoading(true);
                const data = await fetchWordleResult([]);
                setInitialGuess({ word: data.guess.split(""), clue: Array(5).fill("x") });
                setIsLoading(false);
            };

            fetchInitialGuess().catch((error) => {
                setIsLoading(false);
                console.error(error);
            });
        }
    }, []);

    const handleNewGame = () => {
        // TODO: Refactor so useEffect above and this call same code  -- they are IDENTICAL RIGHT NOW

        if (TESTING) {
            setTimeout(() => setIsLoading(false), 1000);
            setInitialGuess({ word: testData[0].word.split(""), clue: Array(5).fill("x") });
        } else {
            const fetchInitialGuess = async () => {
                setIsLoading(true);
                const data = await fetchWordleResult([]);
                setInitialGuess({ word: data.guess.split(""), clue: Array(5).fill("x") });
                setIsLoading(false);
            };

            fetchInitialGuess().catch((error) => {
                setIsLoading(false);
                console.error(error);
            });
        }
    };

    return (
        <Layout>
            <Container maxWidth="sm">
                <Header />

                {/* Insert App here */}

                {!isLoading && initialGuess && (
                    <Guess initialGuess={initialGuess} onNewGame={handleNewGame} />
                )}
                {isLoading && (
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <CircularProgress />
                    </Box>
                )}
            </Container>
        </Layout>
    );
}

export default App;
