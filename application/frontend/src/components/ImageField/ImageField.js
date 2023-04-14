import React, { Component, useState, useRef, createContext, useContext, useEffect} from 'react'
import { Box, Button, Container, Grid, Hidden, Tab, Tabs,TextField, MenuItem,Select,FormControl,InputLabel,} from '@mui/material'
import "./ImageField.css";
import Cropper from 'react-easy-crop';
import Slider from '@mui/material/Slider';
import getCroppedImg, { generateDownload } from '../utils/cropImage';
import { FilterContext } from '../Post/post';
import { styled } from '@mui/system';
import "../utils/effects.css";
import html2canvas from 'html2canvas';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import ImageComponent from '../ImageComponent/ImageComponent'
import Cookies from 'js-cookie';



const StyleBox = styled(Box)({
    background: '#ddd',
    marginBottom:'1rem',
    borderRadius:'5px',
    alignItems:'center',
    justifyContent:'center',
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
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const { filterClass, customFilter} = useContext(FilterContext);
    const {category, setCategory} = React.useContext(FilterContext); 
    const [formData, setFormData] = React.useState({
        username: '',
        is_reshared: false,
        image: null,
        description: '',
        category: '',
        redirectToReferrer: false,
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
        const download = generateDownload(image, croppedArea, filterClass, customFilter);
        console.log({download});

    };


 
    const handleImageUpload = () => {
        const croppedImage = generateDownload(image, croppedArea, filterClass, customFilter);
        setFormData({
            ...formData,
            image: croppedImage,
        });
    };
    

    // const handlePostButtonClick = async () => {
    //     try {
    //       const croppedImage = generateDownload(image, croppedArea, filterClass, customFilter);
    //       const file = await fetch(croppedImage).then((r) => r.blob());
    //       const formData = new FormData();
    //     // //   formData.append('username', formData.username);
    //     //   formData.append('is_reshared', formData.is_reshared);
    //       formData.append('image', file);
    //       formData.append('description', formData.description);
    //       formData.append('category', formData.category);
      
    //       const response = await axios.post('http://44.197.240.111/create_post', formData);
    //       console.log(response.data);
    //     } catch (error) {
    //       console.error(error);
    //     }
    //   };
      
      const handleCreatePost = async () => {
        try {
          const croppedImage = await generateDownload(image, croppedArea, filterClass, customFilter);
          
          console.log({croppedImage});
          const data = {
            username: Cookies.get('username'),
            is_reshared: formData.is_reshared,
            image: croppedImage,
            description: formData.description,
            category: formData.category,
          };
          const response = await axios.post("http://127.0.0.1:8000/create_post", data);
          console.log(response.data);
          setFormData({
            username: Cookies.get('username'),
            is_reshared: false,
            image: null,
            description: '',
            category: '',
            redirectToReferrer: true,
            });
            } catch (err) {
            console.log(err);
            }
            };
            
      
    const handleChange = (e, newValue) => {
        setCategory(newValue);
    };
    

    const fetchCategories = async () => {
        try {
          const response = await axios.get('http://127.0.0.1:8000/fetch_categories');
          console.log(response.data);
          if (response.data.status === 'SUCCESS') {
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
            category:event.target.value,
        });
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

    <div style={{alignItems:'center', justifyContent:'center'}}>
      
        <StyleBox className='container-cropper'>

                {           
                    image ? (
                    <>
                    <div sx={{
                    filter: `brightness(${filterClass.brightness}%) contrast(${filterClass.contrast}%) saturate(${filterClass.saturate}%) sepia(${filterClass.sepia}%) grayscale(${filterClass.gray}%)`,
                    my: 4,
                    }} ref={imgResultRef} className={filterClass} customFilter={!filterClass && customFilter} style={{ position:'relative', display:'flex', alignItems:"center", height:'50vh', width:'50vw'
                    }}>
                    <Cropper  image={image}  crop={crop} zoom={zoom} aspect={1.5} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete}/>
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
        
            <div className='container-form' >
            {image? (<>
            <form style={{alignItems:'center', justifyContent:'center',marginRight:'80px'}} >
            <input type="text" id="username" name="username" value={formData.username} onChange={handleFormChange}></input>
           <textarea  style={{height:"10vh", width:'45vw', borderRadius:'10px', verticalAlign:'text-top', padding:'10px', marginBottom:'10px'}} type='text' name='description' placeholder='Description' value={formData.description} onChange={handleFormChange}></textarea> 
           {/* <input type='text' name='category' placeholder='Category' value={formData.category} onChange={handleFormChange} /> */}
           <div style={{display:'flex'}}>
           <label style={{padding:'5px', backgroundColor:'white', borderRadius:'5px'}} htmlFor="categories" >Select a category</label>
           <select style={{margin:'10px', marginLeft:'20px', borderRadius:'3px'}} id="categories" value={selectedCategory} onChange={handleCategoryChange}>
                <option value="">-- Select --</option>
                {categories.map(category => (
                <option key={category} value={category}>{category}</option>
                ))}
            </select>
            </div>
           {formData.image && (
                <div className='preview-container'>
                    <img src={URL.createObjectURL(formData.image)} alt='Preview' className='preview-image' />
                </div>
            )}
            
           

          
           <div className='container-buttons' style={{alignItems:'center', justifyContent:'center'}}>             
          
           <Button variant='contained' style={{color:'white',margin: '10px'}} onClick={onDownload}> Downlaod </Button>
           <Button variant='contained' onClick={handleCreatePost}>Post</Button>
           </div>
       </form>
       </>):<Button variant='contained' style={{color:'white', margin: '10px'}} onClick={triggerFileSelect}>Uplaod Image</Button>
            }
        
            {/* ):  <Button variant='contained' style={{color:'white', margin: '10px'}} onClick={triggerFileSelect}>Uplaod Image</Button>} */}
       
    </div>
            
       
        
        
    </div>

    
    
  )
     
}

export default ImageField