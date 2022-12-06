import React, { useState, useLayoutEffect } from "react";
import styled from "styled-components";
import "./index.css";
import { FaStar, FaBookOpen, FaChevronDown } from "react-icons/fa";
import { Link, useSearchParams } from "react-router-dom";
import * as bookSearch from "../../apis/book";
import BookCard from "../../components/Book/BookCard";
import { Subject, priceRanges, Book } from "../../models";
import { FilterSearch } from "../../models/Filter";
import { isAxiosError } from "../../apis/axiosInstance";
import CategoryBanner from "../../components/CategoryBanner/CategoryBanner";
import Pagination from "@mui/material/Pagination";
const Wrapper = styled.div`
  background-color: #ffffff;
  position: relative;
  overflow: auto;
  min-height: 100vh;
  height: fit-content;
  display: flex;
  flex-direction: column;
`;

const price = [0, 5, 10, 25, 50, 100000000];

const CategoryPage = () => {
  const [searchResult, setSearchResult] = useState<Book[]>([]);

  const [hover, setHover] = useState(-1);
  const [filter, setFilter] = useState<FilterSearch>({ rating: 0 });
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalpage, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(
    parseInt(searchParams.get("page") || "0")
  );
  const stars = Array(5).fill(0);

  const handleHoverStar = (value: number) => {
    setHover(value);
  };
  const handleChangePage = async (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value - 1);
    searchParams.set("page", (value - 1).toString());
    setSearchParams(searchParams);
  };

  const handlePriceChange = (id: number) => {
    if (filter.from !== price[id]) {
      setFilter({
        ...filter,
        from: price[id],
        to: price[id + 1],
      });
      searchParams.set("from", price[id].toString());
      searchParams.set("to", price[id + 1].toString());
    } else {
      setFilter({
        ...filter,
        from: 0.1,
        to: 100000000,
      });
      searchParams.delete("from");
      searchParams.delete("to");
    }
    setSearchParams(searchParams);
  };
  const handleCategoryClick = (category: string) => {
    if (filter.category === category) {
      setFilter({
        ...filter,
        category: "",
      });
      searchParams.delete("category");
    } else {
      setFilter({
        ...filter,
        category: category,
      });
      searchParams.set("category", category);
    }
    setSearchParams(searchParams);
  };
  const handleRatingChange = (value: number) => {
    if (filter.rating === value) {
      setFilter({
        ...filter,
        rating: 0,
      });
      searchParams.delete("rating");
    } else {
      setFilter({
        ...filter,
        rating: value,
      });
      searchParams.set("rating", value.toString());
    }
  };
  const handleBestSelling = (bestSelling: boolean) => {
    if (bestSelling) {
      setFilter({
        ...filter,
        best_selling: true,
      });
      searchParams.set("best_selling", "true");
    } else {
      setFilter({
        ...filter,
        best_selling: false,
      });
      searchParams.delete("best_selling");
    }
    setSearchParams(searchParams);
  };

  useLayoutEffect(() => {
    const name = searchParams.get("name") || "";
    const category = searchParams.get("category") || "";
    const from = searchParams.get("from") || "";
    const to = searchParams.get("to") || "";
    const rating = searchParams.get("rating") || "";
    const page = searchParams.get("page") || "0";
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
        searchParams.set("page", page);
        setSearchParams(searchParams);
        setSearchResult(result.content as Book[]);
        setTotalPages(result.totalPages);
        console.log(result);
      } catch (error) {
        if (isAxiosError(error)) {
          console.log(error);
        }
      }
    };
    fetchApi();
  }, [filter, searchParams]);
  console.log(searchResult);
  return (
    <Wrapper>
      <div className="container">
        <div className="filter">
          <div className="filterArea">
            <div className="filterTitle">
              <span>CATEGORY</span>
            </div>
            {Subject.map((subject, index) => (
              <div
                key={index}
                onClick={() => handleCategoryClick(subject)}
                className={
                  subject === filter.category
                    ? "TitleOnClick"
                    : "criterionTitle"
                }
              >
                {subject}
              </div>
            ))}
          </div>
          <div className="filterArea">
            <div className="filterTitle">
              <span>PRICES</span>
            </div>
            {priceRanges.map((priceRange, index) => (
              <div
                className={
                  price[index] === filter.from
                    ? "TitleOnClick"
                    : "criterionTitle"
                }
                key={index}
                onClick={() => handlePriceChange(index)}
              >
                {priceRange}
              </div>
            ))}
          </div>
          <div className="filterArea">
            <div className="filterTitle">
              <span>review</span>
            </div>
            <div className="starContainer">
              {stars.map((_, index) => {
                return (
                  <FaStar
                    key={index}
                    className="starItem"
                    size={24}
                    style={
                      filter.rating > index || index <= hover
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
        <div className="content">
          <div className="bookHeader">
            <div className="categoryTitle">
              <span>
                {searchParams.get("category")
                  ? filter.category
                  : "The Book Store"}
              </span>
            </div>
            <label className="dropDown">
              {filter.best_selling ? "Best Selling" : "Alls"}
              <FaChevronDown className="dropIcon" />
              <ul className="dropDownList">
                <li
                  className="dropDownItem"
                  onClick={() => handleBestSelling(false)}
                >
                  All
                </li>
                <li
                  className="dropDownItem"
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
          <div className="headBanner">
            <FaBookOpen size={14} className="mx-2" />
            Have a good day at Book a book. Get it at our home page
            <Link to={"#"} className="mx-2">
              Home
            </Link>
          </div>
          <div className="bookContainer">
            {searchResult.map((result) => {
              return <BookCard key={result.id} book={result} />;
            })}
          </div>
          <Pagination
            count={totalpage}
            page={currentPage + 1}
            showFirstButton
            showLastButton
            color="primary"
            style={{
              maxHeight: "25px",
              width: "75vw",
              // marginLeft: "auto",
              // marginRight: "auto",
              // height: "auto",
              // marginTop: "auto",
            }}
            onChange={handleChangePage}
            className={totalpage <= 1 ? "pageNull" : ""}
          />
        </div>
      </div>
    </Wrapper>
  );
};
export default CategoryPage;
