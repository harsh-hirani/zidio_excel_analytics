
import Header from './components/Header'
import Dropzone from './components/Dropzon'
import { useState, useEffect } from 'react'
import apiClient from '../axiosClient'
import Pagination from './components/Pagination'
import TableHeader from './components/TableHeader';
import TableContainer from './components/TableContainer';
import Table from './components/Table';

const Uploads = () => {
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const limit = 3
  const [doRefresh, refresh] = useState(true)
  function loadData() {
    setLoading(true)
    apiClient
      .get('/app/recent-uploads', { params: { page, limit } })
      .then(res => {
        setData(res.data.data)
        setTotal(res.data.pagination?.totalItems || 0)
      })
      .catch(err => {
        console.error('Error fetching uploads:', err)
      })
      .finally(() => { setLoading(false); refresh(false) })
  }
  useEffect(() => {
    if (doRefresh) { loadData(); }
  }, [doRefresh])
  useEffect(() => {
    loadData();
  }, [page])

  // If current page exceeds available pages after deletion or edge case, reset to page 1
  useEffect(() => {
    if ((page - 1) * limit >= total && page !== 1) {
      setPage(page - 1)
    }
  }, [total])

  return (
    <>
      <div className="grid grid-cols-12 md:gap-6 mb-4">
        <Header className="col-span-10 lg:col-start-2" text={'Uploads'} />
      </div>
      <div className="grid grid-cols-12 md:gap-6">
        <div className="col-span-12 lg:col-span-10 lg:col-start-2 overflow-x-auto mb-3 md:mb-0">
          <Dropzone refresh={refresh} />
        </div>

        <div className="col-span-12 lg:col-span-10 lg:col-start-2">
          {loading ? (
            <div className="text-center py-6 text-gray-500">Loading...</div>
          ) : (
            <TableContainer>
              <TableHeader text="Recent Uploads" />
              <Table tabData={data} header={['File', 'Uploaded At', 'Actions']} refresh={refresh} />
            </TableContainer>
            // <RecentUploads tabData={data} header={['File', 'Uploaded At', 'Actions']} refresh={refresh}/>
          )}
        </div>

        <div className="col-span-12 lg:col-span-10 lg:col-start-2 overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4  sm:px-6">
          <Pagination page={page} setPage={setPage} total={total} limit={limit}/>
        </div>
      </div>
    </>
  )
}

export default Uploads
