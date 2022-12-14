import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import "./App.css";
import { authActions } from "./store/authSlice";
import { cartActions } from "./store/cartSlice";
import { useAppDispatch, useAppSelector } from "./store/hook";
import Cookies from "js-cookie";
import { createTheme, ThemeProvider } from "@mui/material";
import { lazy } from "react";

const Login = lazy(() => import("./pages/Login/Login"));
const SignUp = lazy(() => import("./pages/Signup/SignUp"));
const Home = lazy(() => import("./pages/Home/Home"));
const Error = lazy(() => import("./pages/Error/Error"));
const Layout = lazy(() => import("./components/Layout"));
const Loading = lazy(() => import("./pages/Loading"));
const DashBoardLayout = lazy(() => import("./pages/DashBoard/DashBoardLayout"));
const Cart = lazy(() => import("./pages/Cart/Cart"));
const Checkout = lazy(() => import("./pages/Checkout/Checkout"));
const Product = lazy(() => import("./pages/Product/Product"));
const Category = lazy(() => import("./pages/Category/Category"));
const Account = lazy(() => import("./pages/Account/Account"));
const AboutUs = lazy(() => import("./pages/AboutUs/AboutUs"));
const Purchase = lazy(() => import("./pages/Purchase/Purchase"));
const AuthVerify = lazy(() => import("./pages/VerifyEmail/AuthVerify"));
const ForgetPasswordLayout = lazy(
  () => import("./pages/ForgetPassword/Layout")
);
const Forget = lazy(() => import("./pages/ForgetPassword/Forget"));
const CodeVerify = lazy(() => import("./pages/ForgetPassword/CodeVerify"));
const Reset = lazy(() => import("./pages/ForgetPassword/Reset"));
const DashBoardUser = lazy(() => import("./pages/DashBoard/User/User"));
const DashBoardUserDetail = lazy(
  () => import("./pages/DashBoard/User/UserDetail")
);
const DashBoardBook = lazy(() => import("./pages/DashBoard/Books/Book"));
const DashBoardBookDetail = lazy(
  () => import("./pages/DashBoard/Books/BookDetail")
);
const DashBoardOrder = lazy(() => import("./pages/DashBoard/Orders/Order"));
const DashBoardOrderDetail = lazy(
  () => import("./pages/DashBoard/Orders/OrderDetail")
);
const DashBoardComment = lazy(
  () => import("./pages/DashBoard/Comments/CommentList")
);

const theme = createTheme({
  palette: {
    primary: {
      main: "#008B8B",
    },
    secondary: {
      main: "#666666",
    },
  },
});

const App = () => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

  const user = JSON.parse(Cookies.get("user") || "{}");
  const token = Cookies.get("token") || "";

  if (!isLoggedIn && user && token) {
    dispatch(
      authActions.storeInfo({
        accessToken: token,
        user: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          authority: user.authority,
          avatar: user.avatar,
        },
      })
    );

    const cart = JSON.parse(Cookies.get("cartItems") || "[]");
    dispatch(cartActions.storeInfo(cart));
  }

  return (
    <ThemeProvider theme={theme}>
      <Suspense fallback={<Loading isSending={true} />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="product/:id/:title" element={<Product />} />
            <Route path="books" element={<Category />} />
            <Route path="purchase" element={<Purchase />} />
            <Route path="account" element={<Account />} />
            <Route path="about-us" element={<AboutUs />} />
            {/* Product Collection Account AboutUs Blog Checkout Order */}
            <Route path="*" element={<Error />} />
          </Route>
          <Route path="dashboard" element={<DashBoardLayout />}>
            <Route index element={<Navigate to={"users"} />} />
            <Route path="users" element={<DashBoardUser />} />
            <Route path="users/:id" element={<DashBoardUserDetail />} />
            <Route path="books" element={<DashBoardBook />} />
            <Route path="books/:id" element={<DashBoardBookDetail />} />
            <Route path="orders" element={<DashBoardOrder />} />
            <Route path="orders/:id" element={<DashBoardOrderDetail />} />
            <Route path="comments" element={<DashBoardComment />} />
          </Route>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="verify-email" element={<AuthVerify />} />
          <Route path="forget-password" element={<ForgetPasswordLayout />}>
            <Route index element={<Forget />} />
            <Route path="verify" element={<CodeVerify />} />
            <Route path="reset/:resetToken" element={<Reset />} />
          </Route>
        </Routes>
      </Suspense>
      <ToastContainer
        pauseOnHover={false}
        transition={Slide}
        pauseOnFocusLoss={false}
        autoClose={4000}
      />
    </ThemeProvider>
  );
};

export default App;
