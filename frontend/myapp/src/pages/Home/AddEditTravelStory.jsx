import React, { useState } from 'react'
import { MdClose,MdAdd, MdUpdate, MdDeleteOutline } from 'react-icons/md'
import DateSelector from '../../component/Input/DateSelector'
import ImageSelector from '../../component/Input/ImageSelector';
import TagInput from '../../component/Input/TagInput';
import uploadImage from '../../utils/uploadImage';
import axiosInstance from '../../utils/axiosInstance';
import moment from 'moment';
export default function AddEditTravelStory({
    storyInfo,
    type,
    onClose,
    getStories,
}) {
    const[title,setTitle]=useState(storyInfo?.title || ' ');
    const [storyImg,setStoryImg]=useState(storyInfo?.imageUrl || null);
    const [story, setStory]=useState(storyInfo?.story || '')
    const [visitedLocation,setVisitedLocation]=useState(storyInfo?.visitedLocation || [])
    const [visitedDate, setvisitedDate]=useState(storyInfo?.visitedDate ||null);
    const [error, setError]=useState("")


    
    const addNewStory= async()=>{

        try{
            let imageUrl ="";

            if(storyImg){
                const imgUploadRes = await uploadImage(storyImg);

                imageUrl=imgUploadRes.imageUrl || " ";
            }

            const response = await axiosInstance.post('/add-travel-story',{
                title,
                story,
                imageUrl:imageUrl||" ",
                visitedLocation,
                visitedDate: visitedDate ?
                moment(visitedDate).valueOf()
                : moment() .valueOf(),
            });

            if(response.data && response.data.story){
                getStories();
                onClose();
            }
        }catch(error){
            if(
                error.response &&
                error.response.data &&
                error.response.data.message
            ){
                setError('unexpected error')
            }
        }
    }

    const updateStory = async () => {
        const postData = {
            title,
            story,
            imageUrl: storyInfo.imageUrl || "defaultImageUrl.jpg",
            visitedLocation,
            visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf(),
        };
    
        const storyId = storyInfo._id;
    
        try {
            let updatedPostData = { ...postData };
    
            if (typeof storyImg === "object") {
                const imgUploadRes = await uploadImage(storyImg);
                updatedPostData = { ...updatedPostData, imageUrl: imgUploadRes.imageUrl || " " };
            }
    
            const response = await axiosInstance.put(`/edit-story/${storyId}`, updatedPostData);
    
            if (response.data?.story) {
                getStories();
                onClose();
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "An unexpected error occurred. Please try again.";
            setError(errorMessage);
        }
    };
    
//    const handeladdorupdateClick=()=>{

//    }
   const handelDeleteStoryImg=async ()=>{

   }
  return (
    <div className='relative'>
      <div className='flex items-center justify-between'>
        <h5 className='text-xl font-medium text-slate-700'>
            {type === "add"? "Add Story" : "Update Story"}
        </h5>
            <div className='flex item-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg'>
            {type === 'add' ?(
            <button className="btn-small" onClick={addNewStory}>
                <MdAdd className='text-lg'/>Add Story
            </button>
            ) :(
                <>
                    <button className="btn-small" onClick={updateStory}>
                <MdUpdate className='text-lg'/>Update Story
            </button>
                </>
            )}
                <button className='' onClick={onClose}>
                    <MdClose className='text-xl text-slate-400'/>
                </button>
            </div>
            {error && (
                <p className='text-red-500 text-xs pt-2 text-right'>{error}</p>
            )}
      </div>
      <div>
        <div className='flex-1 flex flex-col gap-2 pt-4'>
            <label className='text-xs text-slate-500'>Title</label>
            <input 
            type='text'
            className='text-lg bg-gray-100 rounded text-slate-950 outline-none'
            placeholder='Memory of a Day...'
            value={title}
            onChange={({target})=>setTitle(target.value)}
            />
            <div className='my-3'>
            <DateSelector date={visitedDate} setDate={setvisitedDate}/>
            </div>
            <ImageSelector image={storyImg} setImage={setStoryImg} handelDeleteImg={handelDeleteStoryImg}/>
            <div className='flex flex-col gap-2 mt-4'>
                <label className='input-label'>Story</label>
                <textarea
                    type="text"
                    className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded'
                    placeholder='your story'
                    rows={10}
                    value={story}
                    onChange={({target})=>setStory(target.value)}
                />

            </div>
            <div className='pt-3'>
                <label className='input-label'>VisitedLocation</label>
                <TagInput tags={visitedLocation} setTags={setVisitedLocation}/>

            </div>
        </div>
      </div>
    </div>
  )
}
