import { useState, useEffect } from 'react';
import { Button, Snackbar, Alert } from '@mui/material';
import { motion } from 'framer-motion';
const { getRequests, updateItem } = require('./utils/api');
const logo = require('../../assets/images/logo.png');

export default function RestockARequest(){
    const [ requests, setRequests ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [ overstock, setOverstock ] = useState(null);
    const [ now, setNow ] = useState(new Date());
    const [ snackbar, setSnackbar ] = useState([]);

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
        return <div className='w-screen flex justify-center items-center flex-col' style={{ height: 'calc(100vh - 100px)' }}>
            <img
                src={logo}
                className='w-12 h-12 invert animate-ping mb-10'
            />
            <div className='text-white text-xl animate-pulse'>
                Loading...
            </div>
        </div>
    }
    return(
        <motion.div 
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.3}}
        >
            <Snackbar open={snackbar.length > 0} autoHideDuration={6000}>
                <Alert severity="info" style={{ backgroundColor: '#1E79D3', color: 'white' }}>
                    <div className='w-full h-full items-center flex justify-between p-0'>
                        {snackbar[0]}
                        {snackbar[0] === 'Marked as seen' ? undefined : <Button color="inherit" size="small" onClick={() => {
                            if(snackbar[0] === 'Marked as unfound'){
                                updateItem(snackbar[1], snackbar[2], setRequests, setOverstock)
                            }else if (snackbar[0] === 'Marked as complete'){
                                updateItem(snackbar[1], snackbar[2], setRequests, setOverstock)
                            }else if (snackbar[0] === 'Cleared'){
                                updateItem(snackbar[1], snackbar[2], setRequests, setOverstock)
                            }
                            setSnackbar([])
                        }}>
                            UNDO
                        </Button>}
                    </div>
                </Alert>
            </Snackbar>
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
                            <>
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
                                                    updateItem(request._id, 'mark-seen', setRequests, setOverstock)
                                                    setSnackbar(['Marked as seen', request._id])
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
                                                    updateItem(request._id, 'mark-unfound', setRequests, setOverstock)
                                                    setSnackbar(['Marked as unfound', request._id, 'mark-seen'])
                                                }}
                                            >UNFOUND</Button>
                                        </div>
                                        <div style={{ width: '48%' }}>
                                            <Button 
                                                variant='contained'
                                                color='primary'
                                                fullWidth
                                                onClick={() => {
                                                    updateItem(request._id, 'mark-complete', setRequests, setOverstock)
                                                    setSnackbar(['Marked as complete', request._id, 'mark-seen'])
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
                                                    updateItem(request._id, 'clear', setRequests, setOverstock)
                                                    setSnackbar(['Cleared', request._id, request.status === 'complete' ? 'mark-complete' : 'mark-unfound'])
                                                }}
                                            >CLEAR</Button>
                                        </div>
                                    </div>
                                }
                                </div>
                            </>
                        )
                    })}
                </div>
                :
                <div className='text-white absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center text-3xl animate-pulse'>
                    Good job, {JSON.parse(localStorage.getItem('_vishi:@user_info')).name.split(' ')[0]}! This queue is empty 🎉
                </div>
            }
        </motion.div>
    )
    
}