import React, { useState } from "react";
import { MdAdd, MdClose } from "react-icons/md";
import { GrMapLocation } from "react-icons/gr";

export default function TagInput({ tags, setTags }) {
  const [inputValue, setInputValue] = useState("");

  // Add new tag
  const addNewTag = () => {
    if (inputValue.trim() && !tags.includes(inputValue)) {
      setTags([...tags, inputValue.trim()]);
      setInputValue(""); // Clear the input field
    }
  };

  // Remove tag
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Handle "Enter" key for adding tags
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addNewTag();
    }
  };

  return (
    <div>
      {/* Tag Display */}
      {tags.length > 0 ? (
        <div className="flex items-center gap-2 flex-wrap mt-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="flex items-center gap-2 text-sm text-cyan-600 bg-cyan-200/40 px-3 py-1 rounded"
            >
              <GrMapLocation className="text-sm" />
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="text-cyan-600 hover:text-cyan-800"
              >
                <MdClose />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mt-2">No place added</p>
      )}

      {/* Input Field */}
      <div className="flex items-center gap-4 mt-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="text-sm bg-transparent border px-3 py-2 rounded outline-none"
          placeholder="Add a place"
        />
        <button
          className="w-8 h-8 flex items-center justify-center rounded border border-cyan-500 hover:bg-cyan-500"
          onClick={addNewTag}
        >
          <MdAdd className="text-2xl text-cyan-500 hover:text-white" />
        </button>
      </div>
    </div>
  );
}
