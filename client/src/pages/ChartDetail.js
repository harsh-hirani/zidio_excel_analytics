import { useEffect, useState } from "react"
import Header from "./components/Header"
import apiClient from "../axiosClient"
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Toaster,toast } from 'react-hot-toast';
import SaveForm from "./components/SaveForm";
import Charter from "./components/Charter";

const ChartDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [chartType, setChartType] = useState('');
  const [chartTitle, setChartTitle] = useState("");
  // chart stats
  const [chartData, setChartData] = useState({ x: [], y: [] })

  useEffect(() => {
    
    apiClient.get('/app/chart/' + id).then((res) => {
      
      const rd = res.data;
      setChartTitle(rd.title);
      setChartType(rd.chartType);
      setChartData({
        x:rd.x,
        y:rd.y
      })
    }).catch((e) => {
      console.log(e);
    })
  }, [id])

  // effect of type selection


  // efect of axis selection

  function saveChart() {
    

    
    apiClient.delete('/app/chart', { data: { id:id } }).then((res) => {
      
      toast.success('✅ Chart Deleted successfully!');
      setTimeout(() => {
        navigate("/charts")
        
      }, 1000);
    }).catch((e) => {
      toast.error('Chart not Deleted successfully!');
      console.log(e);
    })
    .then(res => {
      
      
    }).catch(err => {
      console.error(err);
      toast.error("Failed to Delete chart");
    });
  }

 
  return (
    <><Toaster position="top-right" reverseOrder={false} />
      <div className="grid grid-cols-12 md:gap-6 mb-4">
        <div className="col-span-12 lg:col-span-10 lg:col-start-2 overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4  sm:px-6">
          {/* <Pagination page={page} setPage={setPage} total={total} limit={limit}/> */}
          <Header ftext={chartTitle || 'no'} between={{ text: "Charts", link: "/charts" }} />
        </div>
      </div>
      

      {/* chart section */}
      <div className="grid grid-cols-12 md:gap-6 mb-4">
        <div className="col-span-12 lg:col-span-10 lg:col-start-2 overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4  sm:px-6">
          {/* <Pagination page={page} setPage={setPage} total={total} limit={limit}/> */}
          <Charter title={chartTitle} type={chartType} data={chartData}
          saveChart={saveChart} tt="Delete Chart"/>
        </div>
      </div>


    </>

  )
}

export default ChartDetail
