import React, {
  Component,
  useState,
  useRef,
  createContext,
  useContext,
} from "react";
import { Link } from "react-router-dom";
import { Box, Button, Container, Grid, Tab, Tabs } from "@mui/material";
import "./post.css";
import Cropper from "react-easy-crop";
import Slider from "@mui/material/Slider";
import { generateDownload } from "../utils/cropImage";

import Filters from "../Filters/Filters";
import FilterEffect from "../FilterEffects/FilterEffect";
import Edit from "../EditPhoto/Edit";
import ImageField from "../ImageField/ImageField";
import ImageComponent from "../ImageComponent/ImageComponent";

export const FilterContext = createContext();
export default function Post() {
  // const inputRef = React.useRef();
  // const triggerFileSelect = ()=> inputRef.current.click();
  // const [image,setImage] = React.useState(null);
  // const [croppedArea, setCroppedArea] = React.useState(null);
  // const [crop, setCrop] = React.useState({x:0,y:0})
  // const [zoom,setZoom] = React.useState(1);
  const [tabFilter, setTabFilter] = React.useState("filter");
  const [filterClass, setFilterClass] = useState("");
  const [customFilter, setCustomFilter] = useState({
    contrast: 100,
    brightness: 100,
    saturate: 100,
    sepia: 0,
    gray: 0,
  });

  const value = {
    tabFilter,
    setTabFilter,
    filterClass,
    setFilterClass,
    customFilter,
    setCustomFilter,
  };

  // const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
  //     setCroppedArea(croppedAreaPixels);

  // };

  // const onSelectFile = (event) => {

  //     if(event.target.files && event.target.files.length > 0){
  //         const reader = new FileReader();
  //         reader.readAsDataURL(event.target.files[0])
  //         reader.addEventListener('load', ()=>{
  //             setImage(reader.result);
  //         })
  //     }

  // };

  // const onDownload = () => {
  //     generateDownload(image, croppedArea);

  // };

  return (
    <FilterContext.Provider value={value}>
      <div>
        <Link to="/">
          <img
            src={require("../../Images/picturePerfect.jpg")}
            style={{ height: "120px", padding: "2px" }}
          ></img>
        </Link>
      </div>
      <Container sx={{ marginTop: "2rem", marginBottom: "4rem" }}>
        <Grid container spacing={10}>
          <Grid item xs={12} md={8}>
            {" "}
            <ImageField />{" "}
          </Grid>
          <Grid item xs={12} md={3} marginTop="1rem">
            <Filters />
            {tabFilter === "filter" ? <FilterEffect /> : <Edit />}
          </Grid>

          <Grid />

          {/* <div className='container-cropper'> */}
          {/* {           
                image ? (
                <>
                <div className='cropper'>
                <Cropper image={image} crop={crop} zoom={zoom} aspect={1.5} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete}/>
               
               </div>
               
                <div className='slider'>
                <Slider min={1} max={3} step={0.1} value={zoom} onChange={(e,zoom)=> setZoom(zoom)}/>
                </div>
                <div className='Tabs'>
               
                </div>
                </>): <img src={require('../../Images/upload.jpeg')} style={{cursor:'pointer'}} onClick={triggerFileSelect}></img>
 
            }  */}

          {/* </div> */}

          {/* <div className='container-buttons'>
            <input type='file' accept='image/*' ref={inputRef} style={{display:'none'}} onChange = {onSelectFile}/>
            <Button type='submit' variant='container' style={{color:'white', margin: '10px'}} onClick={triggerFileSelect}>Uplaod Image</Button>
            <Button type='submit' variant='container' style={{color:'white',margin: '10px'}} onClick={onDownload}> Downlaod </Button>
            <Button type='submit' variant='container' style={{color:'white',margin: '10px'}}>Post</Button>
            </div> */}
        </Grid>
      </Container>
    </FilterContext.Provider>
  );
}
