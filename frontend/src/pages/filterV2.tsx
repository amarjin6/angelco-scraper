import React, {useState} from "react";
import {Box, Button, Card, Container, Grid} from "@mui/material";
import {TextField} from "../components/fields/textForm";
import {Form, Formik, FormikValues} from "formik";
import {MultipleAutocomplete} from "../components/fields/autocomplete";
import {
    COMPANY_SIZE,
    ERRORS,
    INVESTMENT_STAGE,
    JOB_TITLE,
    LOCATION,
    TYPES,
} from "../components/constants";
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import FilterListIcon from '@mui/icons-material/FilterList';
import {initialValues, validationSchema} from "../validation/schema";
import filterService from "../services/filterService";
import {DownloadButton} from "../components/downloadButton";
import {RangeSlider} from "../components/fields/slider";
import {AlertMessage} from "../components/fields/alert";
import {number} from "yup/lib/locale";

export const Filter = () => {
    const [salary, setSalary] = useState<number[]>([0, 0]);
    const [equity, setEquity] = useState<number[]>([0, 0]);
    const [files, setFile] = useState<string>("");
    const [show, setShow] = useState(false);
    const [status, setStatus] = useState<any>();

    let response: any;

    const onSubmit = async (values: FormikValues) => {
        setFile("loading")
        values.salary = salary;
        values.equity = equity;
        values.job_title = values.job_title.replace(" ", "-")
        values.location = values.location.replace(" ", "-")
        await filterService.getCSV(values).then(response => {
                setStatus(response.status)
                const href = URL.createObjectURL(response.data);
                setFile(href);
            }
        ).catch((error: any) => {
            const x: number = error.response.status
            setStatus(ERRORS[x] || `Error: Parser finished with ${x} code`)
            const href = URL.createObjectURL(error.response.data);
            setFile(href);
        });
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
                    <Form style={{paddingLeft: 20}}>
                        <MultipleAutocomplete
                            my_options={JOB_TITLE}
                            label="Job Title"
                            name="job_title"
                            multiple={false}
                            def={JOB_TITLE[0]}
                            onChange={(e: any, value: any) =>
                                setFieldValue("job_title", value)
                            }
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
                        />
                        <Button style={{width: "100%"}} variant="text" onClick={() => setShow(prev => !prev)}>
                            <FilterListIcon/>
                            <b>FILTERS</b>
                            <ArrowDropDownOutlinedIcon/>
                        </Button>
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
                                />
                                <MultipleAutocomplete
                                    my_options={COMPANY_SIZE}
                                    label="Company size"
                                    name="company_size"
                                    onChange={(e: any, value: any) =>
                                        setFieldValue("company_size", value)
                                    }
                                />
                            </Box>
                        }
                        <Grid container
                              style={{paddingLeft: 20, paddingTop: 20, width: "95%", justifyContent: "space-between"}}>
                            <Grid item>
                                <DownloadButton href={files}/>
                            </Grid>
                            <Grid item style={{display: "flex"}}>
                                <AlertMessage severity="warning"
                                              ifValue={errors.job_title || errors.job_type || errors.location}
                                              textValue={errors.job_title || errors.job_type || errors.location}/>
                                <AlertMessage severity="info" ifValue={files === "loading"} textValue="Parser invoked"/>
                                <AlertMessage severity="success" ifValue={status === 200 && files !== "loading"}
                                              textValue="Parser completed"/>
                                <AlertMessage severity="error" ifValue={status && status !== 200} textValue={status}/>
                            </Grid>
                            <Grid item>
                                <Button type="submit" variant="contained">
                                    Send
                                </Button>
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </Container>
    );
};
