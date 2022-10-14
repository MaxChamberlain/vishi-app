import { Input, InputLabel, FormHelperText, Button, FormControl, Select, MenuItem } from '@mui/material';
import { useState, useEffect } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
const { getProducts, submitRequest } = require('./utils/api.js');

export default function RequestAnItem(){
    const [ loading, setLoading ] = useState(false);
    const [ items, setItems ] = useState([]);
    const [ inputSku, setInputSku ] = useState('');
    const [ height, setHeight ] = useState(window.innerHeight);
    const [ selected, setSelected ] = useState(null);
    const [ bin, setBin ] = useState(null);
    const [ qty, setQty ] = useState(null);
    const [ priority, setPriority ] = useState(1);

    const classes = {
        root: {
          background: "white"
        },
        input: {
          color: "white"
        }
      };

      useEffect(() => {
        const handleResize = () => {
          setHeight(window.innerHeight);
        };
        window.addEventListener("resize", handleResize);
        return () => {
          window.removeEventListener("resize", handleResize);
        };
      }, [])

    return(
        <div className='w-screen'>
            {selected && 
                <>
                    <div 
                        className='fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-50'
                        onClick={() => setSelected(null)}
                    >
                    </div>
                    <div className='fixed z-[9900] bg-slate-700 text-white p-4 rounded left-1/2 -translate-x-1/2 mt-24 w-fit'>
                        <div className='text-center text-2xl mb-4 font-bold'>
                            Is This Right?
                        </div>
                        <div className='text-center text-xl'>
                            {selected.Name}
                        </div>
                        <div className='text-center text-xl'>
                            {selected.SKU}
                        </div>
                        <div className='flex justify-around w-full my-4'>
                            <FormControl style={{ width: '100%' }}>
                                <InputLabel htmlFor='submit-bin' style={{ color: 'white' }}>Bin Number</InputLabel>
                                <Input 
                                    autoFocus
                                    color={'primary'}
                                    fullWidth
                                    style={{color: 'white'}}
                                    id='submit-bin'
                                    onChange={(e) => setBin(e.target.value)}
                                    value={bin}
                                    required
                                />
                            </FormControl>
                        </div>
                        <div className='flex justify-around w-full my-4'>
                            <FormControl style={{ width: '100%' }}>
                                <InputLabel htmlFor='submit-qty' style={{ color: 'white' }}>How Many?</InputLabel>
                                <Input 
                                    color={'primary'}
                                    fullWidth
                                    style={{color: 'white'}}
                                    id='submit-qty'
                                    onChange={(e) => setQty(e.target.value)}
                                    value={qty}
                                    required
                                />
                            </FormControl>
                        </div>
                        <div className='flex justify-around w-full my-4 z-[9996] '>
                            <FormControl style={{ width: '100%', zIndex: 9996 }}>
                                <InputLabel className='bg-slate-700' htmlFor='submit-priority' style={{ color: 'white', zIndex: 9999 }}>Priority?</InputLabel>
                                <Select MenuProps={{ style: {zIndex: 10000, color: 'white'} }}
                                    style={{color: 'white', zIndex: 9998}}
                                    onChange={(e) => setPriority(e.target.value)}
                                    value={priority}
                                >
                                    <MenuItem value={1}>In My Pick</MenuItem>
                                    <MenuItem value={2}>Took Last One</MenuItem>
                                    <MenuItem value={3}>Bin Low</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <Button 
                            variant='contained'
                            color='primary'
                            style={{ width: '100%' }}
                            onClick={() => {
                                submitRequest(selected.SKU, selected.Name, priority, qty, bin, setBin, setQty, setSelected, setPriority);
                            }}
                        >
                            Submit
                        </Button>
                    </div>
                </>
            }
            <div className='p-6 text-white flex w-full'>
                <div className='flex items-around w-full relative justify-around flex-row'>
                    <div className='w-3/5'>
                        <InputLabel htmlFor='item-name' style={{ color: 'white' }}>Item SKU</InputLabel>
                        <Input 
                            autoFocus
                            color={'primary'}
                            fullWidth
                            onChange={(e) => setInputSku(e.target.value)}
                            value={inputSku}
                            style={{color: 'white'}}
                            onKeyDown={(e) => {
                                if(e.key === 'Enter'){
                                    setLoading(true);
                                    getProducts(inputSku, setItems, setLoading);
                                }
                            }}
                        />
                        <FormHelperText style={{ color: 'white' }}>Enter the SKU of the item</FormHelperText>
                    </div>
                    <div className='w-2/5 h-full flex justify-end items-center'>
                        <Button 
                            loading={true}
                            variant={inputSku ? 'contained' : 'outlined'}
                            style={{height: '100%', width: '80%'}}
                            color='primary'
                            fullWidth
                            onClick={() => getProducts(inputSku, setItems, setLoading)}
                        >Search</Button>
                    </div>
                </div>
            </div>
            <TransitionGroup component='div' className='flex flex-col overflow-scroll' id='list-items' style={{ width: '90%', margin: 'auto', height: height - document.getElementById('list-items')?.offsetTop || 0 }}>
                {items && items.map((item, index) => {
                    return(
                        <CSSTransition key={item + index} timeout={500} classNames='request-pull-item'>
                            <div className='bg-slate-800 text-white relative' style={{ marginBottom: 20 }}>
                                <div style={{ margin: 10, fontWeight: 'bold', }}>{item.SKU}</div>
                                <div style={{ margin: 10, }}>{item.Name.split(' - ')[0]}</div>
                                <div style={{ margin: 10, }}>{item.Name.split(' - ')[1]}</div>
                                <div className='absolute top-2 right-2 bottom-2'>
                                    <Button
                                        variant='contained'
                                        style={{height: '100%', width: '100%'}}
                                        color='primary'
                                        fullWidth
                                        onClick={() => setSelected(item)}
                                    >
                                        Select
                                    </Button>
                                </div>
                            </div>
                        </CSSTransition>
                    )
                })}
            </TransitionGroup>
        </div>
    )
}