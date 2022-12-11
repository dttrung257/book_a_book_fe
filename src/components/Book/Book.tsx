import { TooltipProps, Tooltip } from "@mui/material";
import { styled } from "@mui/material";
import { BsCartPlus } from "react-icons/bs";
import { BookInfoBrief } from "../../models";
import style from "./Book.module.css";
import { Link } from "react-router-dom";
import { formatStr } from "../../utils";

const LightTooltip = styled(({ ...props }: TooltipProps) => (
  <Tooltip {...props} />
))(() => ({
  [`& .MuiTooltip-tooltip`]: {
    fontSize: 12,
  },
}));

const Book = (props: { book: BookInfoBrief }) => {
  const info: BookInfoBrief = {
    id: props.book.id,
    name: props.book.name,
    image: props.book.image,
    author: props.book.author,
    sellingPrice: props.book.sellingPrice,
  };

  let path = `/product/${info.id}/${info.name
    .split(" ")
    .join("-")
    .toLowerCase()}`;

  return (
    <div className={style.frame}>
      <Link to={path}>
        <div>
          <img src={info.image} alt={info.name} />
        </div>
        <div id={style.info}>
          <div id={style.text}>
            {/* <Link to={path}> */}
            <LightTooltip title={info.name}>
              <p id={style.bookName}>{formatStr(info.name, 20)}</p>
            </LightTooltip>
            {/* </Link> */}
            <p id={style.author}>{formatStr(info.author, 25)}</p>
            <p id={style.price}>{`${info.sellingPrice}$`}</p>
          </div>
          <div id={style.cart}>
            <BsCartPlus fontSize={24} color="008b8b" />
          </div>
        </div>
      </Link>
      {/* <Zoom in={checked}>
        <div id="alert-success">
        Successfully added to cart
        </div>
        </Zoom> */}
    </div>
  );
};

export default Book;
