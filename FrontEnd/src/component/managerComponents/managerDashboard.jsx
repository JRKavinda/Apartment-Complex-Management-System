import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { makeStyles } from 'tss-react/mui';
import clsx from 'clsx';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const useStyles = makeStyles()(theme => ({
  root: {
    // [theme.breakpoints.up('md')]: {
    //   width: '30%',
    // },
    // [theme.breakpoints.down('md')]: {
    //   width: '60%',
    // },
    // [theme.breakpoints.down('sm')]: {
    //   width: '95%',
    // },

    margin: '0 auto',
    height: '100vh',
    width: 'auto',
    paddingTop: '30px',
    paddingLeft: '60px',
  },
  content: {
    paddingTop: '40px',
  },
  nav: {
    '&:hover': {
      textDecoration: 'underline green',
      textDecorationSkipInk: 'none',
      textDecorationThickness: '0.2em',
      textUnderlineOffset: '0.4em',
      borderRadius: '50px',
    },

    fontSize: '18px',
    fontWeight: 'bold',
    textDecoration: 'none',
    color: 'black',
    textAlign: 'center',
    marginRight: '2%',
    transistion: 'all 0.2s ease-in-out',
  }
}));

function ManagerDashboard() {
  const { classes } = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const navLinkStyle = ({ isActive }) => {
    return {
      frontWeight: isActive ? 'bold' : 'normal',
      color: isActive ? 'green' : 'black',
    };
  };

  return (
    <div className={classes.root}>
      <h1>Manager Dashboard</h1>
      <div className={classes.content}>
        <NavLink
          to=""
          className={clsx(classes.nav)}
          style={navLinkStyle}
        >
          <span>Home</span>
        </NavLink>
        <NavLink
          to="staff"
          className={clsx(classes.nav)}
          style={navLinkStyle}
          onMouseEnter={handleClick}
        >
          <span>Staff</span>
        </NavLink>
        <NavLink
          to="serviceProvider"
          className={clsx(classes.nav)}
          style={navLinkStyle}
        >
          <span>Service Providers</span>
        </NavLink>
        <NavLink
          to="notices"
          className={clsx(classes.nav)}
          style={navLinkStyle}
        >
          <span>Notices</span>
        </NavLink>

        {/* <div><CalenderComp/></div> */}
        <Outlet />

        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
           <NavLink
            to="/manager/Employee_View"
            style = {{textDecoration: 'none', color: 'black'}}
          >
          <MenuItem>View Staff</MenuItem>
          </NavLink>
          <NavLink
            to="/manager/Employee_add"
            style = {{textDecoration: 'none', color: 'black'}}
          >
            <MenuItem onClick={handleClose}>Add Staff</MenuItem>
          </NavLink>
          
        </Menu>
      </div>
    </div>
  );
}

export default ManagerDashboard;
