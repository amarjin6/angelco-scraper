import * as React from "react";
import {Alert, AlertColor} from "@mui/material";

type Props = {
    severity: AlertColor;
    ifValue: any;
    textValue: string | undefined;
};

export const AlertMessage: React.FC<Props> = ({
                                                  severity,
                                                  ifValue,
                                                  textValue
                                              }) => {
    if (ifValue) {
        return (
            <Alert variant="outlined" severity={severity} style={{marginLeft: 15}}>
                {textValue}
            </Alert>
        )
    } else return <></>
};
