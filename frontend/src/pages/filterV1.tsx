import React, {useState} from "react";
import {Box, Button, Card, Container, Grid} from "@mui/material";
import {Form, Formik, FormikValues} from "formik";
import {TextField} from "../components/fields/textForm";
import {MultipleAutocomplete} from "../components/fields/autocomplete";
import {
    COMPANY_SIZE,
    FORMIK_STRINGS,
    INVESTMENT_STAGE,
    JOB_TITLE,
    LOCATION,
    TYPES,
} from "../components/constants";
import {initialValues, validationSchema} from "../validation/schema";
import {RangeSlider} from "../components/fields/slider";
import filterService from "../services/filterService";
import {toNull} from "../validation/helper";
import {DownloadButton} from "../components/downloadButton";

export const Filter = () => {
    const [salary, setSalary] = useState<number[]>([0, 0]);
    const [equity, setEquity] = useState<number[]>([0, 0]);
    const [files, setFile] = useState<string>("");
    let response: any;
    const [show, setShow] = useState(false);


    const onSubmit = async (values: FormikValues) => {
        values.salary = salary;
        values.equity = equity;
        values.job_title = values.job_title.replace(" ", "-");
        values.location = values.location.replace(" ", "-");
        const x = toNull(FORMIK_STRINGS, values);
        if (x["job_type"] === "Remote" || x["job_type"] === "Global") {
            x["location"] = "";
        }
        response = await filterService.getCSV(x);
        const href = URL.createObjectURL(response.data);
        setFile(href);
    };

    return (
        <Container sx={{paddingBottom: 10}} component={Card}>
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validateOnBlur={false}
                validationSchema={validationSchema}
            >
                {({values, errors, setFieldValue}) => (
                    <Form>
                        <MultipleAutocomplete
                            my_options={JOB_TITLE}
                            label="Job Title"
                            name="job_title"
                            multiple={false}
                            def={JOB_TITLE[0]}
                            onChange={(e: any, value: any) =>
                                setFieldValue("job_title", value)
                            }
                            errors={errors}
                        />
                        <MultipleAutocomplete
                            my_options={LOCATION}
                            label="Location"
                            name="location"
                            multiple={false}
                            def={LOCATION[0]}
                            onChange={(e: any, value: any) =>
                                setFieldValue("location", value)
                            }
                            errors={errors}
                            type={values.job_type}
                        />

                        <MultipleAutocomplete
                            my_options={TYPES}
                            label="Job type"
                            name="job_type"
                            multiple={false}
                            def={TYPES[0]}
                            onChange={(e: any, value: any) =>
                                setFieldValue("job_type", value)
                            }
                            errors={errors}
                        />
                        <Button variant="contained" onClick={() => setShow(prev => !prev)}>MORE</Button>
                        {show &&
                            <Box>
                                <Grid container>
                                    <RangeSlider max={200} name="Salary" setNewValue={setSalary}/>
                                    <RangeSlider
                                        max={2}
                                        step={0.1}
                                        name="Equity"
                                        setNewValue={setEquity}
                                    />
                                </Grid>

                                <TextField label="Currencies" name="currencies"/>
                                <TextField label="Skills" name="skills"/>
                                <TextField label="Markets" name="markets"/>

                                <TextField label="Included keywords" name="included_keywords"/>
                                <TextField label="Excluded keywords" name="excluded_keywords"/>

                                <MultipleAutocomplete
                                    my_options={INVESTMENT_STAGE}
                                    label="Investment stage"
                                    name="investment_stage"
                                    onChange={(e: any, value: any) =>
                                        setFieldValue("investment_stage", value)
                                    }
                                    errors={errors}
                                />
                                <MultipleAutocomplete
                                    my_options={COMPANY_SIZE}
                                    label="Company size"
                                    name="company_size"
                                    onChange={(e: any, value: any) =>
                                        setFieldValue("company_size", value)
                                    }
                                    errors={errors}
                                />
                            </Box>
                        }
                        <Grid container item xs={12} direction="row-reverse">
                            <Button type="submit" variant="contained">
                                Send
                            </Button>
                        </Grid>
                    </Form>
                )}
            </Formik>
            <DownloadButton href={files}/>
        </Container>
    );
};
