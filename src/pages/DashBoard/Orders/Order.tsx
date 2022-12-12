import { useCallback, useEffect, useState } from "react";
import axios, { isAxiosError } from "../../../apis/axiosInstance";
import { toast } from "react-toastify";
import { Table, Form } from "react-bootstrap";
import style from "../MainLayout.module.css";
import OrderItem from "./OrderItem";
import { useAppSelector } from "../../../store/hook";
import { OrderInfo } from "../../../models";
import { Button, Pagination } from "@mui/material";
import { FaFilter } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import AppModal from "../../../components/AppModal/AppModal";
import moment from "moment";
import AddOrderModal from "./AddOrderModal";

interface SearchInfo {
  name?: string;
  status?: string;
  priceFrom?: number | string;
  priceTo?: number | string;
  date?: string;
}

const Order = () => {
  //   const navigate = useNavigate();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [ordersList, setOrdersList] = useState<OrderInfo[]>([]);
  const [showSearchModal, setShowSearchModal] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInfo, setSearchInfo] = useState<SearchInfo>({});
  const [message, setMessage] = useState<string>("");
  const [totalpage, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(
    parseInt(searchParams.get("page") || "0")
  );

  const getOrdersList = useCallback(
    async (filter: SearchInfo, page: number | string = 0) => {
      const response = await axios.get(
        `/manage/orders/?page=${page}&name=${filter.name}&from=${filter.priceFrom}&to=${filter.priceTo}&date=${filter.date}&status=${filter.status}`,
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

  useEffect(() => {
    const name = searchParams.get("name") || "";
    const status = searchParams.get("status") || "";
    const priceFrom = searchParams.get("from") || "";
    const priceTo = searchParams.get("to") || "";
    const date = searchParams.get("date") || "";
    const pageParam = searchParams.get("page") || "0";
    let page = 0;
    if (!isNaN(Number(pageParam))) page = Number(pageParam);
    getOrdersList({ name, status, priceFrom, priceTo, date }, page)
      .then((data) => {
        // console.log(data);
        setCurrentPage(page);
        setOrdersList(data.content);
        setTotalPages(data.totalPages);
      })
      .catch((error) => {
        if (isAxiosError(error)) {
          const data = error.response?.data;
          toast.error(data?.message);
        } else {
          toast.error("Unknow error!!!");
        }
      });
    window.scrollTo(0, 0);

    return () => {};
  }, [getOrdersList, searchParams]);

  const onSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (Object.keys(searchInfo).length === 0 || searchInfo.status === "")
      return setMessage("Please enter something to search");
    setMessage("");
    if (
      (searchInfo.priceFrom && searchInfo.priceFrom < 0) ||
      (searchInfo.priceTo && searchInfo.priceTo <= 0)
    ) {
      return setMessage("Price must be greater than 0");
    }
    if (
      searchInfo.priceFrom &&
      searchInfo.priceTo &&
      searchInfo.priceFrom > searchInfo.priceTo
    ) {
      return setMessage("Price From must be less than Price To");
    }

    if (searchInfo.name) {
      searchParams.set("name", searchInfo.name.replace(/\s+/g, " ").trim());
    } else {
      searchParams.delete("name");
    }
    if (searchInfo.status) {
      searchParams.set("status", searchInfo.status);
    } else {
      searchParams.delete("status");
    }
    if (searchInfo.priceFrom) {
      searchParams.set("from", searchInfo.priceFrom.toString());
    } else {
      searchParams.delete("from");
    }
    if (searchInfo.priceTo) {
      searchParams.set("to", searchInfo.priceTo.toString());
    } else {
      searchParams.delete("to");
    }
    if (searchInfo.date) {
      searchParams.set("date", moment(searchInfo.date).format("DD-MM-YYYY"));
    } else {
      searchParams.delete("date");
    }
    searchParams.set("page", "0");
    setSearchParams(searchParams);
    setSearchInfo({});
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
    <>
      <div className={`${style.header} mb-2`}>
        <h2> Orders list</h2>
        <Button
          style={{ backgroundColor: "var(--primary-color)", color: "white" }}
          onClick={() => {
            setShowAddModal(true);
          }}
        >
          Add Order
        </Button>
      </div>
      <div
        className={`${style.content} d-flex flex-column justify-content-between`}
      >
        <div>
          <div className="d-flex justify-content-between align-items-center">
            <h4>Result for {searchParams.get("name") || "all orders"}</h4>
            <div
              id={style.search}
              className="px-3 py-2 d-flex justify-content-between align-items-center"
              onClick={() => setShowSearchModal(true)}
            >
              Filter
              <FaFilter color="#008b8b" />
            </div>
          </div>
          <div>
            <Table className="mt-4" hover responsive="md">
              <thead className={`${style.tableHeader}`}>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Date</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody className={`${style.tableBody}`}>
                {ordersList.map((order) => (
                  <OrderItem key={order.id} order={order} />
                ))}
              </tbody>
            </Table>
          </div>
        </div>

        <Pagination
          count={totalpage}
          page={currentPage + 1}
          showFirstButton
          showLastButton
          color="primary"
          style={{
            maxHeight: "25px",
            width: "fit-content",
            marginLeft: "auto",
            marginRight: "auto",
          }}
          onChange={handleChangePage}
        />
      </div>

      <AppModal
        showModal={showSearchModal}
        setShowModal={(showModal) => {
          setShowSearchModal(showModal);
          setMessage("");
        }}
        title={"Search for orders "}
      >
        <div>
          <form className={style.searchForm} onSubmit={onSearchSubmit}>
            <div>
              <label htmlFor="nameInput">Name or email</label>
              <input
                id="nameInput"
                name="nameInput"
                type="text"
                value={searchInfo.name || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchInfo({
                    ...searchInfo,
                    name: e.target.value,
                  })
                }
              />
              <label htmlFor="statusInput">Status</label>
              <Form.Select
                id="statusInput"
                value={searchInfo.status || ""}
                onChange={(e) => {
                  setSearchInfo({
                    ...searchInfo,
                    status: e.target.value,
                  });
                }}
              >
                <option value="">Choose status</option>
                <option value="PENDING">PENDING</option>
                <option value="SHIPPING">SHIPPING</option>
                <option value="SUCCESS">SUCCESS</option>
                <option value="CANCELED">CANCELED</option>
              </Form.Select>

              <label htmlFor="priceInput">Price</label>
              <div className="d-flex align-items-center" id="priceInput">
                <input
                  id="fromInput"
                  name="fromInput"
                  type="number"
                  placeholder="From"
                  value={searchInfo.priceFrom || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchInfo({
                      ...searchInfo,
                      priceFrom: e.target.value,
                    })
                  }
                />
                <span>&nbsp;-&nbsp;</span>
                <input
                  id="toInput"
                  name="toInput"
                  type="number"
                  placeholder="To"
                  value={searchInfo.priceTo || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchInfo({
                      ...searchInfo,
                      priceTo: e.target.value,
                    })
                  }
                />
              </div>
              <label htmlFor="dateInput">Date</label>
              <input
                id="dateInput"
                name="dateInput"
                type="date"
                value={searchInfo.date || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchInfo({
                    ...searchInfo,
                    date: e.target.value,
                  })
                }
              />
              <div style={{ color: "red" }}>{message}</div>
            </div>
            <div className="d-flex justify-content-end">
              <Button
                className={style.cancelBtn}
                type="button"
                onClick={() => {
                  setSearchInfo({});
                  setMessage("");
                  setShowSearchModal(false);
                }}
              >
                Cancel
              </Button>
              <Button className={style.searchBtn} type="submit">
                Search
              </Button>
            </div>
          </form>
        </div>
      </AppModal>
      <AddOrderModal showModal={showAddModal} setShowModal={setShowAddModal} />
    </>
  );
};

export default Order;
