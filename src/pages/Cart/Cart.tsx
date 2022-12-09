import React, { useEffect, useState } from "react";
import { HiOutlineTrash } from "react-icons/hi";
import { toast } from "react-toastify";
import { Button } from "@mui/material";
import axios, { isAxiosError } from "../../apis/axiosInstance";
import { Book } from "../../models";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import style from "./Cart.module.css";
import CartItem from "./CartItem";
import { useNavigate } from "react-router-dom";
import { cartActions } from "../../store/cartSlice";
import AppModal from "../../components/AppModal/AppModal";

interface BookCart {
  book: Book;
  quantity: number;
  checked: boolean;
}

const Cart = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, totalQuantity } = useAppSelector((state) => state.cart);
  const [booksInfo, setBooksInfo] = useState<BookCart[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [checkedAll, setCheckedAll] = useState<boolean>(false);
  const [checkedQuantity, setCheckedQuantity] = useState<number>(0);
  const [noItemModal, setNoItemModal] = useState<boolean>(false);

  const calculateTotalPrice = () => {
    return booksInfo.reduce((total, item) => {
      console.log(item.quantity);
      return item.checked
        ? total + item.book.sellingPrice * item.quantity
        : total;
    }, 0);
  };

  useEffect(() => {
    const getBook = async () => {
      try {
        const response = await axios.get(
          `/books/cart?ids=${items.map((item) => item.id).toString()}`
        );

        const books = response.data as Book[];
        const newBooksInfo = books.map((book) => ({
          book,
          quantity: items.find((item) => item.id === book.id)
            ?.quantity as number,
          checked: false,
        }));
        setBooksInfo(newBooksInfo);
        console.log("async:", newBooksInfo);
      } catch (error) {
        if (isAxiosError(error)) {
          console.log(error);
          toast.error(error.response?.data.message);
        }
      }
    };

    getBook();
  }, []);

  useEffect(() => {
    let check = true;
    let checkedAmount = 0;
    for (let i = 0; i < booksInfo.length; i++) {
      if (booksInfo[i].book.availableQuantity !== 0) {
        if (!booksInfo[i].checked) {
          check = false;
        } else checkedAmount++;
      }
    }
    setCheckedAll(check);
    setCheckedQuantity(checkedAmount);
    setTotalPrice(calculateTotalPrice());
    return () => {};
  }, [booksInfo]);

  const handleCheckAll = () => {
    setCheckedAll(!checkedAll);
    setBooksInfo(
      booksInfo.map((bookInfo) => ({
        ...bookInfo,
        checked: bookInfo.book.availableQuantity !== 0 ? !checkedAll : false,
      }))
    );
  };

  const handleDeleteChecked = () => {
    setBooksInfo(booksInfo.filter((bookInfo) => !bookInfo.checked));
    dispatch(
      cartActions.removeCartItems({
        ids: booksInfo
          .filter((bookInfo) => bookInfo.checked)
          .map((bookInfo) => bookInfo.book.id),
      })
    );
  };

  const handleCheckout = () => {
    console.log(booksInfo);
    if (checkedQuantity === 0) setNoItemModal(true);
    else
      navigate("/checkout", {
        state: {
          items: booksInfo.filter((bookInfo) => bookInfo.checked),
          totalQuantity: checkedQuantity,
          totalPrice: totalPrice.toFixed(2),
        },
      });
  };

  return (
    <div id={style.container}>
      {booksInfo.length !== 0 ? (
        <div id={style.content}>
          <div id={style.left}>
            <div className={`${style.row} ${style.box} px-0 fw-semibold`}>
              <div>
                <input
                  className="form-check-input"
                  type="checkbox"
                  name=""
                  id=""
                  checked={checkedAll}
                  onChange={handleCheckAll}
                />
              </div>
              <div>
                Product (
                {totalQuantity -
                  booksInfo.filter(
                    (bookInfo) => bookInfo.book.availableQuantity === 0
                  ).length}
                )
              </div>
              <div>Price each</div>
              <div>Quantity</div>
              <div>Total price</div>
              <div>
                <HiOutlineTrash
                  className={`${style.trashIcon}`}
                  onClick={handleDeleteChecked}
                />
              </div>
            </div>
            <div className={`mt-2`}>
              {booksInfo.map((bookInfo) => (
                <CartItem
                  key={bookInfo.book.id}
                  book={bookInfo.book}
                  quantity={bookInfo.quantity}
                  checked={bookInfo.checked}
                  booksInfo={booksInfo}
                  setBooksInfo={setBooksInfo}
                />
              ))}
            </div>
          </div>
          <div id={style.right}>
            <div className={`${style.sticky}`}>
              <div className={`${style.box}`}>
                <div className="d-flex justify-content-between flex-row">
                  <p>Total</p>
                  <h5>{totalPrice.toFixed(2)}$</h5>
                </div>
                <Button
                  variant="contained"
                  className={`${style.checkoutBtn}`}
                  onClick={handleCheckout}
                >
                  Check out ({checkedQuantity})
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div id={style.content} className="flex-column align-items-center">
          <div
            className="d-flex flex-column align-items-center bg-white pb-4 rounded"
            style={{ width: "100%" }}
          >
            <img
              src="/images/empty_cart.jpg"
              alt="empty"
              style={{ width: "40%" }}
            />
            <span className="mb-4 text-muted">Your shopping cart is empty</span>
            <Button variant="contained" onClick={() => navigate("/")}>
              Go shopping now
            </Button>
          </div>
        </div>
      )}
      <AppModal
        title=" "
        showModal={noItemModal}
        setShowModal={setNoItemModal}
        closeBtn={false}
      >
        <h5>You have not selected any items for checkout</h5>
        <div className="float-end mt-4">
          <Button variant="contained" onClick={() => setNoItemModal(false)}>
            OK
          </Button>
        </div>
      </AppModal>
    </div>
  );
};

export default Cart;
