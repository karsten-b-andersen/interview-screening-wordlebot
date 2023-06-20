import { Box, Typography } from "@mui/material";
import React, { FunctionComponent } from "react";

interface OwnProps {}

type Props = OwnProps;

const GameInstructions: FunctionComponent<Props> = (props) => {
    return (
        <Box
            key={`Instructions`}
            sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.5,
                marginBottom: 0.5,
            }}
        >
            <Typography
                variant="body2"
                color="primary"
                sx={{
                    marginBottom: 1.5,
                    width: "60%",
                }}
            >
                Click on a letter in the last word in the list to set a clue. The default clue for
                each letter is 'x'. Press the submit button to request the next suggested word.
            </Typography>
        </Box>
    );
};

export default GameInstructions;
