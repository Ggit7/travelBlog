import React from 'react';
import {getInitials} from '../../utils/helper'
export default function Profile({ user, onLogout }) {
  if (!user) return null; 

  return (
    user && (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100">
        {getInitials(user? user.fullName :'')}
      </div>
      <div>
        <p className="text-sm font-medium">{user.fullName || "Guest"}</p>
        <button
          className="text-sm text-slate-700 underline mt-1"
          onClick={onLogout} 
        >
          Logout
        </button>
      </div>
    </div>
    )
  );
}
