import "./index.css";
import { Book } from "../../models";
import { useNavigate, useLocation } from "react-router-dom";
import { formatStr } from "../../utils";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { cartActions } from "../../store/cartSlice";
import { useState } from "react";
import { FaStar } from "react-icons/fa";

const BookCard = (props: { book: Book }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const location = useLocation();

  let path = `/product/${props.book.id}/${props.book.name
    .split(" ")
    .join("-")
    .toLowerCase()}`;
  const handleProductClick = () => {
    navigate(path);
  };
  const handleAddToCart = () => {
    if (!isLoggedIn) {
      return navigate("/login", {
        replace: true,
        state: { from: location },
      });
    }
    console.log("here");
    dispatch(
      cartActions.addToCart({
        id: props.book.id,
        stopSelling: false,
        quantity: 1,
      })
    );
  };
  return (
    <div className="CardFrame">
      <div id="CardImg">
        <img
          src={props.book.image}
          width={"100%"}
          height={200}
          alt="error"
          onClick={handleProductClick}
        />
      </div>
      <div id="CardInfor">
        <div id="AddContainer">
          <div id="QuickAdd" onClick={handleAddToCart}>
            Quick Add
          </div>
        </div>
        <div id="CardText">
          <h3 id="CardName" onClick={handleProductClick}>
            {formatStr(props.book.name, 18)}
          </h3>
          <span>
            by{" "}
            <span style={{ color: "#008b8b" }}>
              {formatStr(props.book.author, 15)}
            </span>
          </span>
          <div style={{ color: "grey" }}>
            {props.book.rating}{" "}
            <sup>
              <FaStar size={16} style={{ color: "#dcd13a" }} />
            </sup>
            <span className="mx-2">Sold: {props.book.quantitySold}</span>
          </div>
          <div
            style={{ fontSize: "20", color: "#008b8b" }}
          >{`${props.book.sellingPrice}$`}</div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
