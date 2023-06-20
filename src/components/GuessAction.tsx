import { LoadingButton } from "@mui/lab";
import { Box } from "@mui/material";
import React, { FunctionComponent } from "react";

interface OwnProps {
    addSubmitButton: boolean;
    handleFeedback: () => void;
    isLoading: boolean;
}

type Props = OwnProps;

const GuessAction: FunctionComponent<Props> = ({ addSubmitButton, handleFeedback, isLoading }) => {
    return (
        <Box
            sx={{
                width: 80,
                paddingLeft: "1rem",
            }}
        >
            {addSubmitButton ? (
                <LoadingButton
                    size="small"
                    onClick={() => handleFeedback()}
                    loading={isLoading}
                    variant="outlined"
                >
                    <span>Submit</span>
                </LoadingButton>
            ) : null}
        </Box>
    );
};

export default GuessAction;
