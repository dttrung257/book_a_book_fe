import React, { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Pagination } from "@mui/material";
import { toast } from "react-toastify";
import { Table, Form } from "react-bootstrap";
import { BsSearch } from "react-icons/bs";
import validator from "validator";
import { UserDetailInfo, UserSignUp } from "../../../models";
import UserItem from "./UserItem";
import style from "./User.module.css";
import styleMain from "../MainLayout.module.css";
import { useAppSelector } from "../../../store/hook";
import axios, { isAxiosError } from "../../../apis/axiosInstance";
import AppModal from "../../../components/AppModal/AppModal";

interface InfoError {
  firstName?: string;
  lastName?: string;
  email?: string;
  gender?: string;
  password?: string;
}

const validationInfo = (info: UserSignUp): InfoError => {
  const error: InfoError = {};

  if (!info.firstName) error.firstName = "First name is required";
  else if (!/^[A-Za-z\s]*$/.test(info.firstName))
    error.firstName = " First name must contains only letters";

  if (!info.lastName) error.lastName = "Last name is required";
  else if (!/^[A-Za-z\s]*$/.test(info.lastName))
    error.lastName = " Last name must contains only letters";

  if (!info.email) error.email = "Email address is required";
  else if (!validator.isEmail(info.email))
    error.email = "Please enter a valid email";

  if (!info.password) error.password = "Password is required";
  else if (!validator.isStrongPassword(info.password, { minNumbers: 0 }))
    error.password =
      "Password must have at least 8 characters, 1 uppercase, 1 lowercase and 1 symbol";

  if (!info.gender) error.gender = "Gender is required";

  return error;
};

