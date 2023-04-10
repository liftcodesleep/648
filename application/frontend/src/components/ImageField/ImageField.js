import React, { Component, useState, useRef, createContext, useContext} from 'react'
import { Box, Button, Container, Grid, Hidden, Tab, Tabs} from '@mui/material'
import "./ImageField.css";
import Cropper from 'react-easy-crop';
import Slider from '@mui/material/Slider';
import { generateDownload } from '../utils/cropImage';
import { FilterContext } from '../Post/post';
import { styled } from '@mui/system';
import "../utils/effects.css";
import html2canvas from 'html2canvas';
import axios from 'axios';

const StyleBox = styled(Box)({
    background: '#ddd',
 
    marginBottom:'1rem',
    borderRadius:'5px',
    
    alignItems:'center',
    justifyContent:'center',
    cursor:'pointer',
    width:"50vw",
    height:'50vh'
    


})

function ImageField() { 

    const inputRef = React.useRef();
    const imgResultRef = React.useRef(null)
    const triggerFileSelect = ()=> inputRef.current && inputRef.current.click();
    const [image,setImage] = React.useState(null);
    const [croppedArea, setCroppedArea] = React.useState(null);
    const [crop, setCrop] = React.useState({x:0,y:0})
    const [zoom,setZoom] = React.useState(1);
    const { filterClass, customFilter} = useContext(FilterContext);
    const {category, setCategory} = React.useContext(FilterContext); 
    const [formData, setFormData] = React.useState({
        username: '',
        // is_reshared: false,
        image: null,
        description: '',
        category: '',
    });
    
    


    const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
        setCroppedArea(croppedAreaPixels);
        
    };
    const onSelectFile = (event) => { 
        
        if(event.target.files && event.target.files.length > 0){
            const reader = new FileReader();
            reader.readAsDataURL(event.target.files[0])
            reader.addEventListener('load', ()=>{
                setImage(reader.result);
                
            })
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
       
        generateDownload(image, croppedArea, filterClass, customFilter);
        
       
    };

    const handleDownloadImage=() => { 
    const element = imgResultRef.current;
    html2canvas(element).then((canvas) => {
    generateDownload(canvas.toDataURL('image/png'), croppedArea);
     });
    };
 
    const handleImageUpload = () => {
        const croppedImage = generateDownload(image, croppedArea, filterClass, customFilter);
        setFormData({
            ...formData,
            image: croppedImage,
        });
    };

    const handlePostButtonClick = async () => {
        try {
            const response = await axios.post('http://44.197.240.111/create_post', formData);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e, newValue) => {
        setCategory(newValue);
    };
    
    


    // const handleSubmit = async () => {
    //     const formData = new FormData();
    //     formData.append('username', 'john_d');
    //     formData.append('is_reshared', false);
    //     formData.append('image', image);
    //     formData.append('description', 'My new post');
    //     formData.append('category', 'nature');
    
    //     try {
    //       const response = await fetch('http://44.197.240.111/create_post', {
    //         method: 'POST',
    //         body: formData,
    //       });
    
    //       if (!response.ok) {
    //         throw new Error('Failed to create post');
    //       }
    
    //       // Reset the state
    //       setImage(null);
    //       setCroppedArea(null);
    //       setCrop({ x: 0, y: 0 });
    //       setZoom(1);
    //     } catch (error) {
    //       console.error(error);
    //     }
    //   };
  return (

    <div>
        <StyleBox className='container-cropper'>
                {           
                    image ? (
                    <>
                    <div sx={{
                    filter: `brightness(${filterClass.brightness}%) contrast(${filterClass.contrast}%) saturate(${filterClass.saturate}%) sepia(${filterClass.sepia}%) grayscale(${filterClass.gray}%)`,
                    my: 4,
                    }} ref={imgResultRef} className={filterClass} style={{ position:'relative', display:'flex', alignItems:"center", height:'50vh', width:'50vw'
                    }}>
                    <Cropper className={filterClass} customFilter={!filterClass && customFilter} image={image}  crop={crop} zoom={zoom} aspect={1.5} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete}/>
                    </div>
                
                    <div className='slider'>
                    <Slider min={1} max={3} step={0.1} value={zoom} onChange={(e,zoom)=> setZoom(zoom)}/>
                    </div>
                    <div className='Tabs'>
                
                    </div>
                    </>): <img src={require('../../Images/upload.jpeg')} style={{cursor:'pointer' }} onClick={triggerFileSelect}></img>
    
                } 
        </StyleBox>
        
        <input type='file' accept='image/*' ref={inputRef} style={{display:'none'}} onChange = {onSelectFile}/>

        <div className='container-form'>
            <form>
               
                <input type='text' name='description' placeholder='Description' value={formData.description} onChange={handleFormChange} />
                <input type='text' name='category' placeholder='Category' value={formData.category} onChange={handleFormChange} />
                {/* <label>
                    <input type='checkbox' name='is_reshared' checked={formData.is_reshared} onChange={() => setFormData({ ...formData, is_reshared: !formData.is_reshared })} />
                    Reshare
                </label> */}

                {/* <Tabs style={{backgroundColor:'white'}} value={category} onChange={handleChange} textColor='primary' indicatorColor='secondary'>
                    <Tab value="category" label='Categories'/>
                    
                </Tabs> */}
                {formData.image && (
                    <div className='preview-container'>
                        <img src={URL.createObjectURL(formData.image)} alt='Preview' className='preview-image' />
                    </div>
                )}
                <div className='container-buttons'>
                  
                                
                <Button variant='contained' style={{color:'white', margin: '10px'}} onClick={triggerFileSelect}>Uplaod Image</Button>
                <Button variant='contained' style={{color:'white',margin: '10px'}} onClick={onDownload}> Downlaod </Button>
                <Button variant='contained' onClick={handlePostButtonClick}>Post</Button>
                </div>
            </form>
        </div>
        
        
    </div>

    
    
  )
}

export default ImageField