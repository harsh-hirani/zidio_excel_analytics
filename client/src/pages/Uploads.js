import RecentUploads from './components/RecentUploads'
import Header from './components/Header'
import Dropzone from './components/Dropzon'

const Uploads = () => {
  return (
    <>
      <div className="grid grid-cols-12 md:gap-6 mb-4">
      <Header className="col-span-10 lg:col-start-2"  text={'Uploads'} /></div>
      <div className="grid grid-cols-12 md:gap-6">

        <div className="col-span-12 lg:col-span-10 lg:col-start-2 overflow-x-auto">
          <Dropzone />
        </div>
        <div className="col-span-12 lg:col-span-10 lg:col-start-2">
          <RecentUploads />
        </div>
      </div>
    </>
  )
}

export default Uploads
