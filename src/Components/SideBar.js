import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import React ,{useState,useEffect} from "react";
import { NavConfig } from "./sideConfig";
import { Outlet, useNavigate } from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import MenuIcon from "@mui/icons-material/Menu";
import { Popover } from "@mui/material";
import Cookies from "universal-cookie";

const SideBar = () => {
  const cookies =new Cookies();
  const drawerWidth = 340;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [openSubMenu, setOpenSubMenu] = React.useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
 const [userName,setUserName]=useState([]);
  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'avatar-popover' : undefined;
  const navigate = useNavigate();
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleNav = (nav,index) => {
    if (NavConfig[index]?.subItems) {
      setOpenSubMenu(openSubMenu === index ? null : index); // Toggle submenu visibility
    } else {
      navigate(nav);
    }
  };
  useEffect(() => {
    const userName = cookies.get('name');
    setUserName(userName);
  }, []);
  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {NavConfig.map((text, index) => (
          <div key={text.name}>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleNav(text.path, index)}>
                <ListItemIcon sx={{ color: "white" }}>
                  {text.icon}
                </ListItemIcon>
                <ListItemText primary={text.name} />
              </ListItemButton>
            </ListItem>

            {/* Conditionally render subitems if the submenu is open */}
            {index === openSubMenu &&
              text.subItems &&
              text.subItems.map((subItem, subIndex) => (
                <ListItem key={subItem.name} sx={{ pl: 4 }}>
                  <ListItemButton onClick={() => navigate(subItem.path)}>
                    <ListItemIcon sx={{ color: "white" }}>
                      {subItem.icon}
                    </ListItemIcon>
                    <ListItemText primary={subItem.name} />
                  </ListItemButton>
                </ListItem>
              ))}
          </div>
        ))}
      </List>
    </div>
  );
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
          <AppBar
             position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: "#25242D",
          display: "flex",
          justifyContent: "space-between",
          padding: "8px"
            }}
    >
    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
       <div style={{ display: 'flex', alignItems: 'center' }}>
       <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: "none" } }}
       >
        <MenuIcon />
      </IconButton>
       <Typography variant="h6" noWrap component="div" sx={{ fontWeight: "600" }}>
           Black Box
      </Typography>
    </div>
      <Avatar
         alt="Remy Sharp"
         src="/static/images/avatar/1.jpg"
         sx={{ width: 56, height: 56 }}
         aria-describedby={id}
         onClick={handleAvatarClick}
      />
       <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
         <Box sx={{ p: 4 }}>
          <Typography variant="body1"> {userName}</Typography>
          <Typography variant="body1">Your Name</Typography>
          <Typography variant="body2" >Logout</Typography>
        </Box>
      </Popover>
      </Toolbar>
   </AppBar>
   <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          <Drawer
            // container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                background: "#25242D",
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                background: "#25242D",
                color: "white",
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
    </>
  );
};

export default SideBar;
