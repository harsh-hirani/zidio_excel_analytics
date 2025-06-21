
import TableHeader from './TableHeader';
import TableContainer from './TableContainer';
import Table from './Table';
// Define the table data using the interface

const RecentUploads = ({ tabData, header,refresh }) => {
  
  return (
    <>
    <TableContainer>
        <TableHeader text="Recent Uploads"  />
        <Table tabData={tabData} header={header} refresh={refresh}/>
    </TableContainer>
    </>
  )
}

export default RecentUploads
