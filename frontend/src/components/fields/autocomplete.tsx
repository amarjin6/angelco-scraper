import React from "react";

import {Box} from "@mui/material";
import TextField from "@mui/material/TextField";
import {Autocomplete} from "@mui/material";

type Props = {
    my_options: any;
    label: string;
    name: string;
    multiple?: boolean;
    def?: string;
    onChange?: any;
    errors?: any;
    type?: string;
};

export const MultipleAutocomplete: React.FC<Props> = ({
                                                          my_options,
                                                          label,
                                                          name,
                                                          multiple = true,
                                                          def,
                                                          onChange,
                                                          errors,
                                                          type,
                                                      }) => {
    return (
        <Autocomplete
            sx={{margin: "1vw", width: "45%", display: "inline-block"}}
            options={my_options}
            multiple={multiple}
            defaultValue={def}
            disabled={type === "Remote" || type === "Global" ? true : false}
            getOptionLabel={(options: any) => `${options}`}
            renderOption={(props: any, my_options: any) => (
                <Box component="li" {...props}>
                    {my_options}
                </Box>
            )}
            renderInput={(params) => (
                <TextField {...params} label={label}/>
            )}
            onChange={onChange}
        />
    );
};
