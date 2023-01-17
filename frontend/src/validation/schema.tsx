import * as yup from "yup";
import {JOB_TITLE, TYPES, LOCATION} from "../components/constants";

export const validationSchema = yup.object().shape({
    job_title: yup.string().required().typeError("Job Title is required "),
    job_type: yup.string().required().typeError("Job Type is required"),
    location: yup.string().nullable(true).when("job_type", {
        is: "local",
        then: yup.string().required().typeError("Location is required")
    }),
    salary: yup.array(),
    equity: yup.array(),
    currencies: yup.string().nullable(true),
    skills: yup.string().nullable(true),
    markets: yup.string().nullable(true),
    included_keywords: yup.string().nullable(true),
    excluded_keywords: yup.string().nullable(true),
    company_size: yup.array(),
    investment_stage: yup.array(),
});

export const validationSchemaV2 = yup.object().shape({
    job_title: yup.string().required(),
    job_type: yup.string().required(),
    location: yup.string().required(),
});

export const initialValues = {
    job_type: TYPES[0],
    job_title: JOB_TITLE[0],
    location: LOCATION[0],
    salary: [0, 0],
    equity: [0, 0],
    currencies: "",
    skills: "",
    markets: "",
    included_keywords: "",
    excluded_keywords: "",
    company_size: [],
    investment_stage: [],
};

export const initialValuesV2 = {
    job_type: TYPES[0],
    job_title: JOB_TITLE[0],
    location: LOCATION[0],
}
