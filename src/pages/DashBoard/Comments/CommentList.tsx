import { useCallback, useEffect, useState } from "react";
import axios, { isAxiosError } from "../../../apis/axiosInstance";
import { toast } from "react-toastify";
import { Table, Form } from "react-bootstrap";
import style from "../MainLayout.module.css";
import { CommentDetail } from "../../../models";
import { useAppSelector } from "../../../store/hook";
import { Button, Pagination } from "@mui/material";
import { FaFilter } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import AppModal from "../../../components/AppModal/AppModal";
import moment from "moment";
import CommentItem from "./CommentItem";

interface SearchInfo {
  bookID?: string;
  bookName?: string;
  date?: string;
  userName?: string;
}

const CommentList = () => {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [commentsList, setCommentsList] = useState<CommentDetail[]>([]);
  const [showSearchModal, setShowSearchModal] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInfo, setSearchInfo] = useState<SearchInfo>({});
  const [message, setMessage] = useState<string>("");
  const [totalpage, setTotalPages] = useState<number>(0);
  const [checkDeleteComment, setCheckDeleteComment] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(
    parseInt(searchParams.get("page") || "0")
  );

  const getCommentsList = useCallback(
    async (filter: SearchInfo, page: number | string = 0) => {
      const response = await axios.get(
        `/manage/comments?page=${page}&book_id=${filter.bookID}&book_name=${filter.bookName}&date=${filter.date}&fullname=${filter.userName}`,
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
    const bookID = searchParams.get("bookID") || "";
    const bookName = searchParams.get("bookName") || "";
    const date = searchParams.get("date") || "";
    const userName = searchParams.get("userName") || "";
    const page = searchParams.get("page") || "0";

    getCommentsList({ bookID, bookName, date, userName }, page)
      .then((data) => {
        console.log(data);
        setCommentsList(data.content);
        setTotalPages(data.totalPages);
      })
      .catch((error) => {
        if (isAxiosError(error)) {
          const data = error.response?.data;
          toast.error(data?.message);
        } else {
          toast.error("Unknow error!!!");
          console.log(error);
        }
      });
    window.scrollTo(0, 0);

    return () => {};
  }, [getCommentsList, searchParams, checkDeleteComment]);

  const onSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (Object.keys(searchInfo).length === 0)
      return setMessage("Please enter something to search");
    setMessage("");

    if (searchInfo.bookID) {
      searchParams.set("bookID", searchInfo.bookID.toString());
    } else {
      searchParams.delete("bookID");
    }
    if (searchInfo.bookName) {
      searchParams.set(
        "bookName",
        searchInfo.bookName.replace(/\s+/g, " ").trim()
      );
    } else {
      searchParams.delete("bookName");
    }
    if (searchInfo.userName) {
      searchParams.set(
        "userName",
        searchInfo.userName.replace(/\s+/g, " ").trim()
      );
    } else {
      searchParams.delete("userName");
    }
    if (searchInfo.date) {
      searchParams.set("date", moment(searchInfo.date).format("DD-MM-YYYY"));
    } else {
      searchParams.delete("date");
    }
    searchParams.set("page", "0");
    setSearchParams(searchParams);
    setCurrentPage(0);
    setSearchInfo({});
    setShowSearchModal(false);
  };

  const handleChangePage = async (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value - 1);
    searchParams.set("page", (value - 1).toString());
    setSearchParams(searchParams);
  };

  return (
    <>
      <div className={`${style.header} mb-2`}>
        <h2> Comments list</h2>
      </div>
      <div className={`${style.content}`}>
        <div className="d-flex justify-content-between align-items-center">
          <h4>Result for {searchParams.get("bookName") || "all comments"}</h4>
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
                <th>Content</th>
                <th>Star</th>
                <th>Book</th>
                <th>User</th>
                <th>Created At</th>
                <th></th>
              </tr>
            </thead>
            <tbody className={`${style.tableBody}`}>
              {commentsList.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  setCheckDeleteComment={setCheckDeleteComment}
                />
              ))}
            </tbody>
          </Table>
        </div>

        <Pagination
          count={totalpage}
          page={currentPage + 1}
          showFirstButton
          showLastButton
          color="primary"
          style={{
            maxHeight: "25px",
            width: "75vw",
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
        title={"Search for comments "}
      >
        <div>
          <form className={style.searchForm} onSubmit={onSearchSubmit}>
            <div>
              <label htmlFor="bookIDInput">Book ID</label>
              <input
                id="bookIDInput"
                name="bookIDInput"
                type="number"
                min="1"
                value={searchInfo.bookID || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchInfo({
                    ...searchInfo,
                    bookID: e.target.value,
                  })
                }
              />
              <label htmlFor="bookNameInput">Book Name</label>
              <input
                id="bookNameInput"
                name="bookNameInput"
                type="text"
                value={searchInfo.bookName || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchInfo({
                    ...searchInfo,
                    bookName: e.target.value,
                  })
                }
              />
              <label htmlFor="userNameInput">User Name</label>
              <input
                id="userNameInput"
                name="userNameInput"
                type="text"
                value={searchInfo.userName || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchInfo({
                    ...searchInfo,
                    userName: e.target.value,
                  })
                }
              />
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
    </>
  );
};

export default CommentList;
