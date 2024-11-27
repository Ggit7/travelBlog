import React from 'react';
import { FaHeart } from 'react-icons/fa6';
import { GrMapLocation } from 'react-icons/gr';
import moment from 'moment'
const StoryCard = ({
  imgUrl,
  title,
  date,
  story,
  name,
  visitedLocation,
  isFavourite,
  onFavouriteClick,
  onClick,
}) => {
 
  return (
    <div className="border rounded-lg overflow-hidden bg-white hover:shadow-lg hover:shadow-slate-200 transition-all ease-in-out relative cursor-pointer">
    {/* Image Section */}
    <img
      src={imgUrl}
      alt={title}
      className="w-full h-56 object-cover"
      onClick={onClick}
    />
  
    {/* Content Section */}
    <div className="p-4">
      {/* Title and Author */}
      <div className="flex gap-3 items-center mb-2">
        <div className="flex-1">
          <h6 className="text-sm font-medium text-gray-800">{title}</h6>
        </div>
        <div className="flex items-center ml-auto">
          <h6 className="text-sm font-medium inline-flex gap-2 text-gray-600">
            BY: <span className="text-gray-800">{name}</span>
          </h6>
        </div>
      </div>
  
      {/* Date */}
      <span className="text-xs text-gray-500 block mb-2">
        {date ? moment(date).format('Do MMM YYYY') : '-'}
      </span>
  
      {/* Story Preview */}
      <p className="text-gray-700 mt-1 text-sm">{story?.slice(0, 60)}</p>
  
      {/* Location */}
      <div className="inline-flex items-center gap-2 text-xs text-cyan-600 bg-cyan-200/40 rounded mt-3 px-2 py-1">
        <GrMapLocation className="text-sm" />
        <span>{visitedLocation}</span>
      </div>
    </div>
  </div>
  )
};

export default StoryCard;
