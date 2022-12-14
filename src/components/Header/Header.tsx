import { ChangeEvent, Fragment, useState } from "react";
import { FiSearch, FiUser, FiShoppingCart } from "react-icons/fi";
import style from "./Header.module.css";
import {
  Avatar,
  Badge,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { Link, useNavigate } from "react-router-dom";
import { authActions } from "../../store/authSlice";

const Header = () => {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const user = useAppSelector((state) => state.auth.user);
  const totalQuantity = useAppSelector((state) => state.cart.totalQuantity);
  const navigate = useNavigate();
  const [searchKey, setSearchKey] = useState("");
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const [previousName, setPreviousName] = useState<string>();
  const handleSearch = () => {
    if (name !== previousName) {
      setName(name.replace(/\s+/g, " ").trim());
      let param = `books?page=0`;
      if (name !== "") {
        param = param.concat(`&name=${name}`);
      }
      setName("");
      navigate(param);
      setPreviousName(name);
    }
  };

  const searchEnterHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === "Enter") {
      handleSearch();
    }
  };

  const onChangeSearchBox = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.currentTarget.value);
    setSearchKey(event.currentTarget.value.trim());
  };

  const onLogout = () => {
    dispatch(authActions.logout());
  };

  return (
    <div id={style.header}>
      <div id={style.headerLeft}>
        <div id={style.logo}>
          <Link to="/">
            <p>
              <span>
                <i>Book</i>
              </span>
              a<i>Book</i>
            </p>
          </Link>
        </div>
        <div id={style.nav}>
          <Link to="/">
            <div className={style.navAddr}>Home</div>
          </Link>
          <Link to="/books">
            <div className={style.navAddr}>
              Categories
            </div>
          </Link>

          <Link to="/about-us">
            <div className={style.navAddr}>Blogs</div>
          </Link>
          <Link to="/about-us">
            <div className={style.navAddr}>About us</div>
          </Link>
        </div>
      </div>
      <div id={style.search}>
        <input
          id={style.searchBar}
          placeholder="Search book..."
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          } /*onChange={onChangeSearchBox}*/
          onKeyDown={searchEnterHandler}
        />
        <FiSearch
          color="008B8B"
          onClick={handleSearch}
          id={style.searchIcon}
        ></FiSearch>
      </div>
      <div id={style.account}>
        {isLoggedIn ? (
          <Fragment>
            <div className={style.dropdown}>
              <div
                style={{
                  display: "flex",
                }}
                className={style.dropbtn}
              >
                <Avatar
                  src={user.avatar}
                  style={{ maxWidth: 25, maxHeight: 25 }}
                />
                &nbsp;&nbsp;
                <span>{`${user.firstName} ${user.lastName}`}</span>
              </div>
              <div className={style.dropdownContent}>
                <List>
                  <ListItem disablePadding>
                    <ListItemButton
                      style={{ padding: "3px 30px 3px 15px" }}
                      component="a"
                      onClick={() => navigate("/account")}
                    >
                      <ListItemText
                        primaryTypographyProps={{
                          fontSize: 14,
                          fontWeight: 500,
                          minWidth: "85px",
                        }}
                        primary="My Account"
                      />
                    </ListItemButton>
                  </ListItem>
                  {user.authority === "ADMIN" ? (
                    <ListItem disablePadding>
                      <ListItemButton
                        style={{ padding: "3px 30px 3px 15px" }}
                        component="a"
                        onClick={() => navigate("/dashboard")}
                      >
                        <ListItemText
                          primaryTypographyProps={{
                            fontSize: 14,
                            fontWeight: 500,
                          }}
                          primary="Dashboard"
                        />
                      </ListItemButton>
                    </ListItem>
                  ) : (
                    <ListItem disablePadding>
                      <ListItemButton
                        style={{ padding: "3px 30px 3px 15px" }}
                        component="a"
                        href="/purchase"
                      >
                        <ListItemText
                          primaryTypographyProps={{
                            fontSize: 14,
                            fontWeight: 500,
                          }}
                          primary="My Order"
                        />
                      </ListItemButton>
                    </ListItem>
                  )}
                  <ListItem disablePadding>
                    <ListItemButton
                      style={{ padding: "3px 30px 3px 15px" }}
                      component="a"
                      href=""
                      onClick={onLogout}
                    >
                      <ListItemText
                        primaryTypographyProps={{
                          fontSize: 14,
                          fontWeight: 500,
                        }}
                        primary="Log out"
                      />
                    </ListItemButton>
                  </ListItem>
                </List>
              </div>
            </div>
            {user.authority === "ADMIN" ? null : (
              <Badge
                overlap="rectangular"
                badgeContent={totalQuantity}
                color="error"
                onClick={() => navigate("/cart")}
              >
                <FiShoppingCart fontSize={20} />
              </Badge>
            )}
          </Fragment>
        ) : (
          <Fragment>
            <FiUser style={{ marginRight: "10px" }} fontSize={20} />
            <Link to="/login">Log in</Link>
            <svg height="30" width="30">
              <line
                x1="15"
                y1="5"
                x2="15"
                y2="25"
                style={{ stroke: "#999999", strokeWidth: 2 }}
              />
            </svg>
            <Link to="/signup">Sign up</Link>
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default Header;
