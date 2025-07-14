
import { useNavigate } from 'react-router-dom';
import apiClient from '../../axiosClient';
const Table = ({ tabData, header,refresh ,navs}) => {
    const navigate = useNavigate()
  return (
    <div className="max-w-full overflow-x-auto">
          {/* <Table> */}
          <table className="min-w-full">
            {/* Table Header */}
            <thead className="border-gray-100  border-y">
              <tr>
                <th className="py-3 font-medium text-gray-500 text-start text-theme-xs">
                  {header[0]}
                </th>
                <th className="py-3 font-medium text-gray-800 text-start text-theme-xs">
                  {header[1]}
                </th>
                <th className="py-3 font-medium text-gray-500 text-start text-theme-xs">
                  {header[2]}
                </th>

              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-100 ">


              {tabData.map((en) => {
                const dates = en.sec.split(/\.|T/)
                // console.log("sjc",dates);
                
                return(
                <tr key={en.id} className="cursor-pointer  rounded-2xl" onClick={() => { navigate('/'+navs+'/' + en.id) }} >
                  <td className="py-3">
                    <div className="flex items-center gap-3">

                      <div>
                        <p className="font-medium text-gray-800 text-theme-sm ">
                          {en.fname}
                        </p>
                        <span className="text-gray-500 text-theme-xs ">
                          {en.fromfile}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-gray-500 text-theme-sm ">
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm ">
                        {dates[0]}
                      </p>
                      <span className="text-gray-500 text-theme-xs ">
                        
                    {dates[1]}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-gray-500 text-theme-sm ">
                    <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-1.5 text-theme-sm font-medium 
                    text-gray-700 shadow-theme-xs 
                    hover:bg-red-200 -50 hover:text-red-600 "
                      onClick={(e) => {
                        console.log('dle');

                        apiClient.delete('/app/'+navs, { data: { id: en.id } }).then(res => {
                          console.log(res);
                          if(res.data.msg === "deleted" ){
                            refresh(true)
                          }
                        }).catch(e => {
                          console.log(e);
                        })
                        e.stopPropagation()
                      }}
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              )})}
            </tbody>
          </table>
        </div>
  )
}

export default Table
