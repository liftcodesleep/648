import React, {
  Component,
  useState,
  useRef,
  createContext,
  useContext,
  useEffect,
} from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Hidden,
  Tab,
  Tabs,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  ButtonGroup,
} from "@mui/material";
import "./ImageField.css";
import Cropper from "react-easy-crop";
import Slider from "@mui/material/Slider";
import { generateDownload, croppedImg } from "../utils/cropImage";
import { FilterContext } from "../Post/post";
import { styled } from "@mui/system";
import "../utils/effects.css";
import axios from "axios";
import Cookies from "js-cookie";
import upload from "../../Images/upload.jpeg";
import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";
import DoneIcon from "@mui/icons-material/Done";
import CropIcon from "@mui/icons-material/Crop";
import DownloadIcon from "@mui/icons-material/Download";
import FileUploadIcon from "@mui/icons-material/FileUpload";
function ImageField() {
  const inputRef = React.useRef();

  const imgResultRef = React.useRef(null);
  const triggerFileSelect = () => inputRef.current && inputRef.current.click();
  const [image, setImage] = React.useState(null);
  const [croppedArea, setCroppedArea] = React.useState(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState("");
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [error, setError] = useState(null);
  const [isCropClicked, setIsCropClicked] = useState(false);
  const [isDoneClicked, setIsDoneClicked] = useState(false);

  const { filterClass, customFilter } = useContext(FilterContext);
  const { category, setCategory } = React.useContext(FilterContext);
  const [formData, setFormData] = React.useState({
    username: Cookies.get("username"),
    is_reshared: false,
    image: null,
    description: "",
    category: "",
  });

  const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  };

  const onSelectFile = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.addEventListener("load", () => {
        setImage(reader.result);
      });
    }
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onDownload = () => {
    const download = generateDownload(
      image,
      croppedArea,
      filterClass,
      customFilter
    );
  };
  const handleDownload = () => {
    domtoimage
      .toBlob(imgResultRef.current)
      .then(function (blob) {
        saveAs(blob, "download.png");
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const dataURL = reader.result;
          setImage(dataURL);
        };
      })
      .catch(function (error) {
        console.error("oops, something went wrong!", error);
      });
  };

  const onDone = () => {
    domtoimage
      .toBlob(imgResultRef.current)
      .then(function (blob) {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const dataURL = reader.result;
          setImage(dataURL);
        };
      })
      .catch(function (error) {
        console.error("oops, something went wrong!", error);
      });
  };

  const handleImageUpload = () => {
    const croppedImage = generateDownload(
      image,
      croppedArea,
      filterClass,
      customFilter
    );
    setFormData({
      ...formData,
      image: croppedImage,
    });
  };
  const completeCrop = async () => {
    const cropImg = await croppedImg(
      image,
      croppedArea,
      filterClass,
      customFilter
    );
    const dataUrl = cropImg.toDataURL("image/png");
    setImage(dataUrl);
    setIsCropClicked(false);
  };

  const onPost = async () => {
    const imageData = new FormData();
    imageData.append("username", Cookies.get("username"));
    imageData.append("is_reshared", false);
    imageData.append("image", dataURLtoFile(image, "croppedImage.jpeg"));
    imageData.append("description", formData.description);
    imageData.append("category", formData.category);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/create_post",
        imageData
      );
      if (response.data.status === "SUCCESS") {
        window.location.href = "/user-profile";
      } else {
        // show error message
        setError(response.data.message);
      }
      setFormData({
        username: "",
        is_reshared: false,
        image: null,
        description: "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  function dataURLtoFile(dataUrl, filename) {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  const handleChange = (e, newValue) => {
    setCategory(newValue);
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/fetch_categories"
      );
      console.log(response.data);
      if (response.data.status === "SUCCESS") {
        setCategories(response.data.categories);
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setFormData({
      ...formData,
      category: event.target.value,
    });
  };

  const StyledImage = styled("img")((props) => ({
    maxHeight: "70vh",

    objectFit: "contain",
    filter: `contrast(${props.customFilter.contrast}%) brightness(${props.customFilter.brightness}%) saturate(${props.customFilter.saturate}%) sepia(${props.customFilter.sepia}%) grayScale(${props.customFilter.gray}%)`,
    "@media screen and (max-width: 768px)": {
      height: "auto",
      display: "block",
      margin: "0 auto",
      width: "100%",
    },
    "@media screen and (max-width: 450px)": {
      height: "auto",
      display: "block",
      margin: "0 auto",
      width: "100%",
    },
  }));

  return (
    <div className="w-full justify-center items-center flex flex-col gap-4">
      <Box
        className="cropper-container w-full"
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        {image ? (
          <>
            {isCropClicked ? (
              <div className="w-full">
                <div
                  id="image-box"
                  className={filterClass}
                  customFilter={!filterClass && customFilter}
                >
                  <Cropper
                    image={image}
                    crop={crop}
                    zoom={zoom}
                    aspect={2}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                </div>
                <div className="slider">
                  <Slider
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e, zoom) => setZoom(zoom)}
                  />
                </div>

                {isCropClicked && (
                  <div className="flex justify-center items-center">
                    <Button
                      onClick={completeCrop}
                      startIcon={<DoneIcon />}
                      sx={{ textTransform: "none", color: "white" }}
                    >
                      Done
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <StyledImage
                ref={imgResultRef}
                src={image}
                className={filterClass}
                customFilter={!filterClass && customFilter}
              ></StyledImage>
            )}

            <div className="Tabs"></div>
          </>
        ) : (
          <img
            className="upload-img"
            src={upload}
            onClick={triggerFileSelect}
          ></img>
        )}
      </Box>

      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        style={{ display: "none" }}
        onChange={onSelectFile}
      />

      <div className="container-form w-full px-16">
        {image ? (
          <>
            <form className="image-form w-full">
              {/* <input type="text" id="username" name="username" value={formData.username} onChange={handleFormChange}></input> */}
              <textarea
                className="text-area w-full"
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleFormChange}
              ></textarea>
              {/* <input type='text' name='category' placeholder='Category' value={formData.category} onChange={handleFormChange} /> */}

              <div className="select-filter-container">
                <span className="label">Select a Category</span>
                <select
                  className="select-filters "
                  id="categories"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  <option value="">-- Select --</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              {formData.image && (
                <div className="preview-container">
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt="Preview"
                    className="preview-image"
                  />
                </div>
              )}

              <div className="buttons-container">
                <Button variant="contained" onClick={handleDownload}>
                  {" "}
                  <DownloadIcon />{" "}
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setIsCropClicked(!isCropClicked)}
                >
                  <CropIcon />
                </Button>

                <Button
                  variant="contained"
                  style={{ color: "white" }}
                  onClick={triggerFileSelect}
                >
                  <FileUploadIcon />
                  Upload Image
                </Button>
                <Button
                  variant="contained"
                  style={{ color: "white" }}
                  onClick={onDone}
                >
                  Done
                </Button>
              </div>
              <Button
                style={{ margin: "10px", float: "right" }}
                variant="contained"
                onClick={onPost}
              >
                {" "}
                Post
              </Button>
            </form>
          </>
        ) : (
          <Button
            variant="contained"
            style={{ color: "white", margin: "10px" }}
            onClick={triggerFileSelect}
          >
            Upload Image
          </Button>
        )}

        {/* ):  <Button variant='contained' style={{color:'white', margin: '10px'}} onClick={triggerFileSelect}>Upload Image</Button>} */}
      </div>

      {error && <div>{error}</div>}
    </div>
  );
}

export default ImageField;
