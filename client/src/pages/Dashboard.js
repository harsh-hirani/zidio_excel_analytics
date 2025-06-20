import React, { useContext } from 'react'
import { AuthContext } from '../AuthContext'
import EcommerceMetrics from './components/DBStates'
import RecentCharts from './components/RecentCharts'
import RecentUploads from './components/RecentUploads'
import Dropzone from './components/Dropzon'
const Dashboard = () => {
  const { user } = useContext(AuthContext)
  return (
    <div>
      <div className="grid grid-cols-12 gap-4 md:gap-6">

        <EcommerceMetrics />
        <div className="col-span-12 lg:col-span-5 lg:col-start-2">
          <RecentUploads />
        </div>

        <div className="col-span-12 lg:col-span-5">
          <RecentCharts />
        </div>
      </div>
      <Dropzone/>
      Dash {JSON.stringify(user)}
    </div>
  )
}

export default Dashboard
