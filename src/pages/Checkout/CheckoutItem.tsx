import React from "react";
import style from "./Checkout.module.css";
import { Book } from "../../models";

interface Props {
  book: Book;
  quantity: number;
}

const CheckoutItem = ({ book, quantity }: Props) => {
  return (
    <div>
      <div className="d-flex p-1 m-2">
        <div className={style.imageContainer}>
          <img className={style.image} src={book.image} alt="img" />
        </div>
        <div className="ms-3 flex-grow-1">
          <div className="d-flex">
            <div className="me-2 flex-grow-1">
              <div>{book.name} this is just a test</div>
              <div>
                <div>
                  {book.author} - {book.category}
                </div>
                <div>Quantity: {quantity}</div>
              </div>
            </div>
            <div className="d-flex justify-content-end">
              <h6>{(quantity * book.sellingPrice).toFixed(2)}$</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutItem;
