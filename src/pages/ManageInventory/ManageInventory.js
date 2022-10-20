import { motion } from 'framer-motion';
import { FormControl, InputLabel, Input, Button, FormHelperText } from '@mui/material';
import { useState, useEffect } from 'react';
import ItemList from './components/ItemList';
import AddItems from './components/AddItems';
const { getProducts } = require('./utils/api.js');

export default function ManageInventory(){
    const [ inputSku, setInputSku ] = useState('');
    const [ returnItems, setReturnItems ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [ selected, setSelected ] = useState([]);
    const [ empty, setEmpty ] = useState(false);

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
                            onClick={() => (inputSku.includes('-')) ? getProducts(inputSku, setReturnItems, setLoading, setEmpty) : alert('Please enter a valid SKU. (Must contain a dash)')}
                        >Search</Button>
                    </div>
                </div>
            </div>
            <AddItems />
            {returnItems.length > 0 && <ItemList selected={selected} data={returnItems} loading={loading} setSelected={setSelected} />}
        </motion.div>
    )
}