import styled from "styled-components";
import style from "./Purchase.module.css";
import { FaShoppingBag } from "react-icons/fa";
import { useAppSelector } from "../../store/hook";
import { Navigate } from "react-router-dom";
import OrderList from "./OrderList";
const Wrapper = styled.div`
  background-color: #ffffff;
  position: relative;
  overflow: auto;
  min-height: 80vh;
  height: fit-content;
  display: flex;
  background-color: rgba(200, 200, 200, 0.5);
  justify-content: center;
`;

const Purchase = () => {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  return (
    <Wrapper>
      <div className={style.purchaseContainer}>
        <div id={style.panel}>
          <div id={style.purchaseLogo}>
            <div style={{ display: "block" }}>
              <div className={style.left}>
                Personal <FaShoppingBag />
              </div>
              <div className={style.right}>Purchase</div>
            </div>
          </div>
        </div>
        <OrderList />
      </div>
    </Wrapper>
  );
};
export default Purchase;
