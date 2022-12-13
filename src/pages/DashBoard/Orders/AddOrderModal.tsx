import { useState } from "react";
import AppModal from "../../../components/AppModal/AppModal";
import Table from "react-bootstrap/Table";
import { RiDeleteBinLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../store/hook";
import { isAxiosError } from "../../../apis/axiosInstance";
import { Form, Button } from "react-bootstrap";
import style from "./Orders.module.css";
import { addOrder, getBook } from "../../../apis/manage";
interface BookOrder {
  id: number;
  image: string;
  name: string;
  sellingPrice: number;
  availableQuantity: number;
  quantity: number;
}

const AddOrderModal = (prop: {
  showModal: boolean;
  setShowModal: (show: boolean) => void | React.Dispatch<boolean>;
}) => {
  //const [orderInfo, setOrderInfo] = useState<BookOrder[]>([]);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [bookList, setBookList] = useState<BookOrder[]>([]);
  const [bookAddID, setBookAddID] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();

  const handleAddBtn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    if (!bookAddID) {
      setErrorMessage("Please enter book ID");
      return;
    } else if (bookList.find(({ id }) => id.toString() === bookAddID)) {
      setErrorMessage(`Book ID #${bookAddID} is already in order`);
      return;
    }
    try {
      const data = await getBook(bookAddID);
      if (data.availableQuantity < 1) {
        setErrorMessage(`Book ID #${bookAddID} is out of stock`);
        return;
      }

      if (data.stopSelling) {
        setErrorMessage(`Book ID #${bookAddID} status is stop selling`);
        return;
      }
      setBookList([
        ...bookList,
        {
          ...data,
          quantity: 1,
        },
      ]);
      setBookAddID("");
    } catch (error) {
      if (isAxiosError(error)) {
        const data = error.response?.data;
        console.log(data?.message);
        setErrorMessage(data?.message);
      } else {
        console.log("Unknown");
      }
    }
  };

  const handleBookAmount = (id: number, newAmount: number) => {
    setBookList(
      bookList.map((book) => {
        if (book.id === id) {
          return {
            ...book,
            quantity: newAmount,
          };
        }
        return book;
      })
    );
  };

  const handleChangeQuantity = (
    e: React.ChangeEvent<HTMLInputElement>,
    bookID: number
  ) => {
    if (e.target.value === "") {
      handleBookAmount(bookID, 0);
      return;
    }
    let newAmount = e.target.valueAsNumber;
    let book = bookList.find(({ id }) => id === bookID);
    if (book && newAmount > book.availableQuantity) {
      toast.warning(
        `"${book.name}" now has only ${book.availableQuantity} left in stock`
      );
      newAmount = book.availableQuantity;
    } else if (newAmount < 1) newAmount = 1;
    handleBookAmount(bookID, newAmount);
  };

  const handleDeleteBtn = (bookID: number) => {
    setBookList(bookList.filter((book) => book.id !== bookID));
  };

  const onAddOrder = async () => {
    setErrorMessage("");
    if (bookList.length < 1) {
      setErrorMessage("No book in order");
      return;
    }

    let bookErr = bookList.find(({ quantity }) => quantity === 0);

    if (bookErr) {
      setErrorMessage(`Please enter quantity of book ID #${bookErr.id}`);
      return;
    }
    try {
      const data = await addOrder(
        bookList.map((item) => {
          return {
            bookId: item.id,
            quantity: item.quantity,
          };
        }),
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success("Order has been added successfully");
      closeModal();
      navigate(`/dashboard/orders/${data.id}`);
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

  const closeModal = () => {
    setErrorMessage("");
    setBookAddID("");
    setBookList([]);
  };

  return (
    <div style={{ overflowY: "initial" }}>
      <AppModal
        title="Add new order"
        showModal={prop.showModal}
        setShowModal={(showModal) => {
          prop.setShowModal(showModal);
          closeModal();
        }}
      >
        <div className={`${style.addOrderForm}`}>
          <Form onSubmit={handleAddBtn}>
            {/* <Form.Label>Book ID</Form.Label> */}
            <div className="d-flex justify-content-between mt-3">
              <Form.Control
                type="number"
                placeholder="Enter Book ID"
                value={bookAddID}
                min="1"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setBookAddID(e.target.value)
                }
                className={style.inputForm}
              />

              <Button
                variant="primary"
                type="submit"
                size="sm"
                className={style.submitBtn}
              >
                ADD
              </Button>
            </div>
            {errorMessage ? (
              <Form.Text className="text-danger">{errorMessage}</Form.Text>
            ) : null}
          </Form>
          <Table className={style.orderTable}>
            <thead>
              <tr>
                {/* <th style={{ width: "5%" }}>No.</th>
                <th style={{ width: "5%" }}>ID</th>
                <th style={{ width: "55%" }}>Product</th>
                <th style={{ width: "15%" }}>Price</th>
                <th style={{ width: "10%" }}>Quantity</th>
                <th style={{ width: "15%" }}>Subtotal</th>
                <th style={{ width: "3%" }}></th> */}
                <th>No.</th>
                <th>ID</th>
                <th style={{ width: "5%" }}></th>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {bookList.map((book, index) => (
                <tr key={book.id}>
                  <td className={style.index}>{index + 1}</td>
                  <td className={style.ID}>{book.id}</td>
                  <td>
                    <img
                      src={book.image}
                      alt="bookimg"
                      style={{ height: "60px", maxWidth: "60px" }}
                    />
                  </td>
                  <td className={style.bookInfo}>{book.name}</td>

                  <td className={style.price}>${book.sellingPrice}</td>
                  <td className={style.quantity}>
                    <input
                      type="number"
                      value={book.quantity ? book.quantity : ""}
                      onChange={(e) => handleChangeQuantity(e, book.id)}
                    />
                  </td>
                  <td className={style.subtotal}>
                    ${(book.sellingPrice * book.quantity).toFixed(2)}
                  </td>
                  <td className={style.deleteBtn}>
                    <RiDeleteBinLine
                      onClick={() => handleDeleteBtn(book.id)}
                      style={{ cursor: "pointer" }}
                      size={20}
                    />
                  </td>
                </tr>
              ))}
              <tr className="fs-5 lh-lg">
                <td
                  colSpan={6}
                  className="fw-bold text-start"
                  style={{ width: "90%" }}
                >
                  Total
                </td>
                <td>
                  $
                  {bookList
                    .reduce(
                      (accumulator, current) =>
                        accumulator + current.sellingPrice * current.quantity,
                      0
                    )
                    .toFixed(2)}
                </td>
                <td></td>
              </tr>
            </tbody>
          </Table>
          <div className="d-flex justify-content-end">
            <Button
              className={style.cancelBtn}
              type="button"
              onClick={() => {
                prop.setShowModal(false);
                closeModal();
              }}
            >
              CANCEL
            </Button>
            <Button
              type="submit"
              style={{
                backgroundColor: "var(--primary-color)",
                color: "white",
              }}
              className={`${style.index} float-end`}
              onClick={onAddOrder}
            >
              SUBMIT
            </Button>
          </div>
        </div>
      </AppModal>
    </div>
  );
};

export default AddOrderModal;
