import { DataGrid } from '@mui/x-data-grid';
require('../style.css')

export default function ItemList({ selected, data, loading, setSelected }){
    return(
        <div className='w-full flex flex-col justify-center items-center text-white mt-28'>
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
                        price: '$' + e.Price,
                    }
                })}
                columns={[
                    { field: 'sku', headerName: 'SKU', flex: 250 },
                    { field: 'name', headerName: 'Name', flex: 150 },
                    { field: 'color', headerName: 'Color', flex: 150 },
                    { field: 'size', headerName: 'Size', flex: 150 },
                    { field: 'location', headerName: 'Location', flex: 150 },
                    { field: 'status', headerName: 'Status', flex: 150 },
                    { field: 'price', headerName: 'Price', flex: 50 },
                ]}
                sx={{
                  '& .MuiDataGrid-row:hover': {
                    color: 'primary.main',
                  },
                }}
                autoHeight
                pageSize={10}
                className='bg-slate-800 text-white'
                style={{
                    color: 'white',
                    width: '95%',
                }}
            />
        </div>
    )

    function handleClick(e){
        if(e.field === 'current'){
            console.log(e.row)
        }
    }
}