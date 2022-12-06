import { useEffect, useState } from "react";
import { BookInfoBrief, PersonalOrder } from "../../models";
import { Link } from "react-router-dom";
import AppModal from "../../components/AppModal/AppModal";
import { getOrderDetails } from "../../apis/order";
import { useAppSelector } from "../../store/hook";
import { BsTruck } from "react-icons/bs";
import { Button } from "react-bootstrap";
interface Message {
  status: "success" | "fail";
  content: string;
}
interface Item {
  bookName: string;
  id: string;
  image: string;
  priceEach: number;
  quantityOrdered: number;
}
const OrderItem = (props: { order: PersonalOrder }) => {
  const [message, setMessage] = useState<Message | null>(null);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [itemList, setItemList] = useState<Item[]>([]);
  const closeModal = (show: boolean) => {
    setDeleteModal(show);
    setMessage(null);
  };
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
  }, []);

  const handleDelete = async () => {
    if (props.order.status !== "PENDING") {
      return setMessage({
        status: "fail",
        content: "Can not delete this order!",
      });
    }
  };
  return (
    <div className="itemContainer">
      <div className="status">
        <BsTruck className="mx-2" />
        {props.order.status}
      </div>
      {itemList.map((item) => {
        return (
          <div className="item">
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
      <div className="totalInfor">
        <div className="clearfix">
          <span className="mx-2">Total:</span>
          <span className="cash">
            <sup>$</sup>
            {props.order.total}
          </span>
        </div>
      </div>
      <div className="buttonOrder">
        <Button className="rebuyBt px-5 mx-3">ReBuy</Button>
        <Button variant="secondary" className="deleteOrderBt px-5">
          Delete
        </Button>
      </div>
    </div>
  );
};
export default OrderItem;
