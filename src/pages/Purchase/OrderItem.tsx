import { useEffect, useState } from "react";
import { BookInfoBrief, Item, PersonalOrder } from "../../models";
import AppModal from "../../components/AppModal/AppModal";
import { deleteOrder, getOrderDetails } from "../../apis/order";
import { useAppSelector } from "../../store/hook";
import { BsTruck } from "react-icons/bs";
import { Button } from "react-bootstrap";
import style from "./Purchase.module.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const timeout = (delay: number) => {
  return new Promise((res) => setTimeout(res, delay));
};
const OrderItem = (props: { order: PersonalOrder }) => {
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [itemList, setItemList] = useState<Item[]>([]);
  const navigate = useNavigate();
  const status = props.order.status;
  useEffect(() => {
    const fetchApi = async () => {
      try {
        const result = await getOrderDetails(accessToken, props.order.id);
        setItemList(result.content as Item[]);
        console.log(result);
      } catch (error) {
        console.log(error);
      }
    };
    fetchApi();
  }, [accessToken]);

  const handleDelete = async () => {
    try {
      await deleteOrder(accessToken, props.order.id);
    } catch (error) {
      toast.error(
        "Can not delete this order. Reload web to get latest information"
      );
      await timeout(4000);
      window.location.reload();
      return;
    }
    toast.success(`Delete success order ${props.order.id}`);
    await timeout(4000);
    setShowDeleteModal(false);
    window.location.reload();
  };
  const producClickHandler = (product: string) => {
    navigate(`/books?page=0&name=${product.replace(/\s+/g, " ").trim()}`);
  };
  return (
    <div className={style.itemContainer}>
      <div style={{ display: "flex" }}>
        <span className={style.date}>{props.order.orderDate.toString()}</span>
        <div className={style.status}>
          <BsTruck className="mx-2" />
          {props.order.status}
        </div>
      </div>

      {itemList.map((item, index) => {
        return (
          <div
            className={style.item}
            key={index}
            onClick={() => producClickHandler(item.bookName)}
          >
            <div className={style.itemBox}>
              <img
                src={item.image}
                alt={item.id}
                key={item.id}
                width={80}
                height={80}
              />
            </div>
            <div className={style.infor}>
              <h5 style={{ width: "100%" }}>{item.bookName}</h5>
              <p style={{ textAlign: "left", width: "50%" }}>
                x{item.quantityOrdered}
              </p>
              <p style={{ textAlign: "right", width: "50%" }}>
                <sup>$</sup>
                {item.priceEach}
              </p>
            </div>
          </div>
        );
      })}
      <div className={style.divider}></div>
      <div className={`${style.totalInfor} mb-3`}>
        <div className={`${style.blockText}`} style={{ width: "40%" }}>
          {" "}
          <span style={{ color: "grey" }}>Address:</span> {props.order.address}
        </div>
        <div className={`${style.blockText} mx-4`} style={{ width: "30%" }}>
          <span style={{ color: "grey" }}>Phone Number:</span>{" "}
          {props.order.phoneNumber}
        </div>
        <div className={`${style.blockText} mx-4`} style={{ width: "30%" }}>
          <span className={style.cash}>
            <span style={{ color: "grey", fontSize: "16px" }}>Total:</span>
            <sup>$</sup>
            {props.order.total}
          </span>
        </div>
      </div>
      <div className={style.buttonOrder}>
        {status === "PENDING" ? (
          <Button
            variant="secondary"
            className={`${style.deleteOrderBt} px-5`}
            onClick={() => setShowDeleteModal(true)}
          >
            Cancel
          </Button>
        ) : (
          <></>
        )}
      </div>
      <AppModal
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        title={`Delete Order ${props.order.orderDate}`}
      >
        {status !== "PENDING" ? (
          <p>You can not delete or suspend this order</p>
        ) : (
          <p>Delete this order?</p>
        )}
        <div className="mt-3 d-flex justify-content-end">
          <Button
            className={style.cancelBt}
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </Button>
          {status === "PENDING" ? (
            <Button
              className={`${style.confirmBt} mx-3`}
              onClick={handleDelete}
            >
              Confirm
            </Button>
          ) : (
            <></>
          )}
        </div>
      </AppModal>
    </div>
  );
};
export default OrderItem;
