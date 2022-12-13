import style from "./Purchase.module.css";
import { FaShoppingBag } from "react-icons/fa";
import { useAppSelector } from "../../store/hook";
import { Navigate } from "react-router-dom";
import OrderList from "./OrderList";

const Purchase = () => {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  return (
    <div className={style.wrapper}>
      <div className={style.purchaseContainer}>
        <div id={style.panel}>
          <div id={style.purchaseLogo}>
            <div style={{ display: "block" }}>
              <div className={style.left}>
                Personal <FaShoppingBag />
              </div>
              <div className={style.right}>Order</div>
            </div>
          </div>
        </div>
        <OrderList />
      </div>
    </div>
  );
};
export default Purchase;
