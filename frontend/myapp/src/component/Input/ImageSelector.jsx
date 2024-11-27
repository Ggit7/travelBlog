import React, { useEffect, useRef, useState } from 'react';
import { FaRegFileImage } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

export default function ImageSelector({ image, setImage ,handelDeleteImg}) {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };
  const handelRemoveImage=()=>{
    setImage(null);
    handelDeleteImg();
  }

  useEffect(() => {
    if (typeof image === 'string') {
      setPreviewUrl(image);
    } else if (image) {
      const objectUrl = URL.createObjectURL(image);
      setPreviewUrl(objectUrl);

      // Cleanup the object URL
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else {
      setPreviewUrl(null);
    }
  }, [image]);

  return (
    <div className="image-selector">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {!image ? (
        <button
          className="w-full h-[220px] flex flex-col items-center justify-center gap-4 bg-slate-50 rounded border border-slate-200/50"
          onClick={onChooseFile}
        >
          <div className="w-14 h-14 flex items-center justify-center bg-cyan-50 rounded-full border border-cyan-100">
            <FaRegFileImage className="text-xl text-cyan-500" />
          </div>
          <span>Select an Image</span>
        </button>
      ) : (
        <div className="w-full relative">
          <img
            src={previewUrl}
            alt="selected preview"
            className="rounded"
          />
          <button
          className='btn-small btn-delete absolute top-2 right-2 bg-red-300 hover:bg-red-500'
          onClick={handelRemoveImage}
          >
            <MdDelete className='text-lg bg-red-300 hover:bg-red-500 text-red-500 hover:text-white'/>
          </button>
        </div>
      )}
    </div>
  );
}
