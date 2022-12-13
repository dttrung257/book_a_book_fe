import React, { useState, useEffect } from "react";
import styled from "styled-components";
import style from "./Category.module.css";
import { FaStar, FaBookOpen, FaChevronDown } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import * as bookSearch from "../../apis/book";
import BookCard from "../../components/Book/BookCard";
import { Subject, priceRanges, Book } from "../../models";
import { isAxiosError } from "../../apis/axiosInstance";
import Pagination from "@mui/material/Pagination";

const convertNumber = (value: any) => {
  if (numberFault(value)) {
    return 0;
  } else return parseInt(value);
};
const numberFault = (value: any) => {
  return isNaN(value) || value === null;
};
const price = [0, 5, 10, 25, 50, 100000000];

const Category = () => {
  const [searchResult, setSearchResult] = useState<Book[]>([]);

  const [hover, setHover] = useState(-1);

  const [searchParams, setSearchParams] = useSearchParams();
  const [totalpage, setTotalPages] = useState<number>(0);

  const stars = Array(5).fill(0);

  const handleHoverStar = (value: number) => {
    setHover(value);
  };
  const handleChangePage = async (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    searchParams.set("page", (value - 1).toString());
    setSearchParams(searchParams);
  };
  const resetPageHandler = () => {
    searchParams.set("page", "0");
  };
  const resetPriceHandler = () => {
    searchParams.set("from", "0");
    searchParams.set("to", "5");
  };
  const resetRatingHandler = () => {
    searchParams.set("rating", "0");
  };
  const handlePriceChange = (id: number) => {
    if (searchParams.get("from") !== price[id].toString()) {
      searchParams.set("from", price[id].toString());
      searchParams.set("to", price[id + 1].toString());
    } else {
      searchParams.delete("from");
      searchParams.delete("to");
    }
    resetPageHandler();
    setSearchParams(searchParams);
  };
  const handleCategoryClick = (category: string) => {
    if (searchParams.get("category") === category) {
      searchParams.delete("category");
    } else {
      searchParams.set("category", category);
    }
    resetPageHandler();
    setSearchParams(searchParams);
  };
  const handleRatingChange = (value: number) => {
    if (convertNumber(searchParams.get("rating")) === value) {
      searchParams.delete("rating");
    } else {
      searchParams.set("rating", value.toString());
    }
    resetPageHandler();
    setSearchParams(searchParams);
  };
  const handleBestSelling = (bestSelling: boolean) => {
    if (bestSelling) {
      searchParams.set("best_selling", "true");
    } else {
      searchParams.delete("best_selling");
    }
    resetPageHandler();
    setSearchParams(searchParams);
  };

  useEffect(() => {
    const name = searchParams.get("name") || "";
    const category = searchParams.get("category") || "";
    const from = searchParams.get("from") || "";
    const to = searchParams.get("to") || "";
    const rating = searchParams.get("rating") || "";
    const page = searchParams.get("page") || "";
    const best_selling = searchParams.get("best_selling") || false;
    const fetchApi = async () => {
      try {
        const result = await bookSearch.getBooks({
          name,
          category,
          from,
          to,
          rating,
          page,
          best_selling,
        });
        setSearchResult(result.content as Book[]);
        setTotalPages(result.totalPages);
        console.log(result);
      } catch (error) {
        if (isAxiosError(error)) {
          console.log(error);
        }
      }
    };
    if (convertNumber(page) > totalpage) {
      resetPageHandler();
      setSearchParams(searchParams);
    }
    if (numberFault(from) || numberFault(to)) {
      resetPriceHandler();
      setSearchParams(searchParams);
    }
    if (numberFault(rating) || convertNumber(rating) > 5) {
      resetRatingHandler();
      setSearchParams(searchParams);
    }
    fetchApi();
    console.log(searchParams.toString());
  }, [searchParams]);
  return (
    <div className={style.wrapper}>
      <div className={style.container}>
        <div className={style.filter}>
          <div className={style.filterArea}>
            <div className={style.filterTitle}>
              <span>CATEGORY</span>
            </div>
            {Subject.map((subject, index) => (
              <div
                key={index}
                onClick={() => handleCategoryClick(subject)}
                className={
                  subject === searchParams.get("category")
                    ? `${style.titleOnClick}`
                    : `${style.criterionTitle}`
                }
              >
                {subject}
              </div>
            ))}
          </div>
          <div className={style.filterArea}>
            <div className={style.filterTitle}>
              <span>PRICES</span>
            </div>
            {priceRanges.map((priceRange, index) => (
              <div
                className={
                  price[index].toString() === searchParams.get("from")
                    ? `${style.titleOnClick}`
                    : `${style.criterionTitle}`
                }
                key={index}
                onClick={() => handlePriceChange(index)}
              >
                {priceRange}
              </div>
            ))}
          </div>
          <div className={style.filterArea}>
            <div className={style.filterTitle}>
              <span>review</span>
            </div>
            <div className={style.starContainer}>
              {stars.map((_, index) => {
                return (
                  <FaStar
                    key={index}
                    className={style.starItem}
                    size={24}
                    style={
                      convertNumber(searchParams.get("rating")) > index ||
                      index <= hover
                        ? {
                            color: "#dcd13a",
                          }
                        : { color: "#989898" }
                    }
                    onClick={() => handleRatingChange(index + 1)}
                    onMouseOver={() => handleHoverStar(index)}
                    onMouseLeave={() => handleHoverStar(-1)}
                  />
                );
              })}
            </div>
          </div>
        </div>
        <div className={style.content}>
          <div className={style.bookHeader}>
            <div className={style.categoryTitle}>
              <span>
                {searchParams.get("category")
                  ? searchParams.get("category")
                  : "The Book Store"}
              </span>
            </div>
            <label className={style.dropDown}>
              {searchParams.get("best_selling") ? "Best Selling" : "Alls"}
              <FaChevronDown className={style.dropIcon} />
              <ul className={style.dropDownList}>
                <li
                  className={style.dropDownItem}
                  onClick={() => handleBestSelling(false)}
                >
                  All
                </li>
                <li
                  className={style.dropDownItem}
                  onClick={() => handleBestSelling(true)}
                >
                  Best Selling
                </li>
              </ul>
            </label>
          </div>
          {/* <div className="bannerContainer">
            <CategoryBanner category={"FANTASY"} />
          </div> */}
          <div className={style.headBanner}>
            <FaBookOpen size={14} className="mx-2" />
            Have a good day at Book a book. Get it at our home page
          </div>
          {searchResult.length !== 0 ? (
            <div className={style.bookContainer}>
              {searchResult.map((result) => {
                return <BookCard key={result.id} book={result} />;
              })}
            </div>
          ) : (
            <div className="flex-column align-items-center">
              <div
                className="d-flex flex-column align-items-center bg-white pb-4 rounded"
                style={{ width: "100%" }}
              >
                <img
                  src="/images/cannot-search.png"
                  alt="empty"
                  style={{ width: "40%" }}
                />
                <span className="mb-4 text-muted">
                  We don't have any books like that!!!
                </span>
              </div>
            </div>
          )}

          <Pagination
            count={totalpage}
            page={convertNumber(searchParams.get("page") || "0") + 1}
            showFirstButton
            showLastButton
            color="primary"
            style={{
              maxHeight: "25px",
              width: "fit-content",
              marginLeft: "auto",
              marginRight: "auto",
              // height: "auto",
              marginTop: "20px",
            }}
            onChange={handleChangePage}
            className={totalpage <= 1 ? `${style.pageNull}` : ""}
          />
        </div>
      </div>
    </div>
  );
};
export default Category;
