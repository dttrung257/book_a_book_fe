import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Form } from "react-bootstrap";
import { Button } from "@mui/material";
import { ImLocation2 } from "react-icons/im";
import { getUserInfo } from "../../apis/auth";
import axios, { isAxiosError } from "../../apis/axiosInstance";
import { Book, UserDetail } from "../../models";
import { useAppSelector } from "../../store/hook";
import style from "./Checkout.module.css";
import CheckoutItem from "./CheckoutItem";

interface BookCart {
  book: Book;
  quantity: number;
  checked: boolean;
}

const Checkout = () => {
  const location = useLocation();
  const { isLoggedIn, user, accessToken } = useAppSelector(
    (state) => state.auth
  );
  const [booksInfo, setBooksInfo] = useState<BookCart[]>([]);
  const [userInfo, setUserInfo] = useState<UserDetail>({
    firstName: user.firstName,
    lastName: user.lastName,
    email: "",
    gender: "",
    phoneNumber: "",
    address: "",
    avatar: user.avatar !== undefined ? user.avatar : "/images/anonymous.jpg",
  });
  const [address, setAddress] = useState<string>(userInfo.address);
  const [phoneNumber, setPhoneNumber] = useState<string>(userInfo.phoneNumber);

  const [errMessage, setErrMessage] = useState<string>("");

  useEffect(() => {
    if (location.state && location.state.items) {
      const getInfo = async () => {
        try {
          const res = await getUserInfo({
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          console.log(res);
          setUserInfo({
            firstName: res.firstName,
            lastName: res.lastName,
            email: res.email,
            gender: res.gender,
            phoneNumber: res.phoneNumber !== null ? res.phoneNumber : "",
            address: res.address !== null ? res.address : "",
            avatar:
              res.avatar !== undefined ? res.avatar : "/images/anonymous.jpg",
          });
          setAddress(res.address !== null ? res.address : "");
        } catch (error) {
          if (isAxiosError(error)) {
            const data = error.response?.data;
            setErrMessage(data?.message);
          } else {
            setErrMessage("Unknow error!!!");
            console.log(error);
          }
        }
      };

      getInfo();
      setBooksInfo(location.state.items as BookCart[]);
      console.log(location.state.items);
    }

    return () => {};
  }, []);

  if (!isLoggedIn || !location.state || location.state.items === null)
    return <Navigate to="/login" replace />;

  return (
    <div id={style.checkout}>
      <Container fluid="md" id={style.content}>
        <Row>
          <Col xs={8}>
            <div className={`${style.shippingHeader} fs-4 fw-semibold mb-4`}>
              <ImLocation2 />
              <span> SHIPPING ADDRESS </span>
            </div>
            <div className="px-3">
              <Form>
                <div className="d-flex">
                  <div className="flex-grow-1">
                    <span>First name</span>
                    <h4>{user.firstName}</h4>
                  </div>
                  <div className="flex-grow-1">
                    <span>Last name</span>
                    <h4>{user.lastName}</h4>
                  </div>
                </div>

                <Form.Group className="mb-3" controlId="checkoutPhoneNumber">
                  <Form.Label>Phone number</Form.Label>
                  <Form.Control
                    className="py-2"
                    type="text"
                    value={phoneNumber}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPhoneNumber(e.target.value)
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="checkoutAddress">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    className="py-2"
                    type="text"
                    value={address}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setAddress(e.target.value)
                    }
                  />
                </Form.Group>

                <Button variant="contained" type="submit">
                  Submit
                </Button>
              </Form>
            </div>
          </Col>
          <Col xs={4}>
            <div className={style.bookSumamry}>
              {booksInfo.length > 0 &&
                booksInfo.map((bookInfo) => (
                  <CheckoutItem
                    key={bookInfo.book.id}
                    book={bookInfo.book}
                    quantity={bookInfo.quantity}
                  />
                ))}
            </div>
            <div className={`${style.divider} my-2`}></div>
            <div>
              <h4>Order summary</h4>
              <div>
                <div className="d-flex justify-content-between">
                  <p>Subtotal</p>
                  <p>{location.state.totalPrice || 0}$</p>
                </div>
                <div className="d-flex justify-content-between">
                  <p>Delivery</p>
                  <p>Free</p>
                </div>
                <div className="d-flex justify-content-between">
                  <p>Total</p>
                  <p>{location.state.totalPrice || 0}$</p>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Checkout;
