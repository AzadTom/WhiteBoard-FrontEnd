import { FaRegCircle } from "react-icons/fa";
import { GoPencil } from "react-icons/go";
import { BiRectangle } from "react-icons/bi";


import { FaArrowPointer } from "react-icons/fa6";
import { FaArrowRightLong } from "react-icons/fa6";
import { IoMdDownload } from "react-icons/io";
import { GrGallery } from "react-icons/gr";



import React from "react";
import { ACTIONS } from "../utils/constant";


interface Props{
  handleExport:()=>void,
  action:string,
  setAction:(action:string)=>void,
  fillcolor:string,
  setFillColor:(fillcolor:string)=>void,
  handleFileChange : (event: React.ChangeEvent<HTMLInputElement>)=> void
}


const Controls:React.FC<Props> = ({handleExport,action,setAction,fillcolor,setFillColor,handleFileChange}) => {


 
  return (
    <div className="parent-container">

      <ul className="controls-container">
        <li className={action== ACTIONS.SELECT? "active":""} onClick={()=> setAction(ACTIONS.SELECT)}> <FaArrowPointer/></li>
        <li className={action == ACTIONS.RECTANGLE? "active":""} onClick={()=> setAction(ACTIONS.RECTANGLE)}> <BiRectangle /></li>
        <li className={action== ACTIONS.CIRCLE ? "active":""} onClick={()=> setAction(ACTIONS.CIRCLE)}> <FaRegCircle /></li>
        <li className={action == ACTIONS.SCRIBBLE?"active":""} onClick={()=> setAction(ACTIONS.SCRIBBLE)}> <GoPencil /></li>
        <li className={action == ACTIONS.ARROW?"active":""} onClick={()=> setAction(ACTIONS.ARROW)}> <FaArrowRightLong /></li>
        <li className='input-color'><input type="color" value={fillcolor}  onChange={(e:React.ChangeEvent<HTMLInputElement>)=> setFillColor(e.target.value)}/> </li>
        <li> <label htmlFor="image"><GrGallery/></label>  <input id='image' type="file"  style={{display:"none"}} onChange={handleFileChange} accept='image/*'/> </li>
        <li onClick={handleExport}> <IoMdDownload /></li>
       
      </ul>
    
    </div>
  )
}

export default Controls;


