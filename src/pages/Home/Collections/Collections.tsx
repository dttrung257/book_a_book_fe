import style from "./Collections.module.css";

const Collections = () => {
  return (
    <div id={style.collection}>
      <div className={style.coll}>
        {/* literary */}
        <div className={style.span}>
          <div>
            <p>LITERARY</p>
            <p className={style.spanAmount}>100 books</p>
          </div>
        </div>
        <img src="https://live.staticflickr.com/65535/52447753485_f125a528bd_n.jpg" />
      </div>
      {/* lifestyle */}
      <div className={style.coll}>
        <div className={style.span}>
          <div>
            <p>LIFESTYLE</p>
            <p className={style.spanAmount}>100 books</p>
          </div>
        </div>
        <img src="https://live.staticflickr.com/65535/52447360996_de6c10fa26_n.jpg" />
      </div>
      {/* technology */}
      <div className={style.coll}>
        <div className={style.span}>
          <div>
            <p>TECHNOLOGY</p>
            <p className={style.spanAmount}>100 books</p>
          </div>
        </div>
        <img src="https://live.staticflickr.com/65535/52459960778_8f291abb41_n.jpg" />
      </div>
      {/* romance */}
      <div className={style.coll}>
        <div className={style.span}>
          <div>
            <p>ROMANCE</p>
            <p className={style.spanAmount}>100 books</p>
          </div>
        </div>
        <img src="https://live.staticflickr.com/65535/52459529431_8755d42f00_w.jpg" />
      </div>
    </div>
  );
};

export default Collections;
