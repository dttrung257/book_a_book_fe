import React from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { HiUserGroup } from "react-icons/hi";
import { MdLibraryBooks } from "react-icons/md";
import { RiFileList3Fill } from "react-icons/ri";
import { VscCommentDiscussion } from "react-icons/vsc";
import style from "./DashBoardLayout.module.css";
import {
  Avatar,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { NavLink } from "react-router-dom";
import { formatStr } from "../../utils";
import { authActions } from "../../store/authSlice";

const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  const onLogout = () => {
    dispatch(authActions.logout());
  };

  return (
    <header>
      <div id={style.headerLeft}>
        <div className={style.logo}>
          <NavLink to="/">
            <p>
              <span>
                <i>Book</i>
              </span>
              a<i>Book</i>
            </p>
          </NavLink>
        </div>
        <h3 className={style.title}>Management</h3>
      </div>

      <div className={style.account}>
        <div className={style.dropdown}>
          <div
            style={{
              width: "200px",
              gap: "8px",
            }}
            className="d-flex justify-content-start px-1"
          >
            <Avatar src={user.avatar} style={{ maxWidth: 25, maxHeight: 25 }} />
            <span>{formatStr(`${user.firstName} ${user.lastName}`, 18)}</span>
          </div>
          <div className={style.dropdownContent}>
            <List>
              <ListItem disablePadding>
                <ListItemButton
                  style={{ padding: "3px 30px 3px 15px" }}
                  component="a"
                  onClick={() => navigate("/")}
                >
                  <ListItemText
                    primaryTypographyProps={{
                      fontSize: 14,
                      fontWeight: 500,
                      minWidth: "85px",
                    }}
                    primary="Home"
                  />
                </ListItemButton>
              </ListItem>

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
                      minWidth: "85px",
                    }}
                    primary="Log out"
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </div>
        </div>
      </div>
    </header>
  );
};

const Footer = () => {
  return (
    <footer id={style.copyright} className="text-center">
      <p>@2022- Book a book All Rights Reserved</p>
    </footer>
  );
};

const Navbar = () => {
  return (
    <nav>
      <div>
        <NavLink
          to={"users"}
          className={({ isActive }) => (isActive ? style.isActive : "")}
        >
          <HiUserGroup />
          Users
        </NavLink>
      </div>
      <div>
        <NavLink
          to={"books"}
          className={({ isActive }) => (isActive ? style.isActive : "")}
        >
          <MdLibraryBooks />
          Books
        </NavLink>
      </div>
      <div>
        <NavLink
          to={"orders"}
          className={({ isActive }) => (isActive ? style.isActive : "")}
        >
          <RiFileList3Fill />
          Orders
        </NavLink>
      </div>
      <div>
        <NavLink
          to={"comments"}
          className={({ isActive }) => (isActive ? style.isActive : "")}
        >
          <VscCommentDiscussion />
          Comments
        </NavLink>
      </div>
    </nav>
  );
};

const DashBoardLayout = () => {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const user = useAppSelector((state) => state.auth.user);

  if (!isLoggedIn || user.authority !== "ADMIN") return <Navigate to="/" />;

  return (
    <div id={style.dashboard}>
      <Header />
      <div className={`${style.container} d-flex flex-row`}>
        <Navbar />
        <div className={"p-3 bg-transparent flex-grow-1"}>
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DashBoardLayout;
