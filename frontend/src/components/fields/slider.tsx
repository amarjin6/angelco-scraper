import * as React from "react";
import Slider from "@mui/material/Slider";
import {Grid, Paper} from "@mui/material";

function valuetext(value: number, step: number | undefined, max: number) {
    if (step === undefined) {
        if (value === max) {
            return `${value}k+`;
        }
        return `${value}k`;
    }
    if (value === max) {
        return `${value}%+`;
    }
    return `${value}%`;
}

type Props = {
    max: number;
    name: string;
    setNewValue: any;
    step?: number;
};

export const RangeSlider: React.FC<Props> = ({
                                                 max,
                                                 name,
                                                 step,
                                                 setNewValue,
                                             }) => {
    const [value, setValue] = React.useState<number[]>([0, 0]);

    const handleChange = (event: Event, newValue: number | number[]) => {
        setNewValue(newValue as number[]);
        setValue(newValue as number[]);
    };

    return (
        <Grid item xs={5.7}>
            <Paper variant="outlined" sx={{margin: "1vw", padding: "2vw"}}>
                <h3>{name}</h3>
                <span>
          {valuetext(value[0], step, max)} - {valuetext(value[1], step, max)}
        </span>
                <Slider
                    sx={{}}
                    value={value}
                    step={step === undefined ? 1 : step}
                    max={max}
                    onChange={handleChange}
                    valueLabelDisplay="auto"
                />
            </Paper>
        </Grid>
    );
};
