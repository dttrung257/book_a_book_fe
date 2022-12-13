import { Button } from "@mui/material";
import { useAppSelector } from "../../../store/hook";
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import AppModal from "../../../components/AppModal/AppModal";
import { TiArrowBack } from "react-icons/ti";
import { isAxiosError } from "../../../apis/axiosInstance";
import { Book } from "../../../models";
import styleMain from "../MainLayout.module.css";
import style from "./Books.module.css";
import EditBookModal from "./EditBookModal";
import { deleteBook, getBook } from "../../../apis/manage";
import { toast } from "react-toastify";

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState<Book | null>(null);
  const { accessToken } = useAppSelector((state) => state.auth);
  const [editModal, setEditModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  useEffect(() => {
    const getBookInfo = async () => {
      try {
        const book = await getBook(id as string);
        setBook(book);
      } catch (error) {
        if (isAxiosError(error)) {
          const data = error.response?.data;
          //setErrMessage(data?.message);
          console.log("error: ", error);
        } else {
          //setErrMessage("Unknow error!!!");
          console.log("error: ", error);
        }
      }
    };

    getBookInfo();
    return () => {};
  }, [id, editModal]);
  const onDeleteBook = async () => {
    try {
      await deleteBook(book?.id as number, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      toast.success(`Book ${book?.name} has been deleted`);
      navigate("/dashboard/books");
    } catch (error) {
      if (isAxiosError(error)) {
        const data = error.response?.data;
        //setErrMessage(data?.message);
      } else {
        //setErrMessage("Unknow error!!!");
        console.log(error);
      }
    }
  };
  return (
    <>
      <div className={`${styleMain.header} mb-2`}>
        <div className="d-flex align-items-center">
          <TiArrowBack
            className={styleMain.goBackBtn}
            onClick={() => navigate(-1)}
            style={{ cursor: "pointer" }}
            size="30"
          />
          <h2>Book detail</h2>
        </div>
        <div>
          <Button
            style={{
              backgroundColor: "var(--primary-color)",
              color: "white",
              marginRight: "10px",
            }}
            onClick={() => {
              setEditModal(true);
              //   setMessage(null);
            }}
          >
            Edit Book
          </Button>
          <Button
            style={{ backgroundColor: "red", color: "white" }}
            onClick={() => {
              setDeleteModal(true);
              //setMessage(null);
            }}
          >
            Delete
          </Button>
        </div>
      </div>
      <div className={`${styleMain.content}`}>
        <h4 style={{ marginBottom: "20px" }}>Book ID #{book?.id}</h4>
        <div className={`${style.bookinfo} d-flex justify-content-around`}>
          <div id={`${style.bookframe}`}>
            <img src={book?.image} alt={book?.name} />
          </div>

          <div className={`${style.detail}`}>
            <h5 className="fw-bold" style={{ marginBottom: "20px" }}>
              {book?.name.toUpperCase()}
            </h5>
            <div className="d-flex">
              <div className="fw-bold title">Author: &nbsp;</div>
              <div>{book?.author}</div>
            </div>
            <div>
              <div className="fw-bold title">Description: &nbsp;</div>
              <p id={`${style.bookDescription}`}>{book?.description}</p>
            </div>
            <div className="d-flex">
              <div className="fw-bold title">Category:&nbsp;</div>
              <div>{book?.category}</div>
            </div>
            <div className="d-flex">
              <div className="fw-bold title">Ratings: &nbsp;</div>
              <div style={{ alignItems: "center", display: "flex" }}>
                <span style={{ marginRight: "5px" }}>
                  {book?.rating !== null ? book?.rating : 5}
                </span>
                <FaStar color="ffc107" />
              </div>
            </div>
            <div className="d-flex flex-row">
              <div className="d-flex flex-fill" style={{ minWidth: "350px" }}>
                <div className="fw-bold title">Selling Price: &nbsp;</div>
                <div>${book?.sellingPrice}</div>
              </div>
              <div className="d-flex flex-fill">
                <div className="fw-bold title">Buy Price: &nbsp;</div>
                <div>${book?.buyPrice}</div>
              </div>
            </div>
            <div className="d-flex flex-row">
              <div className="d-flex flex-fill" style={{ minWidth: "350px" }}>
                <div className="fw-bold title">Sold: &nbsp;</div>
                <div>{book?.quantitySold}</div>
              </div>
              <div className="d-flex flex-fill">
                <div className="fw-bold title">Available: &nbsp;</div>
                <div>{book?.quantityInStock}</div>
              </div>
            </div>
            <div className="d-flex flex-row">
              <div
                className="d-flex flex-fill flex-column"
                style={{ minWidth: "350px" }}
              >
                <div className="d-flex">
                  <div className="fw-bold title">ISBN: &nbsp;</div>
                  <div>{book?.isbn ? book?.isbn : "Unknown"}</div>
                </div>

                <div className="d-flex">
                  <div className="fw-bold title">Publisher: &nbsp;</div>
                  <div>{book?.publisher ? book?.publisher : "Unknown"}</div>
                </div>
                <div className="d-flex">
                  <div className="fw-bold title">Publication Year: &nbsp;</div>
                  <div>
                    {book?.yearOfPublication
                      ? book?.yearOfPublication
                      : "Unknown"}
                  </div>
                </div>
              </div>
              <div className="d-flex flex-fill flex-column">
                <div className="d-flex">
                  <div className="fw-bold title">Dimensions: &nbsp;</div>
                  <div>
                    {book?.width ? book?.width : "Unknown"} x{" "}
                    {book?.height ? book?.height : "Unknown"}
                  </div>
                </div>
                <div className="d-flex">
                  <div className="fw-bold title">Pages: &nbsp;</div>
                  <div>
                    {book?.numberOfPages ? book?.numberOfPages : "Unknown"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AppModal
        title="Delete "
        showModal={deleteModal}
        setShowModal={setDeleteModal}
      >
        <div className={`${styleMain.deleteModal}`}>
          <p>Delete book #{id} ?</p>

          <div className="d-flex justify-content-end">
            <Button
              className={styleMain.cancelBtn}
              type="button"
              onClick={() => setDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              className={`${styleMain.deleteBtn} float-end`}
              onClick={() => {
                onDeleteBook();
                console.log("delete");
              }}
            >
              Confirm
            </Button>
          </div>
        </div>
      </AppModal>
      {book && (
        <EditBookModal
          book={book as Book}
          showModal={editModal}
          setShowModal={setEditModal}
        />
      )}
    </>
  );
};

export default BookDetail;
