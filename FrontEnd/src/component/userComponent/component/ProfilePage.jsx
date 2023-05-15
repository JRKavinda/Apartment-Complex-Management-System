import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import avatar from '../assets/profile.png';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../AuthProvider';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import UpdateCustomer from './UpdateCustomer';
import { IconButton } from '@material-ui/core';

//import Popup from './Popup';

//import ClassNameGenerator from '@mui/core/generateUtilityClass/ClassNameGenerator';

// function DataFetching(){
//   const[posts, setPosts] = useState([])

//   useEffect(() => {
//     axios.get('/customer/get/')
//     .then((res,err) => {
//       console.log("Fetched Customer")
//     })
//     .catch((err) => {
//       console.log(err)
//     })
//   })
// }

export default function MediaCard(props) {
  let authPayload = useContext(AuthContext);
  const [customer, setCustomer] = useState([]);
  const decoded = jwt_decode(authPayload.token);
  const Id = decoded.id;
  const [getId, setGetId] = useState(0);
  const [openPopup, setOpenPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(`/customer/getCustomer/${Id}`);

      const cus = data.customerModle;
      //const val =Object.values(cus)
      setCustomer(cus);
    };
    fetchData();
  }, []);

  const handleProps = id => {
    setGetId(id);

    <UpdateCustomer id={id}></UpdateCustomer>;
    navigate(`/app/updateCustomer/${id}`);
  };

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = event => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append('photo', selectedFile);
    console.log(selectedFile);

    const response = await axios
      .put(`/customer/upload/${Id}`, formData)
      .then( res => {console.log(res)})
      .catch(error => {
        console.log('Error uploading file:', error);
      });
  };

  return (
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <IconButton
      
      color="primary"
      aria-label="upload picture"
      component="span"
      style={{ marginTop: '8%' }}>
          {selectedFile && (
            <img  style={{ width: '50%' }} alt = {customer.photo}/>
       )}
      </IconButton>
      <Avatar alt="Remy Sharp" src={avatar} sx={{ width: 90, height: 90 }} />
      <Typography gutterBottom variant="h5" component="div">
        Name
      </Typography>
      <Box component="form" noValidate sx={{ mt: 1 }}>
        <Card sx={{ maxWidth: 600, height: 550 }}>
          <CardMedia
            sx={{ height: 140 }}
            // image="/static/images/cards/contemplative-reptile.jpg"
            // title="green iguana"
          />

          <CardActions>
            <Grid container justifyContent="center" spacing={12}>
              <Grid item>
                {/* <Button
                variant="contained"
                style={{
                  backgroundColor: '#006ee6',
                }}
                onClick={handleFileUpload}
              >
                Update
              </Button> */}
                <div>
                  <input type="file" onChange={handleFileChange} />
                  {/* <button onClick={handleFileUpload}>Upload</button> */}
                  <Button
                    variant="contained"
                    style={{
                      backgroundColor: '#006ee6',
                    }}
                    onClick={handleFileUpload}
                  >
                    Upload
                  </Button>
                </div>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: '#006ee6',
                  }}
                >
                  Delete
                </Button>
              </Grid>
            </Grid>
          </CardActions>
          <CardContent>
            {/* {customer && customer.map(data => (

              ))} */}
            <Typography variant="body2" color="text.secondary">
              <span>
                <b>Apartment No:</b> {customer.apartmentNo}{' '}
              </span>
              <br />
              <span>
                <b>Name:</b> {customer.name}{' '}
              </span>
              <br />
              <span>
                <b>NIC No:</b> {customer.nicNo}{' '}
              </span>
              <br />
              <span>
                <b>Phone No:</b> {customer.phoneNo}
              </span>
              <br />
              <span>
                <b>Email:</b> {customer.email}{' '}
              </span>
              <br />

              <br />
            </Typography>
          </CardContent>
          <CardActions>
            <Grid container justifyContent="center" spacing={2}>
              <Grid item xs={12} md={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  style={{
                    backgroundColor: '#006ee6',
                  }}
                  onClick={() => handleProps(customer._id)}
                >
                  Update Profile
                </Button>
              </Grid>
              <Grid item xs={12} md={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  style={{
                    backgroundColor: '#006ee6',
                  }}
                  // onClick={enableDialogHandler}
                >
                  Generate QR Coode
                </Button>
              </Grid>
              <Grid item xs={12} md={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  style={{
                    backgroundColor: '#006ee6',
                  }}
                  // onClick={enableDialogHandler}
                >
                  Report
                </Button>
              </Grid>
            </Grid>
          </CardActions>
        </Card>
        {/* <Popup
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
        customer={customer}
        setCustomer={setCustomer}
        getId={getId}
      ></Popup> */}
      </Box>
    </Box>
  );
}
