import { MenuItem, Typography } from "@mui/material";
import React, { FunctionComponent } from "react";
import { getBgColor } from "../utils/utils";
import { ClueElement } from "./GameBoard";

interface OwnProps {
    handleMenuItemClick: (color: ClueElement) => void;
}

type Props = OwnProps;
type MenuItemDefType = {
    colorCode: ClueElement;
    menuText: string;
};

const menuItemDef: MenuItemDefType[] = [
    {
        colorCode: "g",
        menuText: "Correct Location",
    },
    {
        colorCode: "y",
        menuText: "Wrong Location",
    },
    {
        colorCode: "x",
        menuText: "Not Included",
    },
];
const LetterMenuItems: FunctionComponent<Props> = ({ handleMenuItemClick }) => {
    return (
        <>
            <Typography variant="h6" sx={{ px: 2, py: 1 }}>
                Pick Color
            </Typography>
            {menuItemDef.map(({ colorCode, menuText }) => (
                <MenuItem
                    key={colorCode}
                    sx={{ backgroundColor: getBgColor(colorCode) }}
                    onClick={() => handleMenuItemClick(colorCode)}
                >
                    {menuText}
                </MenuItem>
            ))}
        </>
    );
};

export default LetterMenuItems;
