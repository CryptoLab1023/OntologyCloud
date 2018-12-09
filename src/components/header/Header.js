import React, {Component} from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import Menu from '@material-ui/core/Menu';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  link: {
    textDecoration: 'none',
    color: '#fff'
  }
};


class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      classes: this.props.classes
    }
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {

    const { anchorEl, classes } = this.state;
    const open = Boolean(anchorEl);

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={this.handleClick}>
              <MenuIcon
                aria-owns={anchorEl ? 'simple-menu' : undefined}
                aria-haspopup="true"
              />
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={this.handleClose}
            >
              <MenuItem onClick={this.handleClose}>account: {this.props.account}</MenuItem>
              <MenuItem onClick={this.handleClose}>balance of ONG: {this.props.balanceOng} ONG</MenuItem>
              <MenuItem onClick={this.handleClose}>balance of ONT: {this.props.balanceOnt} ONT</MenuItem>
            </Menu>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              Ontology Cloud
            </Typography>
            {
              this.props.loginFlg === false &&
              <Button color="inherit" ><Link className={classes.link} to="signup">Sign Up
              </Link></Button>
            }
            {
              this.props.loginFlg === false &&
              <Button color="inherit" ><Link className={classes.link} to="/login">Login
              </Link></Button>
            }
            {
              this.props.loginFlg === true &&
              <Button color="inherit" ><Link className={classes.link} to="/" onClick={() => this.props.logout()}>Logout
              </Link></Button>
            }
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withStyles(styles)(Header);
