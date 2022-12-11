import { Button } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { AiFillThunderbolt } from "react-icons/ai";
import { FaStar } from "react-icons/fa";
import { IoAdd, IoRemove } from "react-icons/io5";
import { MdCollectionsBookmark } from "react-icons/md";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getBooksOfCategory, getBookViaId } from "../../apis/book";
import BookCarousel from "../../components/BookCarousel";
import Span from "../Home/Span";
import { Book, BookInfoBrief, Category } from "../../models";
import style from "./Product.module.css";
import BookDetail from "./BookDetail/BookDetail";
import { formatStr } from "../../utils";
import Comment from "./Comment/Comment";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { cartActions } from "../../store/cartSlice";
import AlertSuccess from "../../components/AlertSuccess";
import { toast } from "react-toastify";

const Product = () => {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user, isLoggedIn } = useAppSelector((state) => state.auth);
  const [recommend, setRecommend] = useState<BookInfoBrief[]>([]);
  const [amount, setAmount] = useState<number>(1);
  const [isSending, setIsSending] = useState(false);
  const { items, totalQuantity } = useAppSelector((state) => state.cart);
  const [err, setErr] = useState("");

  const [info, setInfo] = useState<Book>({
    id: Number(params.id),
    name: "",
    image: "",
    category: Category.BUSINESS,
    author: "",
    buyPrice: 0,
    sellingPrice: 0,
    description: "",
    quantityInStock: 0,
    availableQuantity: 0,
    quantitySold: 0,
    stopSelling: false,
  });

  useEffect(() => {
    getBookViaId(params.id as unknown as number).then((res) => {
      setAmount(1);
      setErr("");
      setInfo(res);
      getBooksOfCategory({ category: res.category, size: 10, rating: 0 })
        .then((res) => {
          setRecommend(res.content as BookInfoBrief[]);
        })
        .catch((err) => {
          console.log(err);
        });
    });
    window.scrollTo(0, 0);
  }, [params.id]);

  const checkAmountInCart = () => {
    let tmp = items.find((item) => item.id === info.id)?.quantity as number;
    if (tmp !== undefined) return tmp;
    else return 0;
  };

  const addAmount = (c: boolean) => {
    setErr("");
    setAmount(
      c
        ? amount + 1 + checkAmountInCart() <= info.availableQuantity
          ? amount + 1
          : amount
        : amount - 1 >= 1
        ? amount - 1
        : amount
    );
    if (c && amount + 1 + checkAmountInCart() > info.availableQuantity)
      setErr("Maximum");
    else setErr("");
  };

  const handleChangeAmount = (event: ChangeEvent<HTMLInputElement>) => {
    setErr("");
    if (event.target.value === "") {
      setAmount(1);
      return;
    }
    let tmp = event.target.valueAsNumber;
    if (tmp + checkAmountInCart() > info.availableQuantity) {
      tmp =
        info.availableQuantity - checkAmountInCart() > 0
          ? info.availableQuantity - checkAmountInCart()
          : 1;
      setErr("Maximum");
    } else if (tmp < 1) tmp = 1;
    setAmount(tmp);
  };

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      return navigate("/login", {
        replace: true,
        state: { from: location },
      });
    }
    setAmount(1);
    if (user.authority === "ADMIN") {
      toast.warning("Admin can not add book to cart!");
      return;
    }
    if (amount + checkAmountInCart() > info.availableQuantity) {
      toast.error(
        "Unable to add selected quantity to cart as it would exceed the maximum quantity available for this item"
      );
      return;
    }
    dispatch(
      cartActions.addToCart({
        id: info.id,
        stopSelling: info.stopSelling,
        quantity: amount,
      })
    );
    setIsSending(true);
  };

  return (
    <div id={style.productPage}>
      {isSending ? (
        <AlertSuccess
          setIsSending={() => setIsSending(false)}
          content="Successfully added to cart"
        />
      ) : (
        <></>
      )}
      <div style={{ margin: "0 60px", paddingTop: "10px" }}>
        <Span
          icon={<MdCollectionsBookmark color="fff" fontSize={24} />}
          text="Collections"
          rectLeftWidth={150}
          rectRightWidth={
            info.category == "EDUCATION"
              ? 180
              : info.category == "COMIC"
              ? 140
              : info.category == "ROMANCE" || info.category == "DETECTIVE"
              ? 170
              : info.category == "TECHNOLOGY"
              ? 200
              : info.category == "SCIENCE"
              ? 155
              : 165
          }
          rectText={info.category.toUpperCase()}
        />
        <div id={style.bookDetail}>
          <div id={style.frame}>
            <img src={info.image} alt={info.name} />
          </div>
          <div id={style.detail}>
            <p id={style.bookName}>{formatStr(info.name.toUpperCase(), 63)}</p>
            <div id={style.caption}>
              <span style={{ marginRight: "5px" }}>
                {info.rating !== null ? info.rating : 5}
              </span>
              <FaStar color="ffc107" />
              <svg height="30" width="30">
                <line
                  x1="15"
                  y1="5"
                  x2="15"
                  y2="25"
                  style={{ stroke: "#999999", strokeWidth: 2 }}
                />
              </svg>
              <span>{info.quantitySold} Sold</span>
              <svg height="30" width="30">
                <line
                  x1="15"
                  y1="5"
                  x2="15"
                  y2="25"
                  style={{ stroke: "#999999", strokeWidth: 2 }}
                />
              </svg>
              <p style={{ float: "right" }}>
                {info.quantityInStock} books available
              </p>
            </div>
            <p id={style.price}>{`${info.sellingPrice}$`}</p>
            <p id={style.vat}>*Product prices excluding VAT</p>
            <p id={style.description}>Description:</p>
            <p>Author: {info.author}</p>
            {/* <p>{info.description}</p> */}
            {/* <p style={{textAlign: "justify"}}>What I Learned from the Trees delves into the intricate relationship between humans and nature, and how these often overlooked, everyday interactions affect us as individuals, families, and communities. </p> */}
            <p style={{ textAlign: "justify" }}>
              {formatStr(info.description, 330)}
            </p>
            {info.stopSelling ? (
              <h6
                className="text-danger"
                style={{ position: "absolute", bottom: "20px", left: "35%" }}
              >
                ----- &nbsp;STOP SELLING &nbsp;-----
              </h6>
            ) : (
              <div>
                <div id={style.quantity}>
                  <span id={style.description}>Quantity:</span>
                  <div style={{ display: "inline-block", marginLeft: "20px" }}>
                    <span
                      className={style.selectAmount}
                      onClick={() => addAmount(false)}
                    >
                      <IoRemove />
                    </span>
                    <input
                      type="number"
                      value={amount}
                      onChange={handleChangeAmount}
                    />
                    <span
                      className={style.selectAmount}
                      onClick={() => addAmount(true)}
                    >
                      <IoAdd />
                    </span>
                  </div>
                  {err !== "" ? (
                    <span
                      className="text-danger"
                      style={{ marginLeft: "10px" }}
                    >
                      {err}
                    </span>
                  ) : null}
                  <br />
                  {/* <p style={{float: "right"}}>{info.quantityInStock} books available</p> */}
                </div>
                <Button
                  variant="contained"
                  color="primary"
                  style={{
                    position: "absolute",
                    bottom: "20px",
                    right: "40px",
                  }}
                  onClick={handleAddToCart}
                >
                  Add to cart
                </Button>
              </div>
            )}
          </div>
        </div>
        <BookDetail {...info} />
        <Span
          icon={<AiFillThunderbolt color="fff" fontSize={24} />}
          text="Recommend"
          rectLeftWidth={170}
        />
        {recommend.length > 0 && (
          <div id={style.books}>
            <BookCarousel books={recommend} />
          </div>
        )}
        {info.id !== 0 && <Comment id={info.id} rate={info.rating} />}
      </div>
      <br />
    </div>
  );
};

export default Product;
