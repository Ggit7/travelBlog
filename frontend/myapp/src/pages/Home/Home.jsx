import React, { useEffect, useState } from 'react'
import Navbar from '../../component/Navbar';
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance';
import StoryCard from '../../component/Cards/StoryCard';
import {MdAdd} from "react-icons/md"
import Modal from "react-modal"
import AddEditTravelStory from './AddEditTravelStory';
import ViewTravelStory from './ViewTravelStory';

export default function Home() {
const navigate=useNavigate();
  const [user,setUser]=useState(null);
  const[stories, setStories]=useState(null);
  const[edit, setEdit]=useState({
    isShown:false,
    type:'add',
    data:null,
  });

  const[view ,setView]=useState({
    isShown: false,
    data : null,
  })
  const getUser=async()=>{
    try{
      const response= await axiosInstance.get('/users');
      if(response.data && response.data.user){
        setUser(response.data.user);
      }
    } catch(error){
      if(error.response.status===401){
        // localStorage.clear();
        navigate('/login');
      }
    }
  };

  const getStories = async()=>{
    try{
      const response= await axiosInstance.get('/get-all-travel-story');
      if(response.data && response.data.stories){
        setStories(response.data.stories);
      }
    }catch(error){
      console.log('unexpected error')
       }
  };

  const handleEdit=(data)=>{
    setEdit({isShown: true, type:'edit', data: data});
  }

  const handleViewStory= (data)=>{

    setView({isShown: true, data})
  }

  const updateIsFavourite= async (storyData)=>{

    const storyId=storyData._id;

    try{
      const response=await axiosInstance.put(
        "/update-favourite/"+storyId,
        {
          isFavourite: !storyData.isFavourite,
        }
      );

      if(response.data && response.data.story){
        getStories();
      }

    }catch(error){
      console.log("an unexpected error occurred. please try again")
    }
  }

  const deleteTravelStory= async (data)=>{

    const storyId=data._id;

    try{
      const response = await axiosInstance.delete('/delete-story/'+ storyId);

      if(response.data && !response.data.error){
        setView((prevState)=>({...prevState, isShown :false}))
        getStories();
      }
    }catch(error){
      console.log('an error ocured')
    }
  }

  useEffect(()=>{
    getUser();
    getStories();
    return ()=>{}
  },[])
  return (
    <>
    {/* Navbar */}
    <Navbar user={user} />
  
    {/* Main Content */}
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row gap-7">
        
        {/* Stories Section */}
        <div className="flex-1">
          {stories && stories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((item) => (
                <StoryCard
                  key={item._id}
                  imgUrl={item.imageUrl}
                  title={item.title}
                  userId={item.userId._id}
                  name={item.userId.fullName}
                  story={item.story}
                  date={item.visitedDate}
                  visitedLocation={item.visitedLocation}
                  isFavourite={item.isFavourite}
                  onEdit={() => handleEdit(item)}
                  onClick={() => handleViewStory(item)}
                  onFavouriteClick={() => updateIsFavourite(item)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">No stories available.</div>
          )}
        </div>
  
        {/* Sidebar (optional content) */}
        <div className="w-full md:w-[320px] hidden md:block">
          {/* Add Sidebar content here if necessary */}
        </div>
      </div>
    </div>
  
    {/* Add/Edit Story Modal */}
    <Modal
      isOpen={edit.isShown}
      onRequestClose={() => {}}
      style={{
        overlay: {
          backgroundColor: "rgba(0,0,0,0.2)",
          zIndex: 999,
        },
      }}
      appElement={document.getElementById("root")}
      className="model-box"
    >
      <AddEditTravelStory
        type={edit.type}
        storyInfo={edit.data}
        onClose={() => {
          setEdit({ isShown: false, type: "add", data: null });
        }}
        getStories={getStories}
      />
    </Modal>
  
    {/* View Story Modal */}
    <Modal
      isOpen={view.isShown}
      onRequestClose={() => {}}
      style={{
        overlay: {
          backgroundColor: "rgba(0,0,0,0.2)",
          zIndex: 999,
        },
      }}
      appElement={document.getElementById("root")}
      className="model-box"
    >
      <ViewTravelStory
        type={view.type}
        storyInfo={view.data || null}
        onEditClick={() => {
          setView((prevState) => ({ ...prevState, isShown: false }));
          handleEdit(view.data || null);
        }}
        onClose={() => {
          setView((prevState) => ({ ...prevState, isShown: false }));
        }}
        onDeleteClick={() => {
          deleteTravelStory(view.data || null);
        }}
      />
    </Modal>
  
    {/* Floating Action Button */}
    <button
      className="w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-cyan-400 fixed right-10 bottom-10 shadow-lg"
      onClick={() => {
        setEdit({ isShown: true, type: "add", data: null });
      }}
    >
      <MdAdd className="text-[32px] text-white" />
    </button>
  </>
  )  
}
