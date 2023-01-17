import React from "react";
import {TextField as TextFieldFormik} from "formik-mui";
import {Field} from "formik";

type Props = {
    label: string;
    name: any;
};

export const TextField: React.FC<Props> = ({label, name}) => {
    return (
        <Field
            sx={{width: "45%", margin: "1vw"}}
            component={TextFieldFormik}
            label={label}
            name={name}
        />
    );
};
