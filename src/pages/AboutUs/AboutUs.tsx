import style from "./AboutUs.module.css"

const AboutUs = () => {
  return (
    <div>
      <p id={style.BookABook}>
        <span>
          <i>Book</i>
        </span>
        a<i>Book</i>
      </p>

      <p className={`${style.para} ${style.aboutUs}`}>
        Welcome to BookABook, the place to find the best books for every taste
        and occasion. We thoroughly check the quality of our goods, working only
        with reliable suppliers so that you only receive the best quality
        product.
      </p>

      <p id={style.Commitments} className={`${style.aboutUs}`}>
        Our commitments
      </p>

      <p className={`${style.para} ${style.aboutUs}`}>
        We at BookABook believe in high quality and exceptional customer
        service. But most importantly, we believe shopping is a right, not a
        luxury, so we strive to deliver the best products at the most affordable
        prices, and ship them to you regardless of where you are located.
      </p>
    </div>
  );
};
export default AboutUs;
