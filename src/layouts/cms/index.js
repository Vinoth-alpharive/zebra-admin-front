import React,{useState,useEffect,useRef} from 'react'
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { ToastContainer, toast } from 'react-toastify'
import './index.css'
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
// Material Dashboard 2 React components
import { Theme, useTheme } from '@mui/material/styles';
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import MDTypography from "components/MDTypography";
import Icon from "@mui/material/Icon";
import Skeleton from "@mui/material/Skeleton";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Editor } from "react-draft-wysiwyg";
import copy from "copy-to-clipboard";
import axios from 'axios'
import {
  EditorState,
  convertToRaw,
  ContentState,
  convertFromHTML,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from 'html-to-draftjs';
import { endpoints } from "../../auth/url";
import usercalls from "../../auth/endpoints";
import { useFormik } from "formik";
import * as yup from "yup";
import { Button } from "bootstrap";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

function getStyless(name, docName, theme) {
  return {
    fontWeight:
      docName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const validationSchemapass = yup.object().shape({
  oldpassword: yup.string().required("Password is required"),
  newpassword: yup
    .string()
    .required("No password provided.")
    .min(8, "Password is too short - should be 8 chars minimum.")
    .matches(/[a-zA-Z]/, "Password can only contain Latin letters."),
  confirmpassword: yup.string().when("newpassword", {
    is: (val) => (val && val.length > 0 ? true : false),
    then: yup
      .string()
      .oneOf(
        [yup.ref("newpassword")],
        "Confrim Password need to be the same as New Password"
      ),
  }),
});
const validationSchemaDoc = yup.object().shape({
    name: yup.string().required("name is required")
  });

const validationSchema = yup.object().shape({
  token: yup.string().required("Required"),
});

const Index = () => {

  const ref = useRef(null);

  
  const path = usercalls();
    const [openDoc, setOpenDoc] = React.useState(false);
    const [editDoc, setEditDoc] = useState(false)
    const handleOpenDoc = () => setOpenDoc(true);
    const [aboutusData, setAboutusData] = useState("");
    const [docName, setDocName] = React.useState([]);
    const [imageUrl, setImageUrl] = useState(null)
    const [gameType, setGameType] = useState("select")
    const [titleContent, setTitleContent] = useState(null)
    const [descriptionContent, setDescriptionContent] = useState(null)
    const [imageContent, setImageContent] = useState(null)
    const [documentContent, setDocumentContent] = useState(null)
    var formdata = new FormData();
    
    const [editorState, setEditorState] = useState(() =>
  
    EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(aboutusData)))
  );


  

    const handleCloseDoc = () => setOpenDoc(false);

    const handleChange = (e) => {
      };

      const styleAbout = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 1000,
        borderRadius: "10px",
        height: 600,
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        padding: "20px 0",
      };



      const handleSubmit = async(e)=>{
        try{
         

         
// const draftHtml =  draftToHtml(convertToRaw(editorState.getCurrentContent()));
setDocumentContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))

        }
        catch(error){
alert(error.message);
        }
      }

      useEffect(()=>{

      },[])

      const uploadDocument = async () => {
        handleOpenDoc();
      };

      const handleEditorChange = (state) => {
        setEditorState(state);
        setDocumentContent(draftToHtml(convertToRaw(state.getCurrentContent())))
        // sendContent();
      };

      const handleEdit =()=>{
        setEditDoc(true)
      }

      const handleImageUpload = async(e)=>{

 formdata.append("image", e.target.files[0]);

 const urlimage = endpoints.upload;
      const validateToken = sessionStorage.getItem('accesstoken');
      try {
        const data = await axios.post(urlimage, formdata, {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            'Authorization': `${validateToken}`,
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          },
        });
        if (data.status === 200) {
          // const imageData = (data?.data?.data)
          // console.log(data?.data)
          // setImageUrl(data.data.data.Location);
          // console.log(imageData)
          setImageUrl(data?.data?.data)
          // return data.data.data.Location;
        }
      }
      catch(error){
        alert(error.message)
      }
      }
