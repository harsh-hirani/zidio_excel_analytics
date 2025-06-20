import { useNavigate } from 'react-router-dom';
import apiClient from '../../axiosClient';
// Define the table data using the interface
const tableData= [
  {
    id: 1,
    fname: "MacBook Pro 13”",
    ncharts: "2 Variants",
    
  },{
    id: 1,
    fname: "MacBook Pro 13”",
    ncharts: "2 Variants",
    
  },{
    id: 1,
    fname: "MacBook Pro 13”",
    ncharts: "2D Bar",
    fromfile:"ahdvash"
    
  },{
    id: 1,
    fname: "MacBook Pro 13”",
    ncharts: "2 Variants",
    
  },{
    id: 1,
    fname: "MacBook Pro 13”",
    ncharts: "2 Variants",
    
  }
];
const RecentCharts = () => {
    const navigate = useNavigate()
  return (
    <>
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4  sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 ">
            Recent Uploads
          </h3>
        </div>

        <div className="flex items-center gap-3">
          
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-1.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs 
          hover:bg-accent -50 hover:text-secondary-800 "
          onClick={()=>{navigate('/u/charts')}}>
            See all
          </button>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        {/* <Table> */}
            <table className="min-w-full">
          {/* Table Header */}
          <thead className="border-gray-100  border-y">
            <tr>            
              <th className="py-3 font-medium text-gray-500 text-start text-theme-xs">
                Chart
              </th>
              <th className="py-3 font-medium text-gray-800 text-start text-theme-xs">
                Type
              </th>
              <th className="py-3 font-medium text-gray-500  text-theme-xs text-start">
                Actions
              </th>              
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-100 ">

          
            {tableData.map((product) => (
              <tr key={product.id} className="cursor-pointer  rounded-2xl" onClick={()=>{navigate('/u/chart/'+product.id)}} >
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm ">
                        {product.fname}
                      </p>
                      <span className="text-gray-500 text-theme-xs ">
                        {product.fromfile}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-3 text-gray-500 text-theme-sm ">
                  {product.ncharts}
                </td>
                <td className="py-3 text-gray-500 text-theme-sm justify-cen flex ">
                   
                    <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-1.5 text-theme-sm font-medium 
                    text-gray-700 shadow-theme-xs
                    hover:bg-red-200 -50 hover:text-red-600 "
                    onClick={(e)=>{
                        console.log('dle');
                        
                        apiClient.delete('/app/chart',{data:{id:product.id}}).then(res=>{
                            console.log(res);                            
                        }).catch(e=>{console.log(e);
                        })
                        e.stopPropagation()
                    }}
                    >
                     Delete
                    </button>
                    
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  )
}

export default RecentCharts
