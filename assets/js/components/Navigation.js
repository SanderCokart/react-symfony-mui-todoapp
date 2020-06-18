import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import {Toolbar, Link, List, ListItem, ListItemIcon, ListItemText} from '@material-ui/core/';
import React, {useState} from 'react';
import MenuIcon from '@material-ui/icons/Menu';
import {withRouter} from 'react-router-dom';
import ListIcon from '@material-ui/icons/List'
import CategoryIcon from '@material-ui/icons/Category'


const Navigation = (props) => {
    const {history} = props;

    const list = [
        {text: 'Todo List', icon: <ListIcon/>, link: '/todo-list'},
        {text: 'Categories', icon: <CategoryIcon/>, link: '/category-list'},
    ];

    const [drawerOpen, setDrawerOpen] = useState(false);
    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };


    return (
        <>
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton color="inherit" style={{marginRight: '1rem'}} onClick={toggleDrawer} edge="start">
                        <MenuIcon/>
                    </IconButton>
                    <Link style={{flexGrow: 1}}
                          underline="none"
                          color="inherit"
                          href=""
                          onClick={() => history.push('/')}
                          variant="h6"
                    >
                        TodoList
                    </Link>
                    <Button color="inherit" size="large">Login</Button>
                </Toolbar>
            </AppBar>
            <Drawer variant="temporary" anchor="left" open={drawerOpen} onClose={toggleDrawer}>
                <List className="m0 p0" style={{width: '250px'}} onClick={toggleDrawer}>
                    {list.map((item, index) => (
                        <Link color="textPrimary"
                              underline="none"
                              key={index}
                              onClick={() => props.history.push(item.link)}>
                            <ListItem button>
                                {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
                                <ListItemText primary={item.text}/>
                            </ListItem>
                        </Link>
                    ))}
                </List>
            </Drawer>
        </>
    );
};

export default withRouter(Navigation);