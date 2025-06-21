import React, { useContext } from 'react'
import { AuthContext } from '../AuthContext'
import EcommerceMetrics from './components/DBStates'
import RecentCharts from './components/RecentCharts';
import TableHeader from './components/TableHeader';
import TableContainer from './components/TableContainer';
import Table from './components/Table';
import Dropzone from './components/Dropzon'
import { useState } from 'react'
import { useEffect } from 'react'
import apiClient from '../axiosClient'
const Dashboard = () => {
  const { user } = useContext(AuthContext)
  const [uploadData, setUD] = useState([]);
  const [uploadC, setUC] = useState(0);
  const [chartC, setCC] = useState(0);
  const [chartData, setCD] = useState([]);
  const [newChanges, refresh] = useState(true);
  useEffect(() => {
    if (newChanges) {

      apiClient.get('/app/dashboard').then(res => {
        setUD(res.data?.uploads || [])
        setUC(res.data?.totalU || 0)
        setCC(res.data?.totalC || 0)
        setCD(res.data?.charts || [])
      }).catch(() => {
        
      }).finally(() => {
        refresh(false)
      })
    }

  }, [newChanges])
  return (
    <div>
      <div className="grid grid-cols-12 gap-4 md:gap-6">

        <EcommerceMetrics uc={uploadC} cc={chartC} />
        <div className="col-span-12 lg:col-span-5 lg:col-start-2">
          {/* <RecentUploads header={['File', 'Uploaded At', 'Actions']} tabData={uploadData} /> */}
          <TableContainer>
            <TableHeader text="Recent Uploads" />
            <Table tabData={uploadData} header={['File', 'Uploaded At', 'Actions']} refresh={refresh} />
          </TableContainer>
        </div>

        <div className="col-span-12 lg:col-span-5">
          <RecentCharts />
        </div>
      </div>
      <Dropzone refresh={refresh}/>
      Dash {JSON.stringify(user)}
    </div>
  )
}

export default Dashboard
