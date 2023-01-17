import * as React from "react";
import {Button, CircularProgress} from "@mui/material";
import {createCSVDownload} from "../validation/helper";

export const DownloadButton = (href: any) => {
    if (href.href === "loading") return <CircularProgress/>
    else if (href.href) {
        return (
            <Button color="success" onClick={() => createCSVDownload(href.href)} variant="contained">
                Download
            </Button>
        );
    } else {
        return <></>
    }
};
