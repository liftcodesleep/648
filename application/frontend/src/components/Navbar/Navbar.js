import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import {
  Button,
  Icon,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "30ch",
      "&:focus": {
        width: "50ch",
      },
    },
  },
}));

export default function Navbar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  // const [limit, setLimit] = React.useState(5);
  // const [offset, setOffset] = React.useState(0);
  const [search, setSearch] = React.useState("");
  // const [category, setCategory] = React.useState("");
  // const [sortby, setSortby] = React.useState("");
  // const [sortType, setSortType] = React.useState("DESC");
  // const [searchResults, setSearchResults] = React.useState([]);
  const [logout, setLoggout] = React.useState(false);
  const [currState, setState] = React.useState({
    limit: 5,
    offset: 0,
    searchText: "",
    category: "",
    sortby: "",
    sortType: "DESC",
    categories: [],
    searchResults: [],
    error: null,
  });

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setSearch(event.target.value);
    setState((prevData) => ({
      ...prevData,
      searchText: search,
    }));
    console.log(search);
  };

  const handleSearch = async (event) => {
    event.preventDefault();

    const { limit, offset, searchText, sortby, sortType } = currState;
    try {
      const response = await fetch("http://44.197.240.111/view_public_posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify({
          limit,
          offset,
          searchText,
          sortby,
          sortType,
        }),
      });
      const data = await response.json();
      if (data.status === "SUCCESS") {
        if (data.posts.length > 0) {
          setState((prevData) => ({
            ...prevData,
            searchResults: data.posts,
            error: null,
          }));
        } else {
          setState((prevData) => ({
            ...prevData,
            searchResults: [],
            error: data.message,
          }));
        }
      } else {
        setState((prevData) => ({
          ...prevData,
          searchResults: [],
          error: data.message,
        }));
      }
    } catch (error) {
      setState((prevData) => ({
        ...prevData,
        error: "Failed to fetch search results",
      }));
    }
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClick = () => {
    navigate("/user-profile");
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  const handleLogout = async () => {
    const username = Cookies.get("username");
    const payload = {
      username: username,
    };
    try {
      const response = await fetch("http://44.197.240.111/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.status === "SUCCESS" && data.isLoggedout) {
          Cookies.remove("token");
          Cookies.remove("username");
          setLoggout(data.isLoggedout);
        } else {
          setState((prev) => ({ ...prev, error: data.message }));
        }
      } else {
        setState((prev) => ({
          ...prev,
          error: "Something went wrong. Please try again",
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1, marginBottom: "2rem" }}>
      <Box position="static" sx={{ color: "white" }}>
        <Toolbar>
          <Box>
            <img
              src={require("../../Images/picturePerfect.jpg")}
              alt="Logo"
              className="h-10 w-15"
            />
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            letterSpacing={2}
            sx={{
              display: { xs: "none", sm: "block" },
              fontWeight: "900",
              fontSize: "32px",
              padding: "0px 20px",
              borderRadius: "5px",
              color: "rgb(27, 0, 55)",
              textShadow: "1px 1px 5px rgba(0,0,0,0.5)",
            }}
          >
            Picture Perfect
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…images, #tags, @users"
              inputProps={{ "aria-label": "search" }}
              value={search}
              onChange={handleInputChange}
              onSubmit={handleSearch}
            />
          </Search>

          <Box sx={{ flexGrow: 1 }} />
          <Link to="/uploadimage">
            <Button
              startIcon={<AddIcon />}
              sx={{
                backgroundColor: "rgb(47, 13, 83)",
                color: "white",
                paddingLeft: "20px",
                paddingRight: "20px",
                fontWeight: "500",
                letterSpacing: "2px",
                margin: "0px 32px",
              }}
            >
              Add Image
            </Button>
          </Link>
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <ListItemButton component={Link} to="/">
              <ListItemText primary="Home" />
            </ListItemButton>

            <ListItemButton component={Link} to="/about">
              <ListItemText primary="About" />
            </ListItemButton>

            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Box>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
