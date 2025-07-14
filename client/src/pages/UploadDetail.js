import { useEffect, useState } from "react"
import Header from "./components/Header"
import apiClient from "../axiosClient"
import { useParams } from 'react-router-dom';
import ChartSelectForm from './components/ChartSelectForm'
import AxisPanel from './components/AxisPanel'
import { Toaster,toast } from 'react-hot-toast';
import SaveForm from "./components/SaveForm";
import Charter from "./components/Charter";
function extractAllLabels(data) {
  const result = {};
  const labels = [];
  const sampleSize = Math.min(20, data.length);

  const keys = Object.keys(data[0] || {});
  keys.forEach((key) => {
    labels.push(key);
    let isNumeric = true;
    let hasCheckedValue = false;

    for (let i = 0; i < sampleSize; i++) {
      const rawValue = data[i][key];
      if (rawValue === null || rawValue === "") continue;

      const numValue = Number(rawValue);

      if (!isNaN(numValue)) {
        hasCheckedValue = true;
      } else {
        isNumeric = false;
        break;
      }
    }

    result[key] = isNumeric && hasCheckedValue;
  });
  return [labels, result];
}

const UploadDetail = () => {
  const { id } = useParams()
  const [data, setdata] = useState("")
  const [lables, setLables] = useState([])
  const [lableTypes, setLableTypes] = useState({})
  const [reqAxix, setReqAxis] = useState(3)
  // form stats
  const [mode, setMode] = useState('2d');
  const [chartType, setChartType] = useState('');
  const [chartTitle, setChartTitle] = useState("");
  // Axis Panel stata
  const [axisConf, setAxisConf] = useState({})
  // chart stats
  const [chartData, setChartData] = useState({ x: [], y: [] })

  useEffect(() => {
    apiClient.get('/app/record/' + id).then((res) => {
      setdata(res.data);
    }).catch((e) => {
      console.log(e);
    })
  }, [id])
  useEffect(() => {
    if (data.data) {
      const [x, y] = extractAllLabels(data.data)
      setLables(x)
      setLableTypes(y)
    }
  }, [data])
  // effect of type selection

  useEffect(() => {
    if (mode.toLocaleLowerCase() === "2d") {
      setReqAxis(2)
    } else {
      setReqAxis(3)
    }
  }, [mode])
  // efect of axis selection
  useEffect(() => {
    // if (Object.keys(axisConf).length !== 0) {

    //   if (axisConf.A?.length > 1 && chartType.toLocaleLowerCase() !== "pie") {
    //     return toast.error("Not more than 1 feild is allowed in X axis")
    //   }
    // }
    // toast.error('')

    const isPie = chartType.toLowerCase() === "pie";
    if (Object.keys(axisConf).length === 0 || isPie) {
      
      return;
    }

    const { X = [], Y = [], Z = [] } = axisConf;

    // A must have exactly 1 field
    if (X.length !== 1) {
      toast.error("Exactly one field must be assigned to X axis (A)");
      return;
    }

    // For 2D and 3D charts
    const numericCheck = (axis, label) => {
      if (axis.length > 1) {
        return `${label} axis cannot have more than 1 fields`;
      }
      const nonNumeric = axis.filter(field => !lableTypes[field]);
      if (nonNumeric.length > 0) {
        return `${label} axis contains non-numeric field(s): ${nonNumeric.join(', ')}`;
      }
      return null;
    };

    const bError = numericCheck(Y, "Y");
    if (bError) {
      toast.error(bError);
      return;
    }

    const cError = numericCheck(Z, "Z");
    if (cError) {
      toast.error(cError);
      return;
    }

    // All good
  }, [axisConf])
  function saveChart() {
    if (!chartTitle || !chartType || chartData.x.length === 0 || chartData.y.length === 0) {
      return toast.error("Cannot save: chart is incomplete");
    }

    const labels = chartData.x;
    const values = chartData.y;
    console.log(labels,values);
    
    apiClient.post('/app/chart/save', {
      upload: id, 
      title: chartTitle,
      chartType,
      labels,
      values,
    }).then(res => {
      
      toast.success('✅ Chart saved successfully!');
      
    }).catch(err => {
      console.error(err);
      toast.error("Failed to save chart");
    });
  }

  function generateChart() {
  if (!axisConf.X || !axisConf.Y) return;

  const Xkey = axisConf.X[0];
  const Ykey = axisConf.Y[0];

  const Xdata = data?.data?.map((e) => e[Xkey]);
  const ys = data?.data?.map((e) => e[Ykey]);

  setChartData({ x: Xdata, y: ys }); // y is now an array of {label, values}
}
  // function generateChart() {
  //   const Xdata = data?.data?.map((e) => e[axisConf?.X]) || []
  //   // const ys = {}
  //   // axisConf.Y?.map(w=>{
  //   //   // ys.push(data?.data?.map)
  //   //   ys[w] = data?.data?.map((e)=>e[w])
  //   // })
  //   const ys = data?.data?.map(e => e[axisConf?.Y]) || []
  //   // const Ydata = data?.data?.map((e)=>e[axisConf?.Y]) || []
  //   console.log(Xdata, ys)
  //   setChartData({ x: Xdata, y: ys })
  // }
  return (
    <><Toaster position="top-right" reverseOrder={false} />
      <div className="grid grid-cols-12 md:gap-6 mb-4">
        <div className="col-span-12 lg:col-span-10 lg:col-start-2 overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4  sm:px-6">
          {/* <Pagination page={page} setPage={setPage} total={total} limit={limit}/> */}
          <Header ftext={data?.filename || 'no'} between={{ text: "Uploads", link: "/uploads" }} />
        </div>
      </div>
      <div className="grid grid-cols-12 md:gap-6 mb-4">
        <div className="col-span-12 lg:col-span-10 lg:col-start-2 overflow-hidden rounded-2xl  border border-accent bg-white px-4 pb-2 pt-1  sm:px-1">
          <div className="rounded-2xl  bg-white px-4 pb-3 pt-4  sm:px-6">
            <h2 class="text-2xl font-semibold text-secondary ">Ai Summary</h2>
            <p class="my-4 text-sm text-text-main ">
              Ai summary not available
            </p>

          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 md:gap-6 mb-4">
        <div className="col-span-12 lg:col-span-4 lg:col-start-2 overflow-hidden  rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4  sm:px-5">
          <SaveForm
            className={" mb-3 "}
            placeholder={"Enter Graph Name"}
            submitBtnText={"Save"}
            chartTitle={chartTitle}
            setChartTitle={setChartTitle}
          />
          {/* chart type selection */}
          <ChartSelectForm  setError={toast.error}
            mode={mode} setMode={setMode}
            onSubmit={generateChart}
            chartType={chartType} setChartType={setChartType}
          />
        </div>
        <div className="col-span-12 lg:col-span-6 overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4  sm:px-6">
          {lables.length > 0 ? (
            // chart axix selection
            <AxisPanel labels={lables} axisCount={reqAxix}
              onUpdate={setAxisConf}
              />
          ) : (
            "Getting Data"
          )}
        </div>
      </div>
      {/* chart section */}
      <div className="grid grid-cols-12 md:gap-6 mb-4">
        <div className="col-span-12 lg:col-span-10 lg:col-start-2 overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4  sm:px-6">
          {/* <Pagination page={page} setPage={setPage} total={total} limit={limit}/> */}
          <Charter title={chartTitle} type={chartType} data={chartData}
          saveChart={saveChart} />
        </div>
      </div>


    </>

  )
}

export default UploadDetail
