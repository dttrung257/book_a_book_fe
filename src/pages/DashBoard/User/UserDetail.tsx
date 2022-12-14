import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Avatar, Pagination } from "@mui/material";
import { TiArrowBack } from "react-icons/ti";
import { MdVerifiedUser, MdWarning } from "react-icons/md";
import { Table, Form } from "react-bootstrap";
import style from "./User.module.css";
import styleMain from "../MainLayout.module.css";
import { UserDetailInfo } from "../../../models";
import AppModal from "../../../components/AppModal/AppModal";
import { isAxiosError } from "../../../apis/axiosInstance";
import { useAppSelector } from "../../../store/hook";
import PasswordError, { checkPassword } from "../../../utils/checkPassword";
import {
  changeUserPassword,
  deleteUser,
  getUser,
  getUserOrders,
} from "../../../apis/manage";

interface Order {
  id: string;
  address: string;
  orderDate: string;
  status: string;
  user_id: string;
}

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accessToken, user } = useAppSelector((state) => state.auth);
  const [userInfo, setUserInfo] = useState<UserDetailInfo | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [curPage, setCurPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [editPassErrMessage, setEditPassErrMessage] = useState<PasswordError>(
    {}
  );
  const [errMessage, setErrMessage] = useState<string>("");
  const [lastOrder, setLastOrder] = useState<{ date: string; id: string }>({
    date: "",
    id: "",
  });

  const getOrders = async (id: string, page: number = 0) => {
    const userOrders = await getUserOrders(id, page, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (page === 0 && userOrders.content.length > 0) {
      setLastOrder({
        date: userOrders.content[0].orderDate,
        id: userOrders.content[0].id,
      });
    }

    setOrders(userOrders.content);
    setTotalPages(userOrders.totalPages);
  };

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        if (!userInfo) {
          const user = await getUser(id as string, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setUserInfo(user);
          await getOrders(user.id as string);
        } else {
          await getOrders(userInfo.id, curPage);
        }
      } catch (error) {
        if (isAxiosError(error)) {
          const data = error.response?.data;
          setErrMessage(data?.message);
        } else {
          setErrMessage("Unknow error!!!");
          console.log(error);
        }
      }
    };

    getUserInfo();
    window.scrollTo(0, 0);
    return () => {};
  }, [accessToken, id, curPage]);

  const handleChangePage = async (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurPage(value - 1);
  };

  const handleDeleteUser = async () => {
    if (userInfo && userInfo.authority === "ADMIN") {
      return toast.error("Can not delete this user!");
    }

    try {
      await deleteUser(id as string, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      toast.success(
        `User ${
          userInfo?.firstName + " " + userInfo?.lastName
        } has been deleted`
      );
      navigate(-1);
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

  const editPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      userInfo &&
      userInfo.authority === "ADMIN" &&
      userInfo.email !== user.email
    ) {
      return toast.error("Can not edit this user's password!");
    }

    try {
      const passwordError = checkPassword(newPassword, confirmNewPassword);
      setEditPassErrMessage(passwordError);
      if (passwordError && Object.keys(passwordError).length !== 0) return;

      await changeUserPassword(userInfo?.id as string, newPassword, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      toast.success("Change password successfully");
      setEditModal(false);
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

  return (
    <div id={style.userDetail}>
      <div className={`${styleMain.header}`}>
        <div className="d-flex align-items-center">
          <TiArrowBack
            className={styleMain.goBackBtn}
            size={30}
            onClick={() => navigate(-1)}
          />
          <h2>User Profile</h2>
        </div>
        <div className={style.btnGroup}>
          <Button variant="contained" onClick={() => setEditModal(true)}>
            Edit password
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => setDeleteModal(true)}
          >
            Delete
          </Button>
        </div>
      </div>
      <div className={`${styleMain.content} d-flex flex-nowrap`}>
        <div className={`${style.left} pe-3`}>
          <div
            className={`${style.avatar} d-flex flex-column align-items-center`}
          >
            <div className={`mb-3`}>
              <Avatar
                src={userInfo?.avatar}
                style={{
                  minWidth: 200,
                  minHeight: 200,
                }}
                alt="avatar"
              />
            </div>
            <div>
              <h3>
                {userInfo &&
                  `${userInfo?.firstName + " " + userInfo?.lastName}`}
              </h3>
            </div>
            <div>
              Status:{" "}
              <p
                style={{
                  color: userInfo && userInfo.locked ? "red" : "greenyellow",
                }}
              >
                {userInfo && userInfo.locked ? "Locked" : "Not locked"}
              </p>
            </div>
          </div>
          <div className={`${style.info} d-flex flex-column`}>
            <p className={`${style.title}`}>Information</p>
            <div>
              <h5>Email</h5>
              <p>
                {userInfo && userInfo?.email}{" "}
                {userInfo && userInfo.emailVerified ? (
                  <MdVerifiedUser style={{ color: "green" }} />
                ) : (
                  <MdWarning style={{ color: "red" }} />
                )}
              </p>
            </div>
            <div>
              <h5>Phone number</h5>
              <p>
                {userInfo && userInfo?.phoneNumber
                  ? userInfo?.phoneNumber
                  : "Not updated"}
              </p>
            </div>
            <div>
              <h5>Gender</h5>
              <p>{userInfo && userInfo?.gender}</p>
            </div>
            <div>
              <h5>Address</h5>
              <p>
                {userInfo && userInfo?.address
                  ? userInfo?.address
                  : "Not updated"}
              </p>
            </div>
            <div>
              <h5>Registered</h5>
              <p>{userInfo && userInfo?.createdAt}</p>
            </div>
          </div>
        </div>
        <div className={`${style.right} ps-3 flex-grow-1`}>
          <div>
            <p className={`${style.title}`}>Overview</p>
            <div className={` d-flex flex-wrap flex-column mx-3`}>
              <div>
                <h5>Ordered</h5>
                <p>{orders.length} orders</p>
              </div>
              <div>
                <h5>Last order</h5>
                <p>
                  {totalPages === 0
                    ? "Not ordered"
                    : `${lastOrder.date} - #${lastOrder.id}`}
                </p>
              </div>
            </div>
          </div>
          <div className="d-flex flex-column justify-content-between">
            <p className={`${style.title}`}>Orders history</p>
            {totalPages > 0 ? (
              <>
                <Table bordered hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Order date</th>
                      <th>Status</th>
                      <th>Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr
                        key={order.id}
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          navigate(`/dashboard/orders/${order.id}`);
                        }}
                      >
                        <td>{order.id}</td>
                        <td>{order.orderDate}</td>
                        <td>{order.status}</td>
                        <td>{order.address}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
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
              </>
            ) : (
              <p>Not ordered</p>
            )}
          </div>
          <span style={{ color: "red" }}>{errMessage}</span>
        </div>
      </div>
      <AppModal
        title="Delete "
        showModal={deleteModal}
        setShowModal={setDeleteModal}
      >
        <div className={`${styleMain.deleteModal}`}>
          <p>Delete user {id} ?</p>
          <div className="float-end">
            <Button
              className={styleMain.cancelBtn}
              type="button"
              onClick={() => {
                setDeleteModal(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                handleDeleteUser();
              }}
            >
              Confirm
            </Button>
          </div>
        </div>
      </AppModal>
      <AppModal
        title="Edit password"
        showModal={editModal}
        setShowModal={setEditModal}
      >
        <div style={{ minWidth: "500px" }} className={styleMain.editModal}>
          <Form onSubmit={editPassword}>
            <Form.Group className="mb-3" controlId="newPassword">
              <Form.Label>New password</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewPassword(e.target.value.trim())
                }
              />
              {editPassErrMessage?.password ? (
                <Form.Text className="text-danger">
                  {editPassErrMessage.password}
                </Form.Text>
              ) : null}
            </Form.Group>

            <Form.Group className="mb-3" controlId="confirmNewPassword">
              <Form.Label>Confirm password</Form.Label>
              <Form.Control
                type="text"
                placeholder="Confirm password"
                value={confirmNewPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setConfirmNewPassword(e.target.value.trim())
                }
              />
              {editPassErrMessage?.confirmPassword ? (
                <Form.Text className="text-danger">
                  {editPassErrMessage.confirmPassword}
                </Form.Text>
              ) : null}
            </Form.Group>

            <div className="float-end">
              <Button
                className={styleMain.cancelBtn}
                type="button"
                onClick={() => {
                  setDeleteModal(false);
                }}
              >
                Cancel
              </Button>
              <Button variant="contained" type="submit">
                Submit
              </Button>
            </div>
          </Form>
        </div>
      </AppModal>
    </div>
  );
};

export default UserDetail;
