import { DataGrid } from '@mui/x-data-grid';
require('../style.css')
const { getHistory } = require('../utils/print')

export default function ItemList({ selected, data, loading, setSelected, setHistory }){
    return(
        <div className='w-full flex flex-col justify-center items-center text-white'>
            <DataGrid 
                rows={data.map((e, i) => {
                    return {
                        id: i,
                        sku: e.SKU,
                        barcode: e.Barcode,
                        color: e.Name.replace('ARCHIVED - ', '').split(' ').filter(x => x !== e.SKU.split('-')[e.SKU.split('-').length - 1]).join(' ').split(' - ')[1],
                        size: e.SKU.split('-')[e.SKU.split('-').length - 1],
                        name: e.Name.replace('ARCHIVED - ', '').split(' ').filter(x => x !== e.SKU.split('-')[e.SKU.split('-').length - 1]).join(' ').split(' - ')[0],
                        archived: e.Name.includes('ARCHIVED - '),
                        location: e.Warehouse.split(' / ')[1],
                        status: e.Name.includes('ARCHIVED - ') ? 'Archived' : 'Active',
                        history: 'History'
                    }
                })}
                onCellClick={handleClick}
                columns={[
                    { field: 'id', headerName: 'ID', flex: 90 },
                    { field: 'sku', headerName: 'SKU', flex: 300 },
                    { field: 'name', headerName: 'Name', flex: 150 },
                    { field: 'color', headerName: 'Color', flex: 150 },
                    { field: 'size', headerName: 'Size', flex: 150 },
                    { field: 'location', headerName: 'Location', flex: 150 },
                    { field: 'status', headerName: 'Status', flex: 150 },
                    { field: 'history', headerName: 'History', flex: 50 },
                ]}
                sx={{
                  '& .MuiDataGrid-row:hover': {
                    color: 'primary.main',
                  },
                }}
                getRowClassName={(params) => `${params.row.status === 'Archived' ? 'text-red-400' : undefined} text-base`}
                getCellClassName={(params) => `${(params.row.status === 'Archived' && params.field === 'status') ? 'bg-red-500 text-white' : undefined} ${params.field === 'history' ? 'text-white bg-slate-900 cursor-pointer' : undefined} text-base`}
                autoHeight
                pageSize={10}
                checkboxSelection
                onSelectionModelChange={(num) => {
                    setSelected(num)
                }}
                selectionModel={selected}
                {...data}
                className='bg-slate-800 text-white'
                style={{
                    color: 'white',
                    width: '95%',
                }}
            />
        </div>
    )

    function handleClick(e){
        if(e.field === 'history'){
            getHistory(e.row.sku, setHistory)
        }
    }
}