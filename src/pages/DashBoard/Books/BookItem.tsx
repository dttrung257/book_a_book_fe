import { Book } from "../../../models";
import { CgMoreVertical } from "react-icons/cg";
import { Link, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import { Button } from "@mui/material";
import { useAppSelector } from "../../../store/hook";
import AppModal from "../../../components/AppModal/AppModal";
import { isAxiosError } from "../../../apis/axiosInstance";
import { toast } from "react-toastify";
import style from "../MainLayout.module.css";
import { changeBookStatus } from "../../../apis/manage";

const BookItem = ({ book: bookInfo }: { book: Book }) => {
  const { accessToken } = useAppSelector((state) => state.auth);
  const [statusModal, setStatusModal] = useState<boolean>(false);
  const [isStopSelling, setIsStopSelling] = useState<boolean>(
    bookInfo.stopSelling
  );
  const toggleBookStatus = () => {
    setStatusModal(true);
  };
  const onChangeBookStatus = async () => {
    setIsStopSelling(!isStopSelling);
    try {
      await changeBookStatus(bookInfo.id, !isStopSelling, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setStatusModal(false);
      setIsStopSelling(!isStopSelling);
      toast.success(
        `Changed book ID #${bookInfo.id} to ${
          isStopSelling ? "Selling" : "Stop Selling"
        }`
      );
    } catch (error) {
      if (isAxiosError(error)) {
        const data = error.response?.data;
        //setErrMessage(data?.message);
      } else {
        // setErrMessage("Unknow error!!!");
      }
      console.log(error);
    }
  };
  return (
    <>
      <tr
      // onClick={(e) => {
      //   navigate(`/dashboard/books/${bookInfo.id}`);
      // }}
      // style={{ cursor: "pointer" }}
      >
        <td>{bookInfo.id}</td>
        <td>
          <img
            src={bookInfo.image}
            alt="bookimg"
            style={{ maxHeight: "50px" }}
          />
        </td>
        <td style={{ textAlign: "left" }}>{bookInfo.name}</td>
        {/* <td>{bookInfo.category}</td> */}
        <td>${bookInfo.sellingPrice}</td>
        <td>{bookInfo.availableQuantity}</td>
        <td>{bookInfo.quantitySold}</td>
        <td>{bookInfo.rating ? bookInfo.rating + "/5" : "No Ratings"}</td>
        <td>
          <Form>
            <Form.Switch onChange={toggleBookStatus} checked={!isStopSelling} />
          </Form>
          <AppModal
            title={`Change status`}
            showModal={statusModal}
            setShowModal={setStatusModal}
          >
            <div>
              Change status of book #{bookInfo.id} to
              {isStopSelling ? " Selling" : " Stop Selling"}?
            </div>
            {/* <div style={{ color: "red" }}>{errMessage}</div> */}
            <div
              className={`${style.lockModal} d-flex justify-content-end mt-3`}
            >
              <Button
                className={style.cancelBtn}
                onClick={() => setStatusModal(false)}
              >
                Cancel
              </Button>
              <Button
                className={`${style.toggleLockBtn}`}
                onClick={onChangeBookStatus}
              >
                Confirm
              </Button>
            </div>
          </AppModal>
        </td>

        <td>
          <Link to={`/dashboard/books/${bookInfo.id}`} title="More">
            <CgMoreVertical color="black" />
          </Link>
        </td>
      </tr>
    </>
  );
};

export default BookItem;