const User = () => {
  const [showSearchModal, setShowSearchModal] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [userAddInfo, setUserAddInfo] = useState<UserSignUp>({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    password: "",
  });
  const [checkAddUser, setCheckAddUser] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [error, setError] = useState<InfoError>({});
  const [curPage, setCurPage] = useState<number>(
    parseInt(searchParams.get("page") || "0")
  );
  const [totalPages, setTotalPages] = useState<number>(1);
  const [usersList, setUsersList] = useState<UserDetailInfo[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const searchUserInputRef = useRef<HTMLInputElement>(null);
  const addUserInputRef = useRef<HTMLInputElement>(null);
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  const getUsersList = useCallback(
    async (name: string, page: number | string = 0) => {
      const response = await axios.get(
        `/manage/users?name=${name}&page=${page}&size=15`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    },
    [accessToken]
  );

  const handleCloseAddModal = (show: boolean) => {
    setShowAddModal(show);
    setUserAddInfo({
      firstName: "",
      lastName: "",
      email: "",
      gender: "",
      password: "",
    });
    setError({});
  };

  useEffect(() => {
    const user = searchParams.get("user") || "";
    const pageParam = searchParams.get("page") || "0";
    let page = 0;
    if (!isNaN(Number(pageParam))) page = Number(pageParam);

    getUsersList(user, page)
      .then((data) => {
        setUsersList(data.content);
        setCurPage(page);
        setTotalPages(data.totalPages);
      })
      .catch((error) => {
        if (isAxiosError(error)) {
          const data = error.response?.data;
          toast.error(data?.message);
        } else {
          toast.error("Unknow error!!!");
        }
        console.log(error);
      });

    window.scrollTo(0, 0);
    return () => {};
  }, [getUsersList, searchParams, checkAddUser]);

  const onAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const err = validationInfo(userAddInfo);
      console.log(err);
      if (err && Object.keys(err).length !== 0) return setError(err);
      setError({});

      const response = await axios.post(`/manage/users`, userAddInfo, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      toast.success("User has been added successfully");
      console.log(response);
      setCheckAddUser((pre) => !pre);
      handleCloseAddModal(false);
    } catch (error) {
      if (isAxiosError(error)) {
        const data = error.response?.data;
        toast.error(data?.message);
      } else {
        toast.error("Unknow error!!!");
        console.log(error);
      }
    }
  };

  const onSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    searchParams.set("user", searchText.replace(/\s+/g, " ").trim());
    searchParams.set("page", "0");
    setSearchParams(searchParams);
    setSearchText("");
    setShowSearchModal(false);
  };

  const handleChangePage = async (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    searchParams.set("page", (value - 1).toString());
    setSearchParams(searchParams);
  };

  return (
    <div>
      <div className={`${styleMain.header}`}>
        <h2> Users list</h2>
        <Button
          variant="contained"
          onClick={() => {
            setShowAddModal(true);
          }}
        >
          Add user
        </Button>
      </div>
      <div
        className={`${styleMain.content} d-flex flex-column justify-content-between`}
      >
        <div>
          <div className="d-flex justify-content-between align-items-center">
            <h4>Result for {searchParams.get("user") || "all users"}</h4>
            <div
              id={style.search}
              className="px-3 py-2 d-flex justify-content-between align-items-center"
              onClick={() => setShowSearchModal(true)}
            >
              Search for users
              <BsSearch />
            </div>
          </div>
          <div>
            <Table className="mt-4" hover responsive="md">
              <thead className={`${style.tableHeader}`}>
                <tr>
                  <th>ID</th>
                  <th>Full name</th>
                  <th>Gender</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Setting </th>
                </tr>
              </thead>
              <tbody className={`${style.tableBody}`}>
                {usersList.map((user) => (
                  <UserItem key={user.email} user={user} />
                ))}
              </tbody>
            </Table>
          </div>
        </div>
        <Pagination
          count={totalPages}
          page={curPage + 1}
          color="primary"
          style={{
            marginLeft: "auto",
            marginRight: "auto",
            height: "auto",
            marginTop: "auto",
          }}
          onChange={handleChangePage}
          showFirstButton
          showLastButton
        />
      </div>

      <AppModal
        showModal={showSearchModal}
        setShowModal={setShowSearchModal}
        title={"Search for users "}
        inputRef={searchUserInputRef}
      >
        <div>
          <form className={styleMain.searchForm} onSubmit={onSearchSubmit}>
            <div>
              <label htmlFor="searchInput">Name or email</label>
              <input
                id="searchInput"
                name="searchInput"
                ref={searchUserInputRef}
                type="text"
                value={searchText}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchText(e.target.value)
                }
              />
            </div>
            <div className="d-flex justify-content-end">
              <Button
                className={styleMain.cancelBtn}
                type="button"
                onClick={() => {
                  setSearchText("");
                  setShowSearchModal(false);
                }}
              >
                Cancel
              </Button>
              <Button className={styleMain.searchBtn} type="submit">
                Search
              </Button>
            </div>
          </form>
        </div>
      </AppModal>
      <AppModal
        title="Add User"
        showModal={showAddModal}
        setShowModal={handleCloseAddModal}
        inputRef={addUserInputRef}
      >
        <div className={`${style.addUserModal}`}>
          <form onSubmit={onAddUser}>
            <Form.Group className="mb-3" controlId="firstNameAdd">
              <Form.Label>First name</Form.Label>
              <Form.Control
                ref={addUserInputRef}
                type="text"
                placeholder=""
                value={userAddInfo.firstName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setUserAddInfo({
                    ...userAddInfo,
                    firstName: e.target.value,
                  })
                }
              />
              {error?.firstName ? (
                <Form.Text className="text-danger">{error.firstName}</Form.Text>
              ) : null}
            </Form.Group>

            <Form.Group className="mb-3" controlId="lastNameAdd">
              <Form.Label>Last name</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                value={userAddInfo.lastName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setUserAddInfo({
                    ...userAddInfo,
                    lastName: e.target.value,
                  })
                }
              />
              {error?.lastName ? (
                <Form.Text className="text-danger">{error.lastName}</Form.Text>
              ) : null}
            </Form.Group>

            <Form.Group className="mb-3" controlId="emailAdd">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter email"
                value={userAddInfo.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setUserAddInfo({
                    ...userAddInfo,
                    email: e.target.value.trim(),
                  })
                }
              />
              {error?.email ? (
                <Form.Text className="text-danger">{error.email}</Form.Text>
              ) : null}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Gender</Form.Label>
              <div className="d-flex justify-content-between">
                {["Female", "Male", "Other"].map((gen) => {
                  return (
                    <Form.Check
                      key={gen}
                      type="radio"
                      label={gen}
                      name="gender"
                      value={gen}
                      id={gen}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setUserAddInfo({
                          ...userAddInfo,
                          gender: e.target.value,
                        })
                      }
                    />
                  );
                })}
              </div>
              {error?.gender ? (
                <Form.Text className="text-danger">{error.gender}</Form.Text>
              ) : null}
            </Form.Group>

            <Form.Group className="mb-3" controlId="passwordAdd">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                value={userAddInfo.password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setUserAddInfo({
                    ...userAddInfo,
                    password: e.target.value.trim(),
                  })
                }
              />
              {error?.password ? (
                <Form.Text className="text-danger">{error.password}</Form.Text>
              ) : null}
            </Form.Group>

            <div className={`${style.btnGroup} float-end`}>
              <Button
                type="button"
                color="secondary"
                className={style.cancelBtn}
                onClick={() => handleCloseAddModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                Add
              </Button>
            </div>
          </form>
        </div>
      </AppModal>
    </div>
  );
};

export default User;
