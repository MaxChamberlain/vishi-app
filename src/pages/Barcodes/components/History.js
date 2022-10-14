export default function History({ data, setHistory }){
    return(
        <div className='absolute top-24 left-0 right-0 bottom-0 flex justify-center align-center'>
            <div className='fixed top-0 left-0 right-0 h-full' style={{ backgroundColor: 'rgba(0,0,0,0.8)' }} onClick={() => setHistory([])}></div>
            <div className='w-full flex justify-center'>
                <table className='text-white text-xl bg-slate-700 z-[9995] h-fit mt-28'>
                    <thead>
                        <tr>
                            <th>SKU</th>
                            <th>Printed By</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map(e => {
                                return <tr>
                                        <td>{e.print_sku}</td>
                                        <td>{e.printed_by}</td>
                                        <td>{e.print_date}</td>
                                    </tr>
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}