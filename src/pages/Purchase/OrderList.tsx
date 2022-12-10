import Pagination from "@mui/material/Pagination";
import axios from "../../apis/axiosInstance";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PersonalOrder } from "../../models";
import { useAppSelector } from "../../store/hook";
import OrderItem from "./OrderItem";

const convertNumber = (value: any) => {
  if (value === null) {
    return -0.1;
  } else return parseInt(value);
};
const OrderList = () => {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [orderList, setOrderList] = useState<PersonalOrder[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [searchParams, setSearchParams] = useSearchParams();

  const handleChangePage = async (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    searchParams.set("page", (value - 1).toString());
    setSearchParams(searchParams);
  };

  const getPersonalOrdersList = useCallback(
    async (page: number | string) => {
      const response = await axios.get(`orders?page=${page}&size=5`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    },
    [accessToken]
  );

  useEffect(() => {
    const page = searchParams.get("page") || "0";
    getPersonalOrdersList(page)
      .then((data) => {
        console.log(data);
        setOrderList(data.content);
        setTotalPages(data.totalPages);
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
    if (convertNumber(page) >= totalPages) {
      searchParams.set("page", "0");
      setSearchParams(searchParams);
    }
    return () => {};
  }, [getPersonalOrdersList, searchParams]);
  return (
    <>
      <div className="orderContainer">
        {orderList.map((order) => (
          <OrderItem key={order.id} order={order} />
        ))}
        {orderList.length === 0 ? (
          <div className="flex-column align-items-center">
            <div
              className="d-flex flex-column align-items-center bg-white pb-4 rounded"
              style={{ width: "100%" }}
            >
              <img
                src="/images/empty_cart.jpg"
                alt="empty"
                style={{ width: "40%" }}
              />
              <span className="mb-4 text-muted">
                Your order is empty. You may delete all the information.
              </span>
            </div>
          </div>
        ) : (
          <></>
        )}
        <Pagination
          count={totalPages}
          page={convertNumber(searchParams.get("page") || "0") + 1}
          showFirstButton
          showLastButton
          color="primary"
          style={{
            maxHeight: "25px",
            width: "100%",
            // marginLeft: "auto",
            // marginRight: "auto",
            // height: "auto",
            // marginTop: "auto",
            marginTop: "50px",
            marginBottom: "20px",
            alignSelf: "flex-end",
          }}
          onChange={handleChangePage}
          className={totalPages <= 1 ? "pageNull" : ""}
        />
      </div>
    </>
  );
};
export default OrderList;
