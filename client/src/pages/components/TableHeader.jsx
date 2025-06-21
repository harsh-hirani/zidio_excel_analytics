import React from 'react'
import { useNavigate } from 'react-router-dom';
const TableHeader = ({text,btnText,btnlink}) => {
    const navigate = useNavigate()
  return (
    
      <div className="flex gap-2 mb-4 flex-row items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 ">
              {text}
            </h3>
          </div>

          {btnText && <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-1.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs 
          hover:bg-accent hover:text-secondary-800 "
              onClick={() => { navigate(`/${btnlink}`)}}>
              {btnText}
            </button>
          </div>}
        </div>
    
  )
}

export default TableHeader
