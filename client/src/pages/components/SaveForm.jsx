import React from 'react'

const SaveForm = ({className,placeholder,chartTitle,setChartTitle}) => {
  return (
    <div className={className}>
      <div class="relative">
        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          
        </div>
        <input type="search" value={chartTitle} 
        onInput={(e)=>{setChartTitle(e.target.value)}}
        id="search" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 " placeholder={placeholder} required />
       
    </div>
        
    </div>
  )
}

export default SaveForm
