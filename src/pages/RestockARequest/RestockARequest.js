import { useState, useEffect } from 'react';
import { Button } from '@mui/material';
const { getRequests, updateItem } = require('./utils/api');

export default function RestockARequest(){
    const [ requests, setRequests ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [ overstock, setOverstock ] = useState(null);
    const [ now, setNow ] = useState(new Date());

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            await getRequests(setRequests, setOverstock);
            setLoading(false);
        }
        init()
        setInterval(() => getRequests(setRequests, setOverstock), 3000)
        setInterval(() => setNow(new Date()), 1000)
    }, [])

    if(loading){
        return <div>Loading...</div>
    }
    return(
        <div>
            {(requests && requests.new && requests.new.length > 0) ?
                <div 
                    className="w-screen p-12"
                    style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 33%))',
                    }}
                >
                    {requests.new.map((request, i) => {
                        return(
                            <div key={i} className={`text-white p-4 rounded m-2 text-xl ${request.status === 'open' && 'bg-slate-700'} relative pb-16`} style={{
                                backgroundColor: request.status === 'open' ? undefined : request.status === 'seen' ? '#80765c' : request.status === 'complete' ? 'rgba(40, 99, 247, 0.3)' : 'rgba(255, 56, 56, 0.3)',
                            }}>
                                <div className='text-2xl font-bold flex w-full justify-between'>
                                    <div className='rounded-full border border-slate-900 w-12 h-12 flex justify-center items-center'>{request.quantity_needed}</div>
                                    {request.priority === 1 ? 
                                        <span className='p-2'>In My Pick</span> :
                                    request.priority === 2 ?
                                        <span className='p-2'>Took Last Unit</span> :
                                        <span className='p-2'>Bin Almost Empty</span>
                                    }
                                </div>
                                <div className='p-4 flex justify-center items-center rounded my-4' style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
                                    {request.fixer !== 'None' ? `Assigned to ${request.fixer}` : 'Unassigned'}
                                </div>
                                <div className='text-center'>
                                    <b>{request.submitter}</b> - {
                                        new Date(now - new Date(request.createdAt)).getMinutes() + ' m ' + new Date(now - new Date(request.createdAt)).getSeconds() + ' s ago'
                                    }
                                </div>
                                <div className='text-center font-bold mt-6'>
                                    <span>{request.sku}</span>
                                </div>
                                <div className='text-center'>
                                    {request.item_name}
                                </div>
                                <div className='text-center mt-6'>
                                    <span>Bin {request.bin_number}</span>
                                </div>
                                <div style={{            
                                    marginTop: 20,   
                                    textAlign: 'center',        
                                    filter: 'brightness(1.5)',
                                    color: (overstock && overstock.filter(ov => ov.item === request.sku) && overstock.filter(ov => ov.item === request.sku)[0] && overstock.filter(ov => ov.item === request.sku)[0].color) ? overstock.filter(ov => ov.item === request.sku)[0].color : 'transparent'
                                }}>
                                    {overstock && overstock.filter(ov => ov.item === request.sku).map(ov => <div>{ov.position.includes('ROW') ? 'Event Row ' + (parseInt(ov.position) - 100) + ' slot ' + (parseInt(ov.position.split('/')[0].split(' - ')[1]) - 100) : ov.position.includes('TempTemp') ? 'Temporary Slot ' + ov.position.split('/')[1] : ov.position.includes('BAY') ? 'Bay Row ' + (parseInt(ov.position) - 200) + ' slot ' + (parseInt(ov.position.split('/')[0].split(' - ')[1]) - 200) : ov.position}</div>)}
                                </div>
                                {request.status === 'open' ?

                                <div className='flex justify-around mt-8 w-full absolute bottom-0 right-0 left-0 pb-2'>
                                    <div style={{ width: '96%' }}>
                                        <Button 
                                            variant='contained'
                                            color='primary'
                                            fullWidth
                                            onClick={() => {
                                                updateItem(request._id, 'mark-seen')
                                            }}
                                        >MARK AS SEEN</Button>
                                    </div>
                                </div>
                                :
                                request.status === 'seen' ?
                                <div className='flex justify-around mt-8 w-full absolute bottom-0 right-0 left-0 pb-2'>
                                    <div style={{ width: '48%' }}>
                                        <Button 
                                            variant='contained'
                                            color='primary'
                                            fullWidth
                                            style={{ backgroundColor: '#ff3838' }}
                                            onClick={() => {
                                                updateItem(request._id, 'mark-unfound')
                                            }}
                                        >UNFOUND</Button>
                                    </div>
                                    <div style={{ width: '48%' }}>
                                        <Button 
                                            variant='contained'
                                            color='primary'
                                            fullWidth
                                            onClick={() => {
                                                updateItem(request._id, 'mark-complete')
                                            }}
                                        >COMPLETE</Button>
                                    </div>
                                </div>
                                :
                                <div className='flex justify-around mt-8 w-full absolute bottom-0 right-0 left-0 pb-2'>
                                    <div style={{ width: '96%' }}>
                                        <Button 
                                            variant='contained'
                                            color='primary'
                                            fullWidth
                                            onClick={() => {
                                                updateItem(request._id, 'clear')
                                            }}
                                        >CLEAR</Button>
                                    </div>
                                </div>
                            }
                            </div>
                        )
                    })}
                </div>
                :
                <div className='text-white absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center text-3xl'>
                    Good job, {JSON.parse(localStorage.getItem('_vishi:@user_info')).name.split(' ')[0]}! This queue is empty 🎉
                </div>
            }
        </div>
    )
    
}