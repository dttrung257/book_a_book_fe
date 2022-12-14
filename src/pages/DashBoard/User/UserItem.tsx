import React, { useState } from "react";
import { SlSettings } from "react-icons/sl";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import { FcCheckmark } from "react-icons/fc";
import style from "./User.module.css";
import { UserDetailInfo } from "../../../models";
import { Link } from "react-router-dom";
import AppModal from "../../../components/AppModal/AppModal";
import { isAxiosError } from "../../../apis/axiosInstance";
import { useAppSelector } from "../../../store/hook";
import { changeUserStatus } from "../../../apis/manage";

const UserItem = ({ user: userInfo }: { user: UserDetailInfo }) => {
  const [locked, setLocked] = useState<boolean>(userInfo.locked);
  const [activated, setActivated] = useState<boolean>(userInfo.emailVerified);
  const [modal, setModal] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<string>("");
  const [modalType, setModalType] = useState<"LOCK" | "ACTIVATE">("LOCK");
  const [errMessage, setErrMessage] = useState<string>("");
  const { accessToken } = useAppSelector((state) => state.auth);

  const closeModal = (show: boolean) => {
    setModal(show);
    setErrMessage("");
  };

  const toggleLockUser = async () => {
    if (userInfo.authority === "ADMIN") {
      return toast.error("Can not change this user status!");
    }

    try {
      setErrMessage("");

      const data = await changeUserStatus(
        userInfo.id,
        {
          status: "locked",
          state: !locked,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setLocked(!locked);
      closeModal(false);
      toast.success(data);
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

  const activateUser = async () => {
    try {
      if (userInfo.emailVerified === true) {
        return toast.error("This user has been activated!");
      }

      const data = await changeUserStatus(
        userInfo.id,
        {
          status: "activated",
          state: true,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setActivated(!activated);
      closeModal(false);
      toast.success(data);
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

  const showToggleLockUserModal = () => {
    setModalContent(
      `${userInfo.locked ? "Unlock" : "Lock"} user ${userInfo.id} ?`
    );
    setModalType("LOCK");
    setModal(true);
  };

  const showActivateUserModal = () => {
    setModalContent(`Active user ${userInfo.id} ?`);
    setModalType("ACTIVATE");
    setModal(true);
  };

  return (
    <>
      <tr>
        <td>
          <span>{userInfo.id}</span>
        </td>
        <td>{userInfo.firstName + " " + userInfo.lastName}</td>
        <td>{userInfo.gender}</td>
        <td>{userInfo.email}</td>
        <td>{userInfo.phoneNumber || "Not updated"}</td>
        <td>{userInfo.authority}</td>
        <td>{activated && <FcCheckmark />}</td>
        <td>{locked && "Locked"}</td>
        <td className={style.iconSetting}>
          <SlSettings />
          <div className={style.action}>
            <div>
              <Link to={`/dashboard/users/${userInfo.id}`}>Details</Link>
            </div>
            {userInfo.authority !== "ADMIN" && (
              <>
                <div className={style.divider}></div>
                <div onClick={showToggleLockUserModal}>
                  {locked ? "Unlock" : "Lock"}
                </div>
                <div className={style.divider}></div>
                <div onClick={showActivateUserModal}>Activate</div>
              </>
            )}
          </div>
          <div>
            <AppModal
              title={"Confirmation"}
              showModal={modal}
              setShowModal={closeModal}
            >
              <p>{modalContent}</p>
              <div style={{ color: "red" }}>{errMessage}</div>
              <div
                className={`${style.lockModal} d-flex justify-content-end mt-3`}
              >
                <Button
                  className={style.cancelBtn}
                  onClick={() => closeModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  className={`${style.toggleLockBtn}`}
                  onClick={() =>
                    modalType === "LOCK" ? toggleLockUser() : activateUser()
                  }
                >
                  Confirm
                </Button>
              </div>
            </AppModal>
          </div>
        </td>
      </tr>
    </>
  );
};

export default UserItem;
