import { DataGrid } from '@mui/x-data-grid';
require('../style.css')
const { getHistory } = require('../utils/print')

export default function ItemList({ selected, data, loading, setSelected, setHistory }){
    return(
        <div className='w-full flex flex-col justify-center items-center text-white'>
            <DataGrid 
                rows={data.map((e, i) => {
                    return {
                        id: e._id,
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
                    { field: 'sku', headerName: 'SKU', flex: 300 },
                    { field: 'name', headerName: 'Name', flex: 150 },
                    { field: 'color', headerName: 'Color', flex: 150 },
                    { field: 'size', headerName: 'Size', flex: 150 },
                    { field: 'location', headerName: 'Location', flex: 150 },
                    { field: 'status', headerName: 'Status', flex: 150 },
                    { field: 'history', headerName: 'History', flex: 50 },
                ]}
                keepNonExistentRowsSelected
                sx={{
                  '& .MuiDataGrid-row:hover': {
                    color: 'primary.main',
                  }
                }}
                getRowClassName={(params) => `${params.row.status === 'Archived' ? 'text-red-400' : undefined} text-base`}
                getCellClassName={(params) => `${(params.row.status === 'Archived' && params.field === 'status') ? 'bg-red-500 text-white' : undefined} ${params.field === 'history' ? 'text-white bg-slate-900 cursor-pointer' : undefined} text-base`}
                autoHeight
                pageSize={10}
                checkboxSelection
                onSelectionModelChange={(num) => {
                    const oldArr = selected.map(e => e.id)
                    const newArr = num
                    const remove = oldArr.filter(x => !newArr.includes(x))
                    const add = newArr.filter(x => !oldArr.includes(x))
                    const newSelected = selected.filter(x => !remove.includes(x.id))
                    add.forEach(e => {
                        const item = data.find(x => x._id === e)
                        newSelected.push({
                            id: item._id,
                            sku: item.SKU,
                            barcode: item.Barcode,
                            color: item.Name.replace('ARCHIVED - ', '').split(' ').filter(x => x !== item.SKU.split('-')[item.SKU.split('-').length - 1]).join(' ').split(' - ')[1],
                            size: item.SKU.split('-')[item.SKU.split('-').length - 1],
                            name: item.Name.replace('ARCHIVED - ', '').split(' ').filter(x => x !== item.SKU.split('-')[item.SKU.split('-').length - 1]).join(' ').split(' - ')[0],
                            archived: item.Name.includes('ARCHIVED - '),
                            location: item.Warehouse.split(' / ')[1],
                            status: item.Name.includes('ARCHIVED - ') ? 'Archived' : 'Active',
                            history: 'History'
                        })
                    })
                    setSelected(newSelected)
                }}
                selectionModel={selected.map(e => e.id)}
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