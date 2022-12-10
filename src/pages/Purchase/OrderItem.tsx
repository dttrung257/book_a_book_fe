import { useEffect, useState } from "react";
import { BookInfoBrief, PersonalOrder } from "../../models";
import AppModal from "../../components/AppModal/AppModal";
import { deleteOrder, getOrderDetails } from "../../apis/order";
import { useAppSelector } from "../../store/hook";
import { BsTruck } from "react-icons/bs";
import { Button } from "react-bootstrap";

interface Item {
  bookName: string;
  id: string;
  image: string;
  priceEach: number;
  quantityOrdered: number;
}
const OrderItem = (props: { order: PersonalOrder }) => {
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [itemList, setItemList] = useState<Item[]>([]);
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
    await deleteOrder(accessToken, props.order.id);
    setShowDeleteModal(false);
    window.location.reload();
  };
  return (
    <div className="itemContainer">
      <div style={{ display: "flex" }}>
        <span className="date">{props.order.orderDate.toString()}</span>
        <div className="status">
          <BsTruck className="mx-2" />
          {props.order.status}
        </div>
      </div>

      {itemList.map((item, index) => {
        return (
          <div className="item" key={index}>
            <div className="itemBox">
              <img
                src={item.image}
                alt={item.id}
                key={item.id}
                width={90}
                height={90}
              />
            </div>
            <div className="infor">
              <h5>{item.bookName}</h5>
              <p>x{item.quantityOrdered}</p>
            </div>
          </div>
        );
      })}
      <div className="divider"></div>
      <div className="totalInfor mb-3">
        <div className="mt-3 d-flex justify-content-end">
          <span className="cash">
            <span style={{ color: "black", fontSize: "16px" }}>Total:</span>
            <sup>$</sup>
            {props.order.total}
          </span>
        </div>
        <div className="d-flex justify-content-end">
          Address: {props.order.address}
        </div>
      </div>
      <div className="buttonOrder">
        <Button
          variant="secondary"
          className="deleteOrderBt px-5"
          onClick={() => setShowDeleteModal(true)}
        >
          Delete
        </Button>
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
            className="cancelBt"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </Button>
          {status === "PENDING" ? (
            <Button className="confirmBt mx-3" onClick={handleDelete}>
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