const [imageUploadData, setImageUploadData] = useState(null)
      const handleBlogImageUpload = async(e)=>{
      
 formdata.append("image", e.target.files[0]);
setImageUploadData(URL.createObjectURL(e.target.files[0]))
 

 const urlimage = endpoints.upload;
      const validateToken = sessionStorage.getItem('accesstoken');
      try {
        const data = await axios.post(urlimage, formdata, {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            'Authorization': `${validateToken}`,
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          },
        });
        if (data.status === 200) {
          setImageContent(data.data);
          // return data.data.data.Location;
        }
      }
      catch(error){
        alert(error.message)
      }
      }

      const copyToClipboard = () => {
        copy(imageUrl);
     }

const handleTitle = (e)=>{
setTitleContent(e.target.value)
}

const handleTextAreaDescription = (e)=>{
setDescriptionContent(e.target.value)
}


const handleSubmitNews = async()=>{
  try{

    console.log(documentContent)

    if(!titleContent){
      return  toast.error("Please fill the title", {
        duration: 3000,
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      })
    }
    if(!descriptionContent){
      return toast.error("Please fill the description", {
        duration: 3000,
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      })
    }
    if(!imageContent){
      return toast.error("Please select the image", {
        duration: 3000,
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      })
    }
    if(gameType==='select'){
      return toast.error("Please select the game type", {
        duration: 3000,
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      })
    }
    
    if(!documentContent){
     return toast.error("Please fill the document", {
        duration: 3000,
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      })
    }



const url = endpoints.newsUpload;
const payload ={
  "meta_title_content":titleContent,
  "meta_title_description":descriptionContent,
  "meta_image_content":imageContent,
  "game_type":gameType,
  "document_content":documentContent
}

const data = await path.postCall({ url, payload });
const result = await data.json();

toast.success("File uploaded Successfully", {
  duration: 3000,
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'colored',
})
setIsAddNewOpen(false)
window.location.reload()


  }
  catch(error){
alert(error)
  }
}
const [newsContentData, setNewsContentData] = useState([])
const [editNewsContentData, setEditNewsContentData] = useState(false)
const [isAddNewOpen,setIsAddNewOpen] = useState(false)
const [currentId, setCurrentId] = useState(null)

useEffect(()=>{
const getData= async()=>{
try{
  const urlimage = endpoints.newsContent;
  const validateToken = sessionStorage.getItem('accesstoken');
    const data = await axios.get(urlimage, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        'Authorization': `${validateToken}`,
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      },
    });
    if (data.status === 200) {
      // console.log(data?.data)
      setNewsContentData(data?.data?.data)
      // setImageUrl(data);
      // return data.data.data.Location;
    }
}
catch(error){
  return toast.error(error.message, {
    duration: 3000,
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'colored',
  })
}
}
getData()
},[])


const handleDeleteNews = async(userId)=>{
  try{
    const urlimage = endpoints.deleteNewsContent;
    const validateToken = sessionStorage.getItem('accesstoken');
      const data = await axios.post(urlimage, {_id:userId},{
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          'Authorization': `${validateToken}`,
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        },
      });
      if (data.status === 200) {
        // console.log(data?.data)
        setNewsContentData(data?.data?.data)
        // setImageUrl(data);
        // return data.data.data.Location;
      }
  }
  catch(error){
    return toast.error(error.message, {
      duration: 3000,
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
    })
  }
}

const [htmlContent, setHtmlContent] = useState(null)

const handleEditNews = async(item)=>{
  try{
    
setCurrentId(item?._id)
setEditNewsContentData(true)
setTitleContent(item?.meta_title_content)
setDescriptionContent(item?.meta_title_description)
setImageContent(item?.meta_image_content)
setGameType(item?.game_type)

setHtmlContent(item?.document_content)
const blocksFromHtml = htmlToDraft(item?.document_content);
const { contentBlocks, entityMap } = blocksFromHtml;
const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
const editorStates = EditorState.createWithContent(contentState);
// console.log(editorStates)
setEditorState(editorStates)
setImageUploadData(item?.meta_image_content)
// setDocumentContent(editorStates)

setDocumentContent(draftToHtml(convertToRaw(editorStates.getCurrentContent())))
  }
  catch(error){
    return toast.error(error.message, {
      duration: 3000,
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
    })
  }
}


