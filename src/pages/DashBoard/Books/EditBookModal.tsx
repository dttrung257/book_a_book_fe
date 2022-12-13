import { Book } from "../../../models";
import { isAxiosError } from "../../../apis/axiosInstance";
import { useState } from "react";
import { Form } from "react-bootstrap";
import AppModal from "../../../components/AppModal/AppModal";
import { BookAddInfo, Category } from "../../../models";
import { useAppSelector } from "../../../store/hook";
import validator from "validator";
import { toast } from "react-toastify";
import { Button } from "@mui/material";
import style from "../MainLayout.module.css";
import { changeBookInfo } from "../../../apis/manage";
import "firebase/compat/storage";
import { storage } from "../../../firebase/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
interface InfoError {
  name?: string;
  image?: string;
  category?: string;
  author?: string;
  description?: string;
  buyPrice?: string;
  sellingPrice?: string;
  quantityInStock?: string;
  isbn?: string;
  yearOfPublication?: string;
}

const metadata = {
  contentType: "image/jpeg",
  accept: ".png",
};

const validationInfo = (info: BookAddInfo): InfoError => {
  const error: InfoError = {};

  if (!info.name) error.name = "Name is required";

  if (!info.image) error.image = "Image URL is required";

  if (!info.category) error.category = "Category is required";

  if (!info.author) error.author = "Author is required";

  if (!info.description) error.description = "Description is required";

  if (!info.quantityInStock) error.quantityInStock = "Quantity is required";

  if (!info.buyPrice) error.buyPrice = "Buy Price is required";

  if (!info.sellingPrice) error.sellingPrice = "Selling Price is required";

  if (
    info.buyPrice &&
    info.sellingPrice &&
    parseFloat(info.buyPrice) >= parseFloat(info.sellingPrice)
  ) {
    error.sellingPrice = "Selling Price must be higher than Buy Price";
  }

  if (info.isbn && info.isbn !== "" && !validator.isISBN(info.isbn))
    error.isbn = "Invalid ISBN";

  //   if (
  //     info.yearOfPublication &&
  //     !validator.isDate(new Date(info.yearOfPublication).toString(), {
  //       format: "YYYY",
  //     })
  //   ) {
  //     console.log(new Date(info.yearOfPublication).getFullYear().toString());
  //     error.yearOfPublication = "Invalid Year";
  //   }
  return error;
};

