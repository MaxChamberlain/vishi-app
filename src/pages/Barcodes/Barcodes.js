import { FormControl, InputLabel, MenuItem, Select, Input, Button, FormHelperText } from '@mui/material';
import { useState, useEffect } from 'react';
import ItemList from './components/ItemList';
import PrintWarning from './components/PrintWarning';
import Barcode from 'react-barcode/lib/react-barcode';
import History from './components/History';
import { handlePrint } from './utils/print';
const { getProducts } = require('./utils/api.js');

export default function Barcodes(){
    const [ inputSku, setInputSku ] = useState('');
    const [ returnItems, setReturnItems ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [ selected, setSelected ] = useState([]);
    const [ printing, setPrinting ] = useState(false);
    const [ history, setHistory ] = useState([]);

    return(
        <div>

            <div id='printable-content' style={{
                position: 'absolute',
                left: '-1000vw',
            }}>
                {selected.length > 0 && 
                    selected.sort((a, b) => {
                        return a.sku.localeCompare(b.sku)
                    } ).map((e, i) => <div key={i} style={{
                        backgroundColor: 'white',
                        aspectRatio: 1,
                        color: 'black',
                        padding: 5,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        fontSize: 12,
                        width: 192,
                        height: 192,
                        pageBreakAfter: 'always',
                        position: 'relative',
                        fontWeight: 'bold',
                        fontFamily: 'sans-serif'
                    }}>
                            <>
                                <img id='logo-top-image' src='https://cdn.shopify.com/s/files/1/0005/7750/3289/files/Vitality_Logo-02.png?v=1650389244' style={{ width: '90%', marginLeft: '5%', marginTop: 10}} />
                                <div style={{ margin: '5px 0', marginTop: 10 }}>PRODUCT - { e.name }</div>
                                <div style={{ margin: '5px 0' }}>COLOR - { e.color }</div>
                                <div style={{ margin: '5px 0' }}>SIZE - { e.size }</div>
                                <div style={{ margin: '5px 0' }}>SKU - { e.sku }</div>
                                <Barcode value={e.barcode} width={1.7} background='transparent' fontSize='10px' marginLeft={10} height='30px' />
                            </>

                    </div>)
                }
            </div>

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
                                value={inputSku}
                                style={{color: 'white'}}
                                onKeyDown={(e) => {
                                    if(e.key === 'Enter'){
                                        (inputSku.length > 5 && inputSku.length < 20) ? getProducts(inputSku, setReturnItems, setLoading) : alert('Please enter a valid SKU. (6-20 characters)');
                                    }
                                }}
                            />
                            <FormHelperText style={{ color: 'white' }}>Enter the SKU of the item (6-20 characters)</FormHelperText>
                        </FormControl>
                    </div>
                    <div className='w-2/5 h-full flex justify-end items-center'>
                        <Button 
                            loading={true}
                            variant={inputSku ? 'contained' : 'outlined'}
                            style={{height: '100%', width: '80%'}}
                            color='primary'
                            fullWidth
                            onClick={() => (inputSku.length > 5 && inputSku.length < 20) ? getProducts(inputSku, setReturnItems, setLoading) : alert('Please enter a valid SKU. (6-20 characters)')}
                        >Search</Button>
                    </div>
                </div>
                <div className='flex items-around w-full mt-8 relative justify-around flex-row'>
                    <Button
                        variant={selected.length > 0 ? 'contained' : 'outlined'}
                        color='primary'
                        style={{height: '100%', width: '100%'}}
                        onClick={selected.length > 0 ? () => setPrinting(true) : undefined}
                    >
                        Print
                    </Button>
                </div>
            </div>
            {printing && <PrintWarning selected={selected} handlePrint={handlePrint} setSelected={setSelected} setPrinting={setPrinting} />}
            {returnItems.length > 0 && <ItemList selected={selected} data={returnItems} loading={loading} setSelected={setSelected} setHistory={setHistory} />}
            {history.length > 0 && <History data={history} setHistory={setHistory} />}
        </div>
    )
}