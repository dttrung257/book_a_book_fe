import { useEffect, useState } from "react";
import { Rating } from "@mui/material";
import { toast } from "react-toastify";
import { isAxiosError } from "../../../apis/axiosInstance";
import { Table, Form } from "react-bootstrap";
import style from "../MainLayout.module.css";
import BookItem from "./BookItem";
import { Book } from "../../../models";
import { Button } from "@mui/material";
import { FaFilter } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import AppModal from "../../../components/AppModal/AppModal";

import Pagination from "@mui/material/Pagination";
import AddBookModal from "./AddBookModal";
import { FilterBookDashboard } from "../../../models/Filter";
import { getBooksList } from "../../../apis/manage";

const Books = () => {
  const [booksList, setBooksList] = useState<Book[]>([]);
  const [showSearchModal, setShowSearchModal] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInfo, setSearchInfo] = useState<FilterBookDashboard>({});
  const [message, setMessage] = useState<string>("");
  const [totalpage, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(
    parseInt(searchParams.get("page") || "0")
  );

  useEffect(() => {
    const name = searchParams.get("name") || "";
    const category = searchParams.get("category") || "";
    const priceFrom = searchParams.get("from") || "";
    const priceTo = searchParams.get("to") || "";
    const rating = searchParams.get("rating") || "";
    const pageParam = searchParams.get("page") || "0";
    let page = 0;
    if (!isNaN(Number(pageParam))) page = Number(pageParam);
    getBooksList({ name, category, priceFrom, priceTo, rating }, page)
      .then((data) => {
        setCurrentPage(page);
        setBooksList(data.content);
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
  }, [searchParams]);

  const onSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (Object.keys(searchInfo).length === 0 || searchInfo.category === "")
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
    if (searchInfo.category) {
      searchParams.set("category", searchInfo.category);
    } else {
      searchParams.delete("category");
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
    if (searchInfo.rating) {
      searchParams.set("rating", searchInfo.rating.toString());
    } else {
      searchParams.delete("rating");
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
        <h2> Books list</h2>
        <Button
          variant="contained"
          onClick={() => {
            setShowAddModal(true);
            console.log("add");
          }}
        >
          Add Book
        </Button>
      </div>
      <div
        className={`${style.content} d-flex flex-column justify-content-between`}
      >
        <div>
          <div className="d-flex justify-content-between align-items-center">
            <h4>Result for {searchParams.get("books") || "all books"}</h4>
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
                  <th></th>
                  <th>Name</th>
                  {/* <th>Category</th> */}
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Sold</th>
                  <th style={{ width: "10%" }}>Ratings</th>
                  <th style={{ width: "11%" }}>Keep Selling</th>
                  <th></th>
                </tr>
              </thead>
              <tbody className={`${style.tableBody}`}>
                {booksList.map((book) => (
                  <BookItem key={book.id} book={book} />
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
          className="pagination"
          color="primary"
          style={{
            marginLeft: "auto",
            marginRight: "auto",
            height: "auto",
            marginTop: "auto",
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
        title={"Search for books "}
      >
        <div>
          <form className={style.searchForm} onSubmit={onSearchSubmit}>
            <div>
              <label htmlFor="nameInput">Name</label>
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
              <label htmlFor="categoryInput">Category</label>
              <Form.Select
                id="categoryInput"
                value={searchInfo.category || ""}
                onChange={(e) => {
                  setSearchInfo({
                    ...searchInfo,
                    category: e.target.value,
                  });
                }}
              >
                <option value="">Choose category</option>
                <option value="TECHNOLOGY">TECHNOLOGY</option>
                <option value="SCIENCE">SCIENCE</option>
                <option value="COMIC">COMIC</option>
                <option value="DETECTIVE">DETECTIVE</option>
                <option value="LITERARY">LITERARY</option>
                <option value="LIFESTYLE">LIFESTYLE</option>
                <option value="ROMANCE">ROMANCE</option>
                <option value="EDUCATION">EDUCATION</option>
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
              <div style={{ alignItems: "center", display: "flex" }}>
                <label htmlFor="ratingInput">Ratings&nbsp;</label>

                <Rating
                  name="ratingInput"
                  value={parseInt(searchInfo.rating || "0")}
                  onChange={(event, newValue) => {
                    setSearchInfo({
                      ...searchInfo,
                      rating: newValue?.toString(),
                    });
                  }}
                />
              </div>

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
      <AddBookModal showModal={showAddModal} setShowModal={setShowAddModal} />
    </>
  );
};

export default Books;
