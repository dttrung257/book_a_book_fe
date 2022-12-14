import style from "./Book.module.css";
import { Book } from "../../models";
import { useNavigate, useLocation } from "react-router-dom";
import { formatStr } from "../../utils";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { cartActions } from "../../store/cartSlice";
import { FaStar } from "react-icons/fa";
import { styled, Tooltip, TooltipProps } from "@mui/material";

const LightTooltip = styled(({ ...props }: TooltipProps) => (
  <Tooltip {...props} />
))(() => ({
  [`& .MuiTooltip-tooltip`]: {
    fontSize: 12,
  },
}));
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
    <div className={style.CardFrame}>
      <div id={style.CardImg}>
        <img
          src={props.book.image}
          width={"100%"}
          height={200}
          alt="error"
          onClick={handleProductClick}
        />
      </div>
      <div id={style.CardInfor}>
        <div id={style.AddContainer}>
          <div id={style.QuickAdd} onClick={handleAddToCart}>
            Quick Add
          </div>
        </div>
        <div id={style.CardText}>
          <LightTooltip title={props.book.name}>
            <h3 id={style.CardName} onClick={handleProductClick}>
              {formatStr(props.book.name, 18)}
            </h3>
          </LightTooltip>

          <span>
            by{" "}
            <LightTooltip title={props.book.author}>
              <span style={{ color: "#008b8b" }}>
                {formatStr(props.book.author, 15)}
              </span>
            </LightTooltip>
          </span>
          <div style={{ color: "grey" }}>
            {props.book.rating}{" "}
            <sup>
              <FaStar size={16} style={{ color: "#fed221" }} />
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
