import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import * as Yup from 'yup';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useFormik } from 'formik';
import { makeStyles } from 'tss-react/mui';
import { useNavigate, useParams } from 'react-router-dom';
import CryptoJs from 'crypto-js'

const theme = createTheme();

const validationSchema = Yup.object({
  name: Yup.string().min(2).required('name is required'),
  apartmentNo: Yup.string()
    .length(3)
    .matches(
      /^[A-Z]\d{2}$/,
      "use one letter and two number format \nex: 'A10' "
    )
    .required('apartment number is required'),
  phoneNo: Yup.number().required('phone number is required'),
  nicNo: Yup.string().required('nic is required'),
  password: Yup.string().min(5).required('Password is required'),
  confPassword: Yup.string().oneOf(
    [Yup.ref('password'), null],
    'Passwords must match'
  ),
  email: Yup.string().email('Invalid email address').required('Required'),
});

const useStyles = makeStyles()(theme => ({
  root: {
    [theme.breakpoints.up('md')]: {
      width: '30%',
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
    marginTop: '30px',
    marginRight: '30%',
  },
  formControl: {
    marginTop: '10px',
  },
  submitBtn: {
    marginTop: '75px',
    marginLeft: '15%',
  },
  signup: {
    marginRight: '80%',
  },
}));

export default function RecoveryPasswordSetPage() {
  const navigate = useNavigate();
  const { classes } = useStyles();
  const {ciphertext} = useParams()

    const bytes = CryptoJs.AES.decrypt(ciphertext, 'my-secret-key@123');
    const decryptedData = bytes.toString(CryptoJs.enc.Utf8);
    

  const formik = useFormik({
    initialValues: {
      
      email: '',
        
      confPassword: '',
      password: '',
    },
    validationSchema: validationSchema,
    validateOnChange: true,
    onSubmit: values => {
      if (values.confPassword === values.password) {
        axios({
          method: 'PUT',
          url: '/customer/recoverypassword',
          data: { email: values.email,password: values.password },
        })
         .then(() => {
            alert('Password Updated');
            navigate('/login');
         })
            .catch(err => {
              alert(err);
            });

      }
    },
  });

  const { handleChange, handleSubmit } = formik;

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Type your Passwords
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  className={classes.password}
                  value={formik.values.password}
                  error={
                    formik.errors['password'] && formik.touched.password
                      ? true
                      : false
                  }
                  placeholder="Enter password"
                  onChange={handleChange}
                  helperText={
                    formik.errors['password'] && formik.touched.password
                      ? formik.errors['password']
                      : null
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="confPassword"
                  label="Conform Password"
                  type="password"
                  autoComplete="current-password"
                  value={formik.values.confPassword}
                  error={formik.errors['confPassword'] ? true : false}
                  onChange={handleChange}
                  helperText={
                    formik.errors['confPassword']
                      ? formik.errors['confPassword']
                      : null
                  }
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Submit
            </Button>
          </Box>
          <br></br>
          
        </Box>
      </Container>
    </ThemeProvider>
  );
}