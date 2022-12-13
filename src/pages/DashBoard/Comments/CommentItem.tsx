import { CommentDetail } from "../../../models";
import { RiDeleteBinLine } from "react-icons/ri";
import { useAppSelector } from "../../../store/hook";
import { useState } from "react";
import AppModal from "../../../components/AppModal/AppModal";
import style from "../MainLayout.module.css";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import { isAxiosError } from "../../../apis/axiosInstance";
import { deleteComment } from "../../../apis/manage";

const CommentItem = ({
  comment,
  setCheckDeleteComment,
}: {
  comment: CommentDetail;
  setCheckDeleteComment: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { accessToken } = useAppSelector((state) => state.auth);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const handleDeleteBtn = () => {
    setDeleteModal(true);
  };

  const onDeleteComment = async () => {
    try {
      await deleteComment(comment.id, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setDeleteModal(false);
      toast.success("Comment deleted");
      setCheckDeleteComment((prev) => !prev);
    } catch (error) {
      if (isAxiosError(error)) {
        const data = error.response?.data;
        toast.error(data?.message);
      } else {
        toast.error("Unknow error!!!");
      }
    }
  };

  return (
    <>
      <tr>
        <td style={{ width: "10%" }}>
          <span>{comment.id}</span>
        </td>
        <td style={{ width: "30%", textAlign: "justify" }}>
          {comment.content}
        </td>
        <td>{comment.star}/5</td>
        <td style={{ width: "20%" }}>{comment.bookName}</td>
        <td>{comment.fullName}</td>
        <td style={{ width: "10%" }}>{comment.createdAt}</td>
        <td>
          <RiDeleteBinLine
            onClick={handleDeleteBtn}
            style={{ cursor: "pointer" }}
          />
          <AppModal
            title={`Delete comment`}
            showModal={deleteModal}
            setShowModal={setDeleteModal}
          >
            <div>Delete comment #{comment.id}?</div>
            <div
              className={`${style.lockModal} d-flex justify-content-end mt-3`}
            >
              <Button
                className={style.cancelBtn}
                onClick={() => setDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button
                className={`${style.toggleLockBtn}`}
                onClick={onDeleteComment}
              >
                Confirm
              </Button>
            </div>
          </AppModal>
        </td>
      </tr>
    </>
  );
};

export default CommentItem;