const EditBookModal = (prop: {
  book: Book;
  showModal: boolean;
  setShowModal: (show: boolean) => void | React.Dispatch<boolean>;
}) => {
  const [bookEditInfo, setBookEditInfo] = useState<BookAddInfo>({
    name: prop.book.name,
    image: prop.book.image,
    category: prop.book.category,
    author: prop.book.author,
    buyPrice: prop.book.buyPrice.toString(),
    sellingPrice: prop.book.sellingPrice.toString(),
    description: prop.book.description,
    quantityInStock: prop.book.quantityInStock,
    width: prop.book.width || "",
    height: prop.book.height || "",
    isbn: prop.book.isbn || "",
    publisher: prop.book.publisher || "",
    numberOfPages: prop.book.numberOfPages || "",
    yearOfPublication: prop.book.yearOfPublication?.toString() || "",
  });
  const [pathImage, setPathImage] = useState<string>("");
  const [error, setError] = useState<InfoError>({});
  const accessToken = useAppSelector((state) => state.auth.accessToken);

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      let file = e.target.files[0];
      if (file) {
        var ext = file.type;
        if (ext !== "image/jpeg" && ext !== "image/png") {
          setError({ ...error, image: "Invalid file type!" });
          return;
        }
        setError({ ...error, image: undefined });
        setPathImage(file.name)
        const path = `/images/${file.name}`;
        const imgref = ref(storage, path);
        const uploadTask = uploadBytesResumable(imgref, file, metadata);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            // console.log("Upload is " + progress + "% done");
            // switch (snapshot.state) {
            //   case "paused":
            //     // console.log("Upload is paused");
            //     break;
            //   case "running":
            //     // console.log("Upload is running");
            //     break;
            // }
          },
          (error) => {
            setError({ ...error, image: "Upload photo failed!" });
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setBookEditInfo({
                ...bookEditInfo,
                image: downloadURL,
              })
            });
          }
        );
      }
    }
  };
  const editBook = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      //validate info
      const err = validationInfo(bookEditInfo);
      console.log(err);
      if (err && Object.keys(err).length !== 0) return setError(err);
      setError({});

      await changeBookInfo(prop.book.id, bookEditInfo, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("Book has been changed successfully");
      prop.setShowModal(false);
      //navigate(`/dashboard/books/${response.data.id}`);
    } catch (error) {
      if (isAxiosError(error)) {
        const data = error.response?.data;
        toast.error(data?.message);
      } else {
        toast.error("Unknow error!!!");
        console.log(error);
      }
    }
  };

  return (
    <div style={{ overflowY: "initial" }}>
      <AppModal
        title={`Update Book #${prop.book.id} information`}
        showModal={prop.showModal}
        setShowModal={(showModal) => {
          prop.setShowModal(showModal);
          setError({});
        }}
      >
        <Form
          className={style.editModal}
          onSubmit={editBook}
          style={{ minWidth: "50vw", maxHeight: "600px", overflowY: "auto" }}
        >
          <Form.Group className="mb-3" controlId="nameAdd">
            <Form.Label>
              Name<span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Book Name"
              value={bookEditInfo.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setBookEditInfo({
                  ...bookEditInfo,
                  name: e.target.value,
                })
              }
            />
            {error?.name ? (
              <Form.Text className="text-danger">{error.name}</Form.Text>
            ) : null}
          </Form.Group>
          <Form.Group className="mb-3" controlId="imageAdd">
            <Form.Label>
              Image<span className="text-danger">*</span>
            </Form.Label>
            {/* <Form.Control
              type="url"
              placeholder="Image URL"
              value={bookEditInfo.image}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setBookEditInfo({
                  ...bookEditInfo,
                  image: e.target.value,
                })
              }
            /> */}
            <br />
            <Form.Control
          accept=".jpg,.jpeg,.png"
          style={{ display: "none" }}
          id="outlined-button-file"
          type="file"
          onChange={handleChange}
        />
        <label htmlFor="outlined-button-file">
          <Button variant="outlined" component="span" size="small">
            Choose file
          </Button>&nbsp;&nbsp;
          <span>{pathImage}</span>
        </label>
            {error?.image ? (
              <Form.Text className="text-danger">{error.image}</Form.Text>
            ) : null}
          </Form.Group>
          <Form.Group className="mb-3 d-flex" controlId="categoryAdd">
            <div className="flex-fill me-3">
              <Form.Group className="mb-3" controlId="author">
                <Form.Label>
                  Author<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Author"
                  value={bookEditInfo.author}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setBookEditInfo({
                      ...bookEditInfo,
                      author: e.target.value,
                    })
                  }
                />
                {error?.author ? (
                  <Form.Text className="text-danger">{error.author}</Form.Text>
                ) : null}
              </Form.Group>
            </div>
            <div className="flex-fill">
              <Form.Label>
                Category<span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                id="categoryInput"
                value={bookEditInfo.category}
                onChange={(e) => {
                  setBookEditInfo({
                    ...bookEditInfo,
                    category: e.target.value as Category,
                  });
                }}
              >
                <option value="TECHNOLOGY">TECHNOLOGY</option>
                <option value="SCIENCE">SCIENCE</option>
                <option value="COMIC">COMIC</option>
                <option value="DETECTIVE">DETECTIVE</option>
                <option value="LITERARY">LITERARY</option>
                <option value="LIFESTYLE">LIFESTYLE</option>
                <option value="ROMANCE">ROMANCE</option>
                <option value="EDUCATION">EDUCATION</option>
                <option value="FANTASY">FANTASY</option>
                <option value="BUSINESS">BUSINESS</option>
              </Form.Select>
              {error?.category ? (
                <Form.Text className="text-danger">{error.category}</Form.Text>
              ) : null}
            </div>
          </Form.Group>

          <Form.Group className="mb-3" controlId="description">
            <Form.Label>
              Description<span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Description"
              value={bookEditInfo.description}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setBookEditInfo({
                  ...bookEditInfo,
                  description: e.target.value,
                })
              }
            />
            {error?.description ? (
              <Form.Text className="text-danger">{error.description}</Form.Text>
            ) : null}
          </Form.Group>
          <Form.Group className="mb-3" controlId="quantity">
            <Form.Label>
              Quantity<span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="number"
              min="1"
              placeholder="Quantity"
              value={bookEditInfo.quantityInStock}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setBookEditInfo({
                  ...bookEditInfo,
                  quantityInStock: e.target.value,
                })
              }
            />
            {error?.quantityInStock ? (
              <Form.Text className="text-danger">
                {error.quantityInStock}
              </Form.Text>
            ) : null}
          </Form.Group>
          <Form.Group className="mb-3 d-flex" controlId="price">
            <div className="me-3 flex-fill">
              <Form.Label>
                Buy Price<span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="number"
                min="0.1"
                placeholder="Buy Price"
                value={bookEditInfo.buyPrice}
                step="0.01"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setBookEditInfo({
                    ...bookEditInfo,
                    buyPrice: e.target.value,
                  })
                }
              />
              {error?.buyPrice ? (
                <Form.Text className="text-danger">{error.buyPrice}</Form.Text>
              ) : null}
            </div>
            <div className="flex-fill">
              <Form.Label>
                Selling Price<span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="number"
                min="0.1"
                placeholder="Selling Price"
                value={bookEditInfo.sellingPrice}
                step="0.01"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setBookEditInfo({
                    ...bookEditInfo,
                    sellingPrice: e.target.value,
                  })
                }
              />
              {error?.sellingPrice ? (
                <Form.Text className="text-danger">
                  {error.sellingPrice}
                </Form.Text>
              ) : null}
            </div>
          </Form.Group>
          <Form.Group className="mb-3" controlId="quantity">
            <Form.Label>ISBN</Form.Label>
            <Form.Control
              type="number"
              min="0"
              placeholder="ISBN"
              value={bookEditInfo.isbn || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setBookEditInfo({
                  ...bookEditInfo,
                  isbn: e.target.value,
                })
              }
            />
            {error?.isbn ? (
              <Form.Text className="text-danger">{error.isbn}</Form.Text>
            ) : null}
          </Form.Group>
          <Form.Group className="mb-3" controlId="publisher">
            <Form.Label>Publisher</Form.Label>
            <Form.Control
              type="text"
              placeholder="Publisher"
              value={bookEditInfo.publisher}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setBookEditInfo({
                  ...bookEditInfo,
                  publisher: e.target.value,
                })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="yearOfPublication">
            <Form.Label>Publication Year</Form.Label>
            <Form.Control
              type="number"
              min="0"
              placeholder="Publication Year"
              value={bookEditInfo.yearOfPublication}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setBookEditInfo({
                  ...bookEditInfo,
                  yearOfPublication: e.target.value,
                })
              }
            />
            {error?.yearOfPublication ? (
              <Form.Text className="text-danger">
                {error.yearOfPublication}
              </Form.Text>
            ) : null}
          </Form.Group>
          <Form.Label>Dimesions</Form.Label>
          <Form.Group className="mb-3 d-flex" controlId="dimesions">
            <div className="me-3 flex-fill">
              <Form.Control
                type="number"
                min="1"
                placeholder="Width"
                value={bookEditInfo.width}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setBookEditInfo({
                    ...bookEditInfo,
                    width: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex-fill">
              <Form.Control
                type="number"
                min="0"
                placeholder="Height"
                value={bookEditInfo.height}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setBookEditInfo({
                    ...bookEditInfo,
                    height: e.target.value,
                  })
                }
              />
            </div>
          </Form.Group>
          <Form.Group className="mb-3" controlId="pages">
            <Form.Label>Pages</Form.Label>
            <Form.Control
              type="number"
              min="0"
              placeholder="Number of Pages"
              value={bookEditInfo.numberOfPages || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setBookEditInfo({
                  ...bookEditInfo,
                  numberOfPages: e.target.value,
                })
              }
            />
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button
              className={style.cancelBtn}
              type="button"
              onClick={() => prop.setShowModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained" className="float-end">
              Submit
            </Button>
          </div>
        </Form>
      </AppModal>
    </div>
  );
};

export default EditBookModal;
