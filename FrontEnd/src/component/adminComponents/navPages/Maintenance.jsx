import React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const useStyles = makeStyles()(theme => ({
  root: {
    [theme.breakpoints.up('md')]: {
      width: '35%',
    },
    [theme.breakpoints.down('md')]: {
      width: '60%',
    },
    [theme.breakpoints.down('sm')]: {
      width: '95%',
    },
    margin: '0 auto',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    marginTop: '50px',
  },
  formControl: {
    marginTop: '10px',
  },
  submitBtn: {
    marginTop: '15px',
  },
}));
function Maintanence() {
  const { classes } = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [apartmentNo, setApartmentNo] = useState([])

  useEffect(() => {
    const fetchDetails = async () => {
      const data = await axios.get('/apartment/allApartment');
      
      console.log(data)
      
        setApartmentNo(data);
      
      
    }
    fetchDetails();
  }, []);
  
  const addMaintenance = async (formData) => {
    try {
      const res = await axios.post('/maintenance/add', {
        ...formData,
      
      });
    
      
      
      enqueueSnackbar('Succesfully Added', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(err, { variant: 'error' });
    }
    
  };
 const formInitialValues={
    apartmentNo:'',
    amount: '',
    description: '',
    date: '',
  }

  //  const reset = (resetForm)=>{

  //    resetForm({ values: formInitialValues })
  //  }
  return (
    <Box className={classes.root}>
      <Formik
        initialValues={
          formInitialValues
        }
        validationSchema={Yup.object().shape({
          apartmentNo: Yup.string().required('Required'),
          amount: Yup.number().required('Required*'), 
          description: Yup.string().required('Required'),
          date: Yup.string().required('Required'),
        })}
        onSubmit={addMaintenance}
      >
        {({ values, errors, handleChange, handleSubmit}) => {
          return (
            <>
              <Typography variant="h3">Add Maintenance</Typography>
              <FormControl className={classes.formControl} variant="outlined">
                {/* <TextField
                  value={values.apartmentNo}
                  onChange={handleChange}
                  name="apartmentNo"
                  label="Apartment No"
                  type="text"
                  size="small"
                  error={errors.apartmentNo && errors.apartmentNo?.length ? true : false}
                /> */}
                <InputLabel>Type</InputLabel>
                 <Select
                    value={values.apartmentNo}
                    onChange={handleChange}
                    name="apartmentNo"
                    label="Apartment No"
                    size="small"
                    error={errors.apartmentNo && errors.apartmentNo?.length ? true : false}
                  >
                    {apartmentNo 
                 && apartmentNo.map((model, index) => (
                     <MenuItem key={index} value={model.apartmentNo}>{model.apartmentNo}</MenuItem>
                 ))
                 
             }
                  </Select> 
                <FormHelperText stylr={{ color: 'red' }}>
                  {errors.apartmentNo}
                </FormHelperText>
              </FormControl>
              <FormControl className={classes.formControl} variant="outlined">
                <TextField
                  value={values.amount}
                  onChange={handleChange}
                  name="amount"
                  label="Amount"
                  type="text"
                  size="small"
                  error={errors.amount && errors.amount?.length ? true : false}
                />
                <FormHelperText stylr={{ color: 'red' }}>
                  {errors.amount}
                </FormHelperText>
              </FormControl>
              <FormControl className={classes.formControl} variant="outlined">
                <TextField
                  value={values.description}
                  onChange={handleChange}
                  name="description"
                  label="Description"
                  type="text"
                  size="small"
                  error={
                    errors.description && errors.description?.length
                      ? true
                      : false
                  }
                />
                <FormHelperText stylr={{ color: 'red' }}>
                  {errors.description}
                </FormHelperText>
              </FormControl>
              <FormControl className={classes.formControl} variant="outlined">
                <TextField
                  value={values.date}
                  onChange={handleChange}
                  name="date"
                  type="date"
                  size="small"
                  error={errors.date && errors.date?.length ? true : false}
                />
                <FormHelperText stylr={{ color: 'red' }}>
                  {errors.date}
                </FormHelperText>
              </FormControl>
              <Button
                onClick={() => handleSubmit()}
                type="submit"
                className={classes.submitBtn}
                variant="contained"

              >
                ADD
              </Button>
            </>
          );
        }}
      </Formik>
    </Box>
  );
}

export default Maintanence;
