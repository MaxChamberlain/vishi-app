import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FormControl, Input, InputLabel, Button, FormHelperText, ButtonGroup } from '@mui/material';
const { addItems } = require('../utils/api.js');

export default function AddItems(){
    const [ adding, setAdding ] = useState(false);
    const [ sizes, setSizes ] = useState([]);
    const [ sku, setSku ] = useState('');
    const [ name, setName ] = useState('');
    const [ price, setPrice ] = useState('');
    const [ location, setLocation ] = useState('');
    const [ barcodes, setBarcodes ] = useState({});
    return(
        <div>
            <motion.div 
                draggable
                animate={{ rotate: adding ? 45 : 0 }}
                className='absolute text-white top-72 right-24 p-2 rounded-full w-10 h-10 flex items-center justify-center text-4xl cursor-pointer' 
                style={{ backgroundColor: '#1976d2' }}
                onClick={() => setAdding(was => !was)}
            >
                <div className='w-5 h-11'>+</div>
            </motion.div>
            {adding && <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                transition={{duration: 0.3}}
                className='absolute top-0 right-0 left-0 bottom-0 flex justify-center items-start pt-72 text-white'
            >
                <div className='absolute top-0 right-0 left-0 bottom-0 bg-neutral-900 bg-opacity-80 z-[999]' onClick={() => setAdding(false)}></div>
                <div className='rounded-sm p-4 bg-slate-700 z-[999] w-11/12'>
                    <div className='text-2xl border-b border-neutral-400'>Add an Item</div>
                    <div className='text-2xl mt-10 w-full flex justify-around'>
                        <div className='w-full px-4'>
                            <FormControl fullWidth>
                                <InputLabel htmlFor='item-name' style={{ color: 'white' }}>Item SKU</InputLabel>
                                <Input
                                    sx={{
                                        ':before': { borderBottomColor: 'white' },
                                    }}
                                    autoFocus
                                    color={'primary'}
                                    fullWidth
                                    style={{color: 'white'}}
                                    onChange={(e) => setSku(e.target.value)}
                                    value={sku.toUpperCase()}
                                />
                                <FormHelperText style={{ color: 'white' }}>Enter without size, e.g. VT-04-83M</FormHelperText>
                            </FormControl>
                        </div>
                        <div className='w-full px-4'>
                            <FormControl fullWidth>
                                <InputLabel htmlFor='item-name' style={{ color: 'white' }}>Item Name</InputLabel>
                                <Input
                                    sx={{
                                        ':before': { borderBottomColor: 'white' },
                                    }}
                                    autoFocus
                                    color={'primary'}
                                    fullWidth
                                    style={{color: 'white'}}
                                    onChange={(e) => setName(e.target.value)}
                                    value={name}
                                />
                                <FormHelperText style={{ color: 'white' }}>Enter without size, e.g. The Cloud Pant - Midnight</FormHelperText>
                            </FormControl>
                        </div>
                    </div>
                    <div className='text-2xl mt-10 w-full flex justify-around'>
                        <div className='w-full px-4'>
                            <FormControl fullWidth>
                                <InputLabel htmlFor='item-name' style={{ color: 'white' }}>Item Location</InputLabel>
                                <Input
                                    sx={{
                                        ':before': { borderBottomColor: 'white' },
                                    }}
                                    autoFocus
                                    color={'primary'}
                                    fullWidth
                                    style={{color: 'white'}}
                                    onChange={(e) => setLocation(e.target.value)}
                                    value={location}
                                />
                                <FormHelperText style={{ color: 'white' }}>e.g. Primary</FormHelperText>
                            </FormControl>
                        </div>
                        <div className='w-1/2 px-4'>
                            <FormControl fullWidth>
                                <InputLabel htmlFor='item-name' style={{ color: 'white' }}>Item Price</InputLabel>
                                <Input
                                    sx={{
                                        ':before': { borderBottomColor: 'white' },
                                    }}
                                    autoFocus
                                    color={'primary'}
                                    fullWidth
                                    style={{color: 'white'}}
                                    onChange={(e) => setPrice(e.target.value)}
                                    value={price}
                                />
                                <FormHelperText style={{ color: 'white' }}>Enter without dollar sign, e.g. 78.00</FormHelperText>
                            </FormControl>
                        </div>
                    </div>
                    <div className='text-2xl mt-10 w-full flex justify-around'>
                        <ButtonGroup
                            variant='contained'
                            color='primary'
                            aria-label='contained primary button group'
                            fullWidth
                        >
                            {['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL'].map(e => 
                                <Button
                                    onClick={() => setSizes(was => {
                                        if(was.includes(e)){
                                            return was.filter(w => w !== e);
                                        }else{
                                            return [...was, e];
                                        }
                                    })}
                                    variant={sizes.includes(e) ? 'contained' : 'outlined'}
                                >
                                    {e}
                                </Button>
                            )}
                        </ButtonGroup>
                    </div>
                    <div className='text-2xl mt-10 w-full flex justify-around'>
                        {['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL'].map(e => 
                            <>
                                <FormControl fullWidth style={{ padding: '0 10px', opacity: sizes.includes(e) ? 1 : 0 }}>
                                    <InputLabel htmlFor='item-name' style={{ color: 'white' }}>Barcode</InputLabel>
                                    <Input
                                        sx={{
                                            ':before': { borderBottomColor: 'white' },
                                        }}
                                        autoFocus
                                        color={'primary'}
                                        fullWidth
                                        style={{color: 'white'}}
                                        onChange={(event) => setBarcodes(was => {
                                            return {
                                                ...was,
                                                [e]: event.target.value
                                            }
                                        })}
                                        value={barcodes[e]}
                                    />
                                </FormControl>
                            </>
                        )}
                    </div>
                    <Button
                        variant={(sku && name && location && parseFloat(price) >= 0 && sizes.length > 0 && sizes.every(e => barcodes[e]?.length > 0)) ? 'contained' : 'outlined'}
                        color='primary'
                        fullWidth
                        style={{ marginTop: 40}}
                        onClick={(sku && name && location && parseFloat(price) >= 0 && sizes.length > 0 && sizes.every(e => barcodes[e]?.length > 0)) ? () => addItems(sku, name, location, price, sizes, barcodes) : () => {}}
                    >
                        Add Item
                    </Button>
                </div>
            </motion.div>}
        </div>
    )
}