console.log(documentContent)


const handleEditUpdateNews = async()=>{
  try{
    
    if(!titleContent){
      return  toast.error("Please fill the title", {
        duration: 3000,
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      })
    }
    if(!descriptionContent){
      return toast.error("Please fill the description", {
        duration: 3000,
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      })
    }
    if(!imageContent){
      return toast.error("Please select the image", {
        duration: 3000,
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      })
    }
    if(gameType==='select'){
      return toast.error("Please select the game type", {
        duration: 3000,
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      })
    }
    
    if(!documentContent){
     return toast.error("Please fill the document", {
        duration: 3000,
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      })
    }
    const urlimage = endpoints.editNewsContent;
    const validateToken = sessionStorage.getItem('accesstoken');

    const payload ={
      "_id":currentId,
      "meta_title_content":titleContent,
      "meta_title_description":descriptionContent,
      "meta_image_content":imageContent,
      "game_type":gameType,
      "document_content":documentContent?documentContent:htmlContent
    }
      const data = await axios.post(urlimage, payload,{
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          'Authorization': `${validateToken}`,
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        },
      });
      if (data.status === 200) {
        // console.log(data?.data)
        setNewsContentData(data?.data?.data)

        toast.success("File uploaded Successfully", {
          duration: 3000,
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        })
        setIsAddNewOpen(false)
        // window.location.reload()
        // setImageUrl(data);
        // return data.data.data.Location;
      }

  }
  catch(error){
    return toast.error(error.message, {
      duration: 3000,
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
    })
  }
}

// useEffect(()=>{

//   const data = async()=>{
//     const a  = await fetch("http://localhost:5000/get-file/newfile-pub5ed06b51-2fb3-4232-938d-a0e3d2695b65.js");
//     console.log(await a.json());
//   }
//   data()
 
// },[])

// console.log( window.Car("Ford", 2014))

  return (
    <DashboardLayout>
    <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
        />
  <DashboardNavbar />
 <div>
    <h2>Content Management System</h2>
  
    {
      isAddNewOpen ?
      <>
       <div style={{display:'flex',alignItems:'center',gap:'10px'}} className="imageURL">
      <h3>Image URL Generator:</h3>
      <div >
      <input type="file" id="upload" hidden onChange={handleImageUpload} accept="image/png, image/jpeg"/>
      <label for="upload" className='chooseFile'>Choose file</label>
      </div>
      {
        imageUrl &&
        <div className='imageResult'  style={{display:'flex',alignItems:'center',padding:'4px 10px'}}>
      <h6 >{imageUrl}</h6> &nbsp;&nbsp;&nbsp;
      <ContentCopyIcon style={{cursor:'pointer'}} onClick={copyToClipboard}/>
      </div>
      }
      
    </div>
    
    <div className='upload_news_container'>
        <h3 style={{textAlign:'center'}}>Upload News Content</h3>
        <br/>

        <div className='flex_container'>
        <h4 style={{width:'200px'}}>Game:</h4>
        <Select
                    style={{ height: '45px' }}
                    labelId="Games"
                    id="games"
                    name={gameType}
                    value={gameType}
                    label="Tournament"
                    onChange={(e) => {
                      setGameType(e.target.value)
                    }}
                  >
                    <MenuItem value="select">Select Game</MenuItem>
                 
                      <MenuItem value='cricket' style={{gap:"15px"}}>Cricket</MenuItem>
                      <MenuItem value='football' style={{gap:"15px"}}>Football</MenuItem>
        </Select>
        </div>
       
        <br/>
        <div className='flex_container_description'>
        <h4 style={{width:'200px'}}>Card Title:</h4>
        <input type="text" className='title_content' onChange={handleTitle} value={titleContent}/>
        </div>
        <br/>
        <div className='flex_container_description'>
        <h4 style={{width:'200px'}}>Card Description:</h4>
        <textarea type="text" className='textarea_description' onChange={handleTextAreaDescription} value={descriptionContent}/>
        </div>
        <br/>
        <div className='flex_container'>
        <h4 style={{width:'200px'}}>Card Image:</h4>
        
        {/* {
          imageUploadData?

          <img src={imageUploadData} alt="uploadImage" style={{width:'500px',height:'500px',borderRadius:'10px'}}/>
          :
          <>
          <input type="file" id="blog" hidden onChange={handleBlogImageUpload} accept="image/png, image/jpeg"/>
        <label for="blog" className='chooseFile'>Choose file</label>
          </>
        } */}
 <img src={imageUploadData} alt="uploadImage" style={{width:'500px',height:'500px',borderRadius:'10px'}}/>
<input type="file" id="blog" hidden onChange={handleBlogImageUpload} accept="image/png, image/jpeg"/>
        <label for="blog" className='chooseFile'>Choose file</label>
       
        </div>
        <br/>
        <div className='flex_container'>
  <h4 style={{width:'200px'}}>Upload Document:</h4>
  {/* <button onClick={uploadDocument} className='chooseFile'>Upload</button> */}
 
  <Editor
                editorState={editorState}
                defaultEditorState={editorState}
                onEditorStateChange={(editorState) => {
                  setEditorState(editorState);
                  handleEditorChange(editorState);
                }}
                // onEditorStateChange={handleEditorChange}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                editorStyle={{ border: "1px solid black", height: 600 }}
                wrapperStyle={{ width: 1200, border: "1px solid black" }}
              />
      
</div>
{
  editNewsContentData?
  <div>
<button className='chooseFile submitContent' onClick={()=>handleEditUpdateNews()}>Submit</button>
&nbsp;&nbsp;
<button className='chooseFile submitContent' onClick={()=>setIsAddNewOpen(false)} >Cancel</button>
</div>
  :
  <div>
    <button className='chooseFile submitContent' onClick={handleSubmitNews} >Submit</button>
    &nbsp;&nbsp;
<button className='chooseFile submitContent' onClick={()=>setIsAddNewOpen(false)} >Cancel</button>
</div>
}

    </div>
      </>:

<>
<div className='addBtnContainer'>
<button className='addNewBtn' onClick={()=>setIsAddNewOpen(true)}>Add New</button>
</div>
 <div className='list_news_container'>
<h3 style={{textAlign:'center'}}>List News Content</h3>
<br/>
{
  newsContentData?


  <table className='table_container_cms'>
    <thead>
      <tr className='table_heading_row'>
        <td style={{fontWeight:'800',textAlign:'center',padding:'10px'}}>SI. No.</td>
        <td style={{fontWeight:'800',textAlign:'center',padding:'10px'}}>Image</td>
        <td style={{fontWeight:'800',textAlign:'center',padding:'10px'}}>Title</td>
        <td style={{fontWeight:'800',textAlign:'center',padding:'10px'}}>Description</td>
        <td style={{fontWeight:'800',textAlign:'center',padding:'10px'}}>Status</td>
      </tr>
    </thead>
   { newsContentData?.map((item,i)=>{
  return(  <tbody>
      <tr className='table_heading_row'>
        <td style={{textAlign:'center'}}>{i+1}</td>
        <td style={{display:'flex',justifyContent:'center',alignItems:'center',padding:'20px'}}>
          <img src={item?.meta_image_content} alt={item?.meta_title_content} style={{height:'100px',width:'100px',borderRadius:'5px'}}/> 
          </td>
        <td className="metaTitle">{item?.meta_title_content.slice(0,20)}...</td>
        <td className='metaDescription'>{item?.meta_title_description.slice(0,50)}...</td>
        <td>
          <div  className='btn_container'>
        <button onClick={()=>{handleEditNews(item);setIsAddNewOpen(true)}} className="editNews">
        <Icon fontSize="small" sx={{ mt: -0.25 }}>
              edit
            </Icon>
        </button>
          <button onClick={()=>handleDeleteNews(item._id)} className="deleteNews">
          <Icon fontSize="small" sx={{ mt: -0.25 }}>
              delete
            </Icon>
          </button>
          </div>
        </td>
      </tr>
    </tbody>)
    })}
  </table>
  :
  <h3>No Data Found!</h3>
}
  
 </div>
</>
    }
    
   

   
    
  

 </div>

                    

</DashboardLayout >
  )
}

export default Index