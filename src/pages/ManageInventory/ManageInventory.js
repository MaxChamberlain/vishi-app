import { motion } from 'framer-motion';
import { FormControl, InputLabel, Input, Button, FormHelperText } from '@mui/material';
import { useState, useEffect } from 'react';
import ItemList from './components/ItemList';
import AddItems from './components/AddItems';
import ItemDetails from './components/ItemDetails';
const { getProducts } = require('./utils/api.js');
const logo = require('../../assets/images/logo.png');

export default function ManageInventory(){
    const [ inputSku, setInputSku ] = useState('');
    const [ returnItems, setReturnItems ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [ selected, setSelected ] = useState([]);
    const [ itemDetails, setItemDetails ] = useState(null);
    const [ overstock, setOverstock ] = useState(null);

    return(
        <motion.div 
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.3}}
        >

            <div className='p-6 text-white flex bg-slate-800 flex-col' style={{ width: '95%', margin: '2.5%' }}>
                <div className='flex items-around w-full relative justify-around flex-row'>
                    <div className='w-3/5'>
                        <FormControl fullWidth>
                            <InputLabel htmlFor='item-name' style={{ color: 'white' }}>Item SKU</InputLabel>
                            <Input 
                                autoFocus
                                color={'primary'}
                                fullWidth
                                onChange={(e) => setInputSku(e.target.value)}
                                value={inputSku.toUpperCase()}
                                style={{color: 'white'}}
                                onKeyDown={(e) => {
                                    if(e.key === 'Enter'){
                                        (inputSku.includes('-')) ? getProducts(inputSku, setReturnItems, setLoading) : alert('Please enter a valid SKU. (Must contain a dash)');
                                    }
                                }}
                            />
                            <FormHelperText style={{ color: 'white' }}>Enter the SKU of the item (Must contain a dash)</FormHelperText>
                        </FormControl>
                    </div>
                    <div className='w-2/5 h-full flex justify-end items-center'>
                        <Button 
                            loading={true}
                            variant={inputSku ? 'contained' : 'outlined'}
                            style={{height: '100%', width: '80%'}}
                            color='primary'
                            fullWidth
                            onClick={() => (inputSku.includes('-')) ? getProducts(inputSku, setReturnItems, setLoading) : alert('Please enter a valid SKU. (Must contain a dash)')}
                        >Search</Button>
                    </div>
                </div>
            </div>
            {loading && <div className='w-screen flex justify-center items-center flex-col' style={{ height: 'calc(100vh - 100px)' }}>
                <img
                    src={logo}
                    className='w-12 h-12 invert animate-ping mb-10'
                />
                <div className='text-white text-xl animate-pulse'>
                    Loading...
                </div>
            </div>}
            {itemDetails && <ItemDetails overstock={overstock} itemDetails={itemDetails} setItemDetails={setItemDetails} />}
            <AddItems />
            {returnItems.length > 0 && <ItemList selected={selected} data={returnItems} loading={loading} setSelected={setSelected} setLoading={setLoading} setItemDetails={setItemDetails} setOverstock={setOverstock} />}
        </motion.div>
    )
}