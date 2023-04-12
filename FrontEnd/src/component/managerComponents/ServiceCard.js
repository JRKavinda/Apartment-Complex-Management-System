import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import './serviceProvider.css';

export default function ServiceCard(props) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        sx={{ height: 140 }}
        image="/static/images/cards/contemplative-reptile.jpg"
        title={props.cName}
      />
      <CardContent>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          style={{ textAlign: 'Center' }}
        >
          {props.cName}
        </Typography>
        <Typography variant="body2" color="text.secondary" align = "center">
          <span>
            <b>Service Type:</b> {props.sType}
          </span>
          <br />
          <span>
            <b>Location:</b> {props.location}{' '}
          </span>
          <br />
          <span>
            <b>Contact Number:</b> {props.cNumber}{' '}
          </span>
          <br />
        </Typography>
      </CardContent>
      <CardActions style = {{padding: "5%"}}>
        <Grid container justifyContent="center" spacing={12}>
          <Grid item>
            <Button
              variant="contained"
              style={{
                backgroundColor: '#FFBD03',
              }}
            >
              Update
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              style={{
                backgroundColor: '#5ADBB5',
              }}
            >
              Delete
            </Button>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
}
