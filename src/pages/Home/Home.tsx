import { useEffect, useState } from "react";
import { AiFillThunderbolt } from "react-icons/ai";
import Slide from "./SlideShow";
import Span from "./Span";
import style from "./Home.module.css";
import { getBestSeller, getBooksOfCategory } from "../../apis/book";
import { BookInfoBrief } from "../../models";
import BookCarousel from "../../components/BookCarousel";
import { MdCollectionsBookmark } from "react-icons/md";
import { GiBookCover } from "react-icons/gi";
import Collections from "./Collections/Collections";
import Privacy from "./Privacy/Privacy";
import { FaBook } from "react-icons/fa";

const Home = () => {
  const [bestSeller, setBestSeller] = useState<BookInfoBrief[]>([]);
  const [education, seteducation] = useState<BookInfoBrief[]>([]);
  const [detective, setdetective] = useState<BookInfoBrief[]>([]);
  const [comic, setcomic] = useState<BookInfoBrief[]>([]);

  useEffect(() => {
    getBestSeller({ size: 10, rating: 0 })
      .then((res) => {
        setBestSeller(res.content as BookInfoBrief[]);
        console.log(bestSeller);
      })
      .catch((err) => {
        console.log(err);
      });
    getBooksOfCategory({ category: "education", size: 10, rating: 0 })
      .then((res) => {
        seteducation(res.content as BookInfoBrief[]);
        console.log(education);
      })
      .catch((err) => {
        console.log(err);
      });
    getBooksOfCategory({ category: "detective", size: 10, rating: 0 })
      .then((res) => {
        setdetective(res.content as BookInfoBrief[]);
        console.log(detective);
      })
      .catch((err) => {
        console.log(err);
      });
    getBooksOfCategory({ category: "comic", size: 10, rating: 0 })
      .then((res) => {
        setcomic(res.content as BookInfoBrief[]);
        console.log(comic);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div id={style.homePage}>
      <Slide />
      <div id={style.content}>
        <Span
          icon={<AiFillThunderbolt color="fff" fontSize={24} />}
          text="Best Seller"
          rectLeftWidth={140}
          rectRightWidth={window.screen.width - 60 - 60 - 147}
          rectText="All"
        />
        {bestSeller.length > 0 && (
          <div id={style.books}>
            <BookCarousel books={bestSeller} />
          </div>
        )}
        <img
          className={style.fit}
          src="https://live.staticflickr.com/65535/52501278981_cf9503fea1_h.jpg"
          alt="img"
        />
        <Span
          icon={<MdCollectionsBookmark color="fff" fontSize={24} />}
          text="Collections"
          rectLeftWidth={150}
        />
        <Collections />
        <img
          className={style.fit}
          src="https://live.staticflickr.com/65535/52501447434_26eeab198f_h.jpg"
          alt="img"
        />
        <Span
          icon={<FaBook color="fff" fontSize={24} />}
          text="Comic"
          rectLeftWidth={100}
          rectRightWidth={window.screen.width - 60 - 60}
          rectText="All"
        />
        {comic.length > 0 && (
          <div id={style.books}>
            <BookCarousel books={comic} />
          </div>
        )}
        <img
          className={style.fit}
          src="https://live.staticflickr.com/65535/52501174531_5d0dc68331_h.jpg"
          alt="img"
        />
        <Span
          icon={<FaBook color="fff" fontSize={24} />}
          text="Education"
          rectLeftWidth={140}
          rectRightWidth={window.screen.width - 60 - 60}
          rectText="All"
        />
        {education.length > 0 && (
          <div id={style.books}>
            <BookCarousel books={education} />
          </div>
        )}
        <Span
          icon={<GiBookCover color="fff" fontSize={24} />}
          text="Book of the week"
          rectLeftWidth={210}
        />
        <div id={style.bookOfWeekCont}>
          <p>
            <img
              src="https://live.staticflickr.com/65535/52447753485_f125a528bd_n.jpg"
              alt="img"
            />
            <span> Le Chuchoteur - Donato Carrisi</span>
            <br />
            Five little girls have disappeared.
            <br /> Five small pits were dug in the clearing.
            <br /> At the bottom of each, a small arm, the left. Since
            investigating the abductions of young girls, criminologist Goran
            Gavila and his team of special agents have the impression of being
            manipulated. Each macabre discovery, each clue leads them to
            different assassins. The discovery of a sixth arm, in the clearing,
            belonging to an unknown victim, convinces them to call Mila Vasquez,
            an expert in kidnapping cases, for reinforcement. Behind closed
            doors in a Spartan apartment converted into a headquarters, Gavila
            and his agents are going to construct a theory that no one wants to
            believe: all the murders are linked, the real culprit is elsewhere.
            When children are killed, God is silent, and the devil whispers...
          </p>
        </div>
        <Span
          icon={<FaBook color="fff" fontSize={24} />}
          text="Detective"
          rectLeftWidth={140}
          rectRightWidth={window.screen.width - 60 - 60}
          rectText="All"
        />
        {detective.length > 0 && (
          <div id={style.books}>
            <BookCarousel books={detective} />
          </div>
        )}

        <Privacy />
      </div>
    </div>
  );
};

export default Home;
