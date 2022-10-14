require('../style.css')
const { getHistory } = require('../utils/print')

export default function ItemList({ selected, data, loading, setSelected, setHistory }){
    return(
        <div className='w-full flex justify-center'>
            <table className='text-white w-11/12 text-xl '>
                <thead>
                    <tr>
                        <th className='text-center'><input 
                            type='checkbox'
                            checked={selected.length > 0}
                            onChange={e => setSelected([])}
                        /></th>
                        <th>SKU</th>
                        <th>Name</th>
                        <th>Color</th>
                        <th>Size</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th>History</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map(e => {
                            return <>
                                <tr className={`${e.Name.includes('ARCHIVED') ? 'bg-red-900' : undefined}`}>
                                    <td className='text-center'>
                                        <input type='checkbox' 
                                            checked={selected.find(f => f.sku === e.SKU) ? true : false}
                                            onChange={(f) => {
                                                if(f.target.checked){
                                                    setSelected(prev => [...prev, {
                                                        sku: e.SKU,
                                                        barcode: e.Barcode,
                                                        color: e.Name.replace('ARCHIVED - ', '').split(' ').filter(x => x !== e.SKU.split('-')[e.SKU.split('-').length - 1]).join(' ').split(' - ')[1],
                                                        size: e.SKU.split('-')[e.SKU.split('-').length - 1],
                                                        name: e.Name.replace('ARCHIVED - ', '').split(' ').filter(x => x !== e.SKU.split('-')[e.SKU.split('-').length - 1]).join(' ').split(' - ')[0],
                                                        archived: e.Name.includes('ARCHIVED - ')
                                                    }])
                                                }else{
                                                    setSelected(prev => prev.filter(item => item.sku !== e.SKU))
                                                }
                                            }}
                                        />
                                    </td>
                                    {/* sku */}
                                    <td>{e.SKU}</td>
                                    {/* name */}
                                    <td>{
                                        e.Name.replace('ARCHIVED - ', '').split(' ').filter(x => x !== e.SKU.split('-')[e.SKU.split('-').length - 1]).join(' ').split(' - ')[0]
                                    }</td>
                                    {/* color */}
                                    <td>{
                                        e.Name.replace('ARCHIVED - ', '').split(' ').filter(x => x !== e.SKU.split('-')[e.SKU.split('-').length - 1]).join(' ').split(' - ')[1]
                                    }</td>
                                    {/* size */}
                                    <td>{e.SKU.split('-')[e.SKU.split('-').length - 1]}</td>
                                    {/* location */}
                                    <td>{e.Warehouse.split(' / ')[1]}</td>
                                    {/* status */}
                                    <td>{e.Name.toUpperCase().includes('ARCHIVED') ? 'Archived' : 'Active'}</td>
                                    {/* history */}
                                    <td><div className='underline cursor-pointer' 
                                        onClick={() => getHistory(e.SKU, setHistory)}
                                    >History</div></td>
                                </tr>
                            </>
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}