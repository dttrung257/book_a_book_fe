import { Book } from "../../../models";
import style from "./BookDetail.module.css";

const BookDetail = (book: Book) => {
  return (
    <div id={style.bookDetailCont}>
      <div id={style.bookSpecification}>
        <p className={style.title}>Book Specifications</p>
        <div style={{ display: "flex" }}>
          <div className={style.specificationTitle}>Name</div>
          <div>
            <p>{book.name}</p>
          </div>
        </div>
        <div style={{ display: "flex" }}>
          <div className={style.specificationTitle}>Author</div>
          <div>
            <p>{book.author !== null ? book.author : "Unknown"}</p>
          </div>
        </div>
        <div style={{ display: "flex" }}>
          <div className={style.specificationTitle}>Category</div>
          <div>
            <p>{book.category !== null ? book.category : "Unknown"}</p>
          </div>
        </div>
        <div style={{ display: "flex" }}>
          <div className={style.specificationTitle}>Publisher</div>
          <div>
            <p>{book.publisher !== null ? book.publisher : "Unknown"}</p>
          </div>
        </div>
        <div style={{ display: "flex" }}>
          <div className={style.specificationTitle}>Publication year</div>
          <div>
            <p>
              {book.yearOfPublication !== null
                ? book.yearOfPublication
                : "Unknown"}
            </p>
          </div>
        </div>
        <div style={{ display: "flex" }}>
          <div className={style.specificationTitle}>ISBN</div>
          <div>
            <p>{book.isbn !== null ? book.isbn : "Unknown"}</p>
          </div>
        </div>
        <div style={{ display: "flex" }}>
          <div className={style.specificationTitle}>Pages</div>
          <div>
            <p>
              {book.numberOfPages !== null ? book.numberOfPages : "Unknown"}
            </p>
          </div>
        </div>
        <div style={{ display: "flex" }}>
          <div className={style.specificationTitle}>Dimensions</div>
          <div>
            <p>
              {book.width !== null ? book.width : "Unknown"} x{" "}
              {book.height !== null ? book.height : "Unknown"}
            </p>
          </div>
        </div>
        <div style={{ display: "flex" }}>
          <div className={style.specificationTitle}>Stock</div>
          <div>
            <p>
              {book.quantityInStock !== null ? book.quantityInStock : "Unknown"}
            </p>
          </div>
        </div>
      </div>
      <div id={style.privacy}>
        <p className={style.title}>Packaging & Delivery</p>
        <p style={{ fontSize: "17px" }}>
          All our books are securely packaged using the most appropriate
          materials to ensure that your book arrives safely.
          <br />
          We recommend that you opt for a fully-insured delivery method, the
          price for which varies depending on the value of the book(s).
        </p>
        <p className={style.title}>Returns</p>
        <p style={{ fontSize: "17px" }}>
          Incorrectly described, significantly damaged on arrival or improperly
          packaged.
          <br />
          If you no longer want the item, or you purchased it by mistake, you
          are welcome to return the item to us for a refund, but this is at cost
          to you.
        </p>
      </div>
    </div>
  );
};

export default BookDetail;
