import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form } from "react-bootstrap";
import { Button } from "@mui/material";
import validator from "validator";
import { ImLocation2 } from "react-icons/im";
import { getUserInfo } from "../../apis/auth";
import { isAxiosError } from "../../apis/axiosInstance";
import { Book } from "../../models";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import style from "./Checkout.module.css";
import CheckoutItem from "./CheckoutItem";
import { postOrder } from "../../apis/order";
import { cartActions } from "../../store/cartSlice";
import Loading from "../Loading";
import { authActions } from "../../store/authSlice";

interface BookCart {
  book: Book;
  quantity: number;
  checked: boolean;
}

const infoValidator = ({
  phoneNumber,
  address,
}: {
  phoneNumber: string;
  address: string;
}) => {
  const error: { address?: string; phoneNumber?: string } = {};

  if (!address) error.address = "Address is required";
  if (!phoneNumber) error.phoneNumber = "Phone number is required";
  else if (!validator.isMobilePhone(phoneNumber))
    error.phoneNumber = "Please enter a valid phone number";

  return error;
};

const Checkout = () => {
  const location = useLocation();
  const { isLoggedIn, user, accessToken } = useAppSelector(
    (state) => state.auth
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [booksInfo, setBooksInfo] = useState<BookCart[]>([]);
  const [address, setAddress] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [errMessage, setErrMessage] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [deliveryOption, setDeliveryOption] = useState<number>(1);
  const [deliveryInfoErr, setDeliveryInfoErr] = useState<{
    phoneNumber?: string;
    address?: string;
  }>({});

  useEffect(() => {
    if (location.state && location.state.items) {
      const getInfo = async () => {
        try {
          setIsSending(true);
          const res = await getUserInfo({
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          setAddress(res.address || "");
          setPhoneNumber(res.phoneNumber || "");
        } catch (error) {
          if (isAxiosError(error)) {
            const data = error.response?.data;
            setErrMessage(data?.message);
          } else {
            setErrMessage("Unknow error!!!");
            console.log(error);
          }
          console.log(error);
        } finally {
          setIsSending(false);
        }
      };

      getInfo();
      setBooksInfo(location.state.items as BookCart[]);
    }

    return () => {};
  }, []);

  const order = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const err = infoValidator({ phoneNumber, address });
    if (err && Object.keys(err).length !== 0) {
      return setDeliveryInfoErr(err);
    }
    setDeliveryInfoErr({});

    try {
      const booksOrder = booksInfo.map((bookInfo) => ({
        bookId: bookInfo.book.id,
        quantity: bookInfo.quantity,
      }));

      setIsSending(true);
      await postOrder(accessToken, {
        address: address.trim(),
        phoneNumber: phoneNumber,
        orderdetails: booksOrder,
      });

      dispatch(
        cartActions.removeCartItems({
          ids: booksOrder.map((bookOrder) => bookOrder.bookId),
        })
      );

      navigate("/purchase", {
        replace: true,
      });
    } catch (error) {
      if (isAxiosError(error)) {
        const data = error.response?.data;
        setErrMessage(data?.message);

        if (data?.status === 401) {
          toast.error("Your account has been locked!");
          dispatch(authActions.logout());
          return navigate("/login", {
            state: { from: location },
          });
        }
      } else {
        setErrMessage("Unknow error!!!");
        console.log(error);
      }
    } finally {
      setIsSending(false);
    }
  };

  if (!isLoggedIn || !location.state || location.state.items === null)
    return <Navigate to="/login" replace />;

  return (
    <div id={style.checkout}>
      <Container fluid="md" id={style.content}>
        <Row>
          <Col xs={12} lg={7}>
            <div className={`${style.shippingHeader} fs-4 fw-semibold mb-4`}>
              <ImLocation2 />
              <span> SHIPPING ADDRESS </span>
            </div>
            <div className="px-3">
              <Form onSubmit={order}>
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

                <div className="d-flex">
                  <div className="flex-grow-1">
                    <span>Email</span>
                    <h5>{user.email}</h5>
                  </div>
                </div>

                <Form.Group className="mb-3" controlId="checkoutPhoneNumber">
                  <Form.Label>Phone number</Form.Label>
                  <Form.Control
                    className="py-2"
                    type="text"
                    value={phoneNumber}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPhoneNumber(e.target.value.trim())
                    }
                  />
                  {deliveryInfoErr?.phoneNumber ? (
                    <Form.Text className="text-danger">
                      {deliveryInfoErr.phoneNumber}
                    </Form.Text>
                  ) : null}
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
                  {deliveryInfoErr?.address ? (
                    <Form.Text className="text-danger">
                      {deliveryInfoErr.address}
                    </Form.Text>
                  ) : null}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Delivery options</Form.Label>
                  <Row>
                    {[1, 2, 3].map((num) => (
                      <Col xs={12} lg={4} key={num}>
                        <div
                          className={`${style.deliveryOptions} ${
                            deliveryOption === num && style.selected
                          } p-3`}
                        >
                          <Form.Check type={"radio"} id={num.toString()}>
                            <Form.Check.Input
                              type={"radio"}
                              name="deliveryOptions"
                              checked={num === deliveryOption}
                              onChange={() => setDeliveryOption(num)}
                            />
                            <Form.Check.Label>
                              <h5>Free</h5>
                              <div>Standard delivery {num}</div>
                            </Form.Check.Label>
                          </Form.Check>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Form.Group>

                <div className="mb-4">
                  <p className="text-danger">{errMessage}</p>
                  <div className="float-end">
                    <Button variant="contained" type="submit">
                      PLACE ORDER
                    </Button>
                  </div>
                </div>
              </Form>
            </div>
          </Col>
          <Col xs={12} lg={5}>
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
                  <h4>{location.state.totalPrice || 0}$</h4>
                </div>
              </div>
            </div>
            <div className={`${style.divider} my-2`}></div>
            <div>
              {booksInfo.length > 0 &&
                booksInfo.map((bookInfo) => (
                  <CheckoutItem
                    key={bookInfo.book.id}
                    book={bookInfo.book}
                    quantity={bookInfo.quantity}
                  />
                ))}
            </div>
          </Col>
        </Row>
      </Container>
      <Loading isSending={isSending} />
    </div>
  );
};

export default Checkout;
