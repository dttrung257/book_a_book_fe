import { ChangeEvent, Fragment, useEffect, useState } from "react";
import { Comment as Cmt } from "../../../models";
import {
  deleteComment,
  getAllComments,
  getOtherComments,
  getUserComments,
} from "../../../apis/comment";
import { useAppSelector } from "../../../store/hook";
import Star from "../../../components/Star";
import style from "./Comment.module.css";
import ModalComment from "./ModalComment";
import { Avatar, Button, Pagination } from "@mui/material";
import { Modal } from "react-bootstrap";
import { MdDelete, MdEdit } from "react-icons/md";

const Comment = (props: { id: number; rate: number | undefined }) => {
  const { user, accessToken } = useAppSelector((state) => state.auth);
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const [comment, setComment] = useState<string>("");
  const [rate, setRate] = useState<number>(0);
  const [date, setDate] = useState<string>("")
  const [otherComments, setOtherComments] = useState<Cmt[]>([]);
  const [toggle, setToggle] = useState<boolean>(false);
  const [toggleDel, setToggleDel] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [page, setPage] = useState<number>(0);

  useEffect(() => {
    if (props.id === 0) return;
    setComment("");
    setPage(0)
    
    if (sent) {
      getUserComments(props.id, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }).then((res) => {
        setComment(res.content);
        setRate(res.star);
        if(res.updatedAt) setDate(`Updated at ${new Date(res.updatedAt).toLocaleString()}`);
        else setDate(new Date(res.createdAt).toLocaleString());
        setSent(false);
      });
      return;
    }
    if (!isLoggedIn) {
      getAllComments(props.id, page).then((res) => {
        setTotalPage(res.totalPage);
        setOtherComments(res.content)
      });
    } else {
      getUserComments(props.id, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }).then((res) => {
        if (res !== "") {
          setComment(res.content);
          setRate(res.star);
          if(res.updatedAt) setDate(`Updated at ${new Date(res.updatedAt).toLocaleString()}`);
        else setDate(new Date(res.createdAt).toLocaleString());
        }
      });
      getOtherComments(props.id, page, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }).then((res) => {
        setTotalPage(res.totalPage);
        setOtherComments(res.content);
      });
    }
  }, [sent, accessToken, isLoggedIn, page, props.id]);

  const changeToggle = () => {
    setToggle(toggle ? false : true);
  };
  const handleChangePage = (event: ChangeEvent<unknown>, pg: number) => {
    if (!isLoggedIn) {
      getAllComments(props.id, pg - 1).then((res) => {
        setOtherComments(res.content);
      });
    } else {
      getOtherComments(props.id, pg - 1, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }).then((res) => {
        setOtherComments(res.content);
      });
    }
    setPage(pg - 1);
  };

  const delComment = () => {
    deleteComment(props.id, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    setComment("");
    setRate(0);
    setToggleDel(false);
  };

  return (
    <div id={style.comment}>
      <p id={style.title}>Reviews</p>
      <hr style={{ height: "3px", borderWidth: 0, backgroundColor: "#666" }} />
      <p className={style.title}>Rating: </p>
      <Star rate={props.rate} />
      <br />
      <br />
      <p style={{ fontSize: "20px" }}>Comment: </p>
      {isLoggedIn ? (
        comment === "" ? (
          <Fragment>
            <ModalComment
              show={toggle}
              onHide={changeToggle}
              bookid={props.id}
              sent={sent ? true : false}
              setsent={(c) => setSent(c)}
            />
            <div className={style.btnFrame}>
              <Button
                variant="contained"
                color="primary"
                style={{ float: "right" }}
                size="small"
                onClick={changeToggle}
              >
                Comment
              </Button>
            </div>
          </Fragment>
        ) : (
          <Fragment>
            <div className={style.frameComment}>
              <div className={style.frameAvatar}>
                <Avatar
                  src={user.avatar}
                  style={{ maxWidth: 25, maxHeight: 25 }}
                />
              </div>
              <div className={style.textField}>
                <p className={style.ownerCmt}>{`${user.firstName} ${user.lastName}`}</p>
                <Star rate={rate} />
                <p style={{float: "right", color: "#666"}}>{date}</p>
                <p>{comment}</p>
              </div>
            </div>
            <ModalComment
              show={toggle}
              onHide={changeToggle}
              bookid={props.id}
              sent={sent ? true : false}
              setsent={(c) => setSent(c)}
              comment={{ content: comment, rate: rate }}
            />
            <div className={style.btnFrame} style={{ marginTop: "10px" }}>
              <Button
                variant="contained"
                color="error"
                style={{ float: "right" }}
                size="small"
                onClick={() => setToggleDel(true)}
              >
                {" "}
                <MdDelete />
                &nbsp;Delete
              </Button>
              <Button
                variant="contained"
                color="primary"
                style={{ float: "right", marginRight: "10px" }}
                onClick={changeToggle}
                size="small"
              >
                {" "}
                <MdEdit />
                &nbsp;Edit
              </Button>
            </div>
          </Fragment>
        )
      ) : (
        <></>
      )}
      <div>
        <div className={style.frameComment}>
          <div className={style.frameAvatar}>
            <Avatar style={{ maxWidth: 30, maxHeight: 30 }}>A</Avatar>
          </div>
          <div className={style.textField}>
            <p className={style.ownerCmt}>Admin </p>
            <Star rate={5} />
            <p>
              Because, despite the fairly innocuous first 200 pages, the title
              speaks the truth: this is a book about war. All of its horrors and
              atrocities. It is not sugar-coated, and it is often graphic. The
              "poppy" aspect refers to opium, which is a big part of this book.
              It is a fantasy, but the book draws inspiration from the Second
              Sino-Japanese War and the Rape of Nanking.
            </p>
          </div>
        </div>
        <br />
      </div>
      {otherComments.length > 0 &&
        otherComments.map((cmt, i) => {
          return (
            <div key={i}>
              <div className={style.frameComment}>
                <div className={style.frameAvatar}>
                  <Avatar
                    src={cmt.avatar}
                    style={{ maxWidth: 30, maxHeight: 30 }}
                  />
                </div>
                <div className={style.textField}>
                  <p className={style.ownerCmt}>{cmt.fullName} </p>
                  <Star rate={cmt.star} />
                  <p style={{float: "right"}}>{cmt.updatedAt ? `Updated at ${new Date(cmt.updatedAt).toLocaleString()}` : new Date(cmt.createdAt).toLocaleString()}</p>
                  <p>{cmt.content}</p>
                </div>
              </div>
              <br />
            </div>
          );
        })}
      <Modal show={toggleDel} onHide={() => setToggleDel(false)}>
        <Modal.Header closeButton={true}>Comfirm Deletion</Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to permanently delete this comment?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={delComment}
          >
            Delete
          </Button>
          &nbsp;&nbsp;
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => setToggleDel(false)}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <div>
        <Pagination
          className={style.nextPage}
          count={totalPage}
          page={page + 1}
          color="primary"
          onChange={handleChangePage}
        />
      </div>
    </div>
  );
};

export default Comment;
