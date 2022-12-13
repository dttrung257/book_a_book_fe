import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../store/hook";
import style from "./Account.module.css";
import AlertSuccess from "../../components/AlertSuccess/AlertSuccess";
import { ImProfile } from "react-icons/im";
import { RiEdit2Fill } from "react-icons/ri";
import MyProfile from "./MyProfile";
import ChangePassword from "./ChangePassword";

const Account = () => {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [navActive, setNavActive] = useState<boolean>(true);

  if (!isLoggedIn) return <Navigate to="/login" />;

  return (
    <div id={`${style.accountPage}`}>
      {isSending ? (
        <AlertSuccess
          setIsSending={() => setIsSending(false)}
          content="Profile updated"
        />
      ) : (
        <></>
      )}
      <div id={`${style.containerNo1}`}>
        <div id={`${style.containerNo2}`}>
          <div id={`${style.containerNo3}`}>
            <br />
            <h4>BookaBook</h4>
            <h4>account</h4>
            <br />
            <div
              className={
                navActive ? `${style.titleActive}` : `${style.titleNormal}`
              }
              onClick={() => setNavActive(true)}
            >
              <ImProfile color={navActive ? "#fff" : "#666"} fontSize={24} />
              <span>My profile</span>
            </div>
            <br />
            <div
              className={
                navActive ? `${style.titleNormal}` : `${style.titleActive}`
              }
              onClick={() => setNavActive(false)}
            >
              <RiEdit2Fill color={navActive ? "#666" : "#fff"} fontSize={24} />
              <span>Change password</span>
            </div>
          </div>
          <div
            id={`${style.containerNo4}`}
            style={navActive ? { display: "block" } : { display: "none" }}
          >
            <h4>My profile</h4>
            <hr
              style={{ height: "3px", borderWidth: 0, backgroundColor: "#666" }}
            />
            <MyProfile setIsSending={() => setIsSending(true)} />
          </div>
          <div
            id={`${style.containerNo4}`}
            style={!navActive ? { display: "block" } : { display: "none" }}
          >
            <h4>Change password</h4>
            <hr
              style={{ height: "3px", borderWidth: 0, backgroundColor: "#666" }}
            />
            <ChangePassword setIsSending={() => setIsSending(true)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
