import {
  PieChartIcon,FileIcon
} from "../../icons";
function Tile({ title, value ,Ic,start,c}) {
    const extra = start? "md:col-start-4 "+start : ""
    return (<div className={"rounded-2xl border border-gray-200 bg-white p-5  md:p-6 col-span-6 md:col-span-3 "+extra}>
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl">
            <Ic className="text-gray-800 size-6 " />
        </div>

        <div className="flex items-end justify-between mt-5">
            <div>
                <span className="text-sm text-black ">
                    {title}
                </span>
                <h4 className="mt-2 font-bold text-gray-800 text-3xl ">
                    {c}
                </h4>
            </div>

        </div>
    </div>)
}

export default function EcommerceMetrics({uploadData,uc,cc}) {
    return (
        <>
            <Tile title="Files Uploaded" value={50} Ic={FileIcon} start={3} c={uc}/>
            <Tile title="Charts Generated" value={50} Ic={PieChartIcon} c={cc}/>

        </>
    );
}
