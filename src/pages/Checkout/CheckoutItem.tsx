import React from "react";
import style from "./Checkout.module.css";
import { Book } from "../../models";
import { Badge } from "react-bootstrap";

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
          <Badge bg="secondary" className={style.quantity}>
            {quantity}
          </Badge>
        </div>
        <div className="ms-2 flex-grow-1">
          <div>
            <span>{book.name}</span>
          </div>
          <div className="d-flex justify-content-end">
            <span>{quantity * book.sellingPrice}$</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutItem;
