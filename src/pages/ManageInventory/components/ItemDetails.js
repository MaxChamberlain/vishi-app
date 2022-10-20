import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import InventoryIcon from '@mui/icons-material/Inventory';
import MapIcon from '@mui/icons-material/Map';
import { LinearProgress, TextField, Button, ButtonGroup, List, ListItem, ListItemText, ListItemButton, Box, ListItemIcon } from '@mui/material';
const { changeItem } = require('../utils/api.js');

export default function ItemDetails({ itemDetails, setItemDetails, overstock }){
    const [ changing, setChanging ] = useState(false);
    return(
        <div>
            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                transition={{duration: 0.3}}
                className='absolute top-0 right-0 left-0 bottom-0 flex justify-center items-start pt-72 text-white'
            >
                <div className='absolute top-0 right-0 left-0 bottom-0 bg-neutral-900 bg-opacity-80 z-[999]' onClick={() => setItemDetails(null)}></div>
                <div className='rounded-sm p-4 bg-slate-700 z-[999] relative'>
                    {itemDetails.Name.includes('ARCHIVED - ') && 
                        <Button variant='contained' disabled style={{ color: 'white', fontSize: 15, position: 'absolute', backgroundColor: '#EF4444', top: 10, right: 10 }} className='text-2xl'>Archived</Button>
                    }
                    <div className='text-2xl border-b border-neutral-400 mt-4 pb-2'>{itemDetails.Name.replace('ARCHIVED - ', '')}</div>
                    <div className='text-2xl pt-2'>{itemDetails.SKU}</div>
                    <br />
                    <Button variant='contained' fullWidth disabled style={{ color: 'white', borderBottom: '1px solid rgba(0,0,0,0.2)', fontSize: 18, backgroundColor: 'rgba(0,0,0,0.2)', padding: '0 30px' }} className='text-2xl'>Location <br /> {itemDetails.Warehouse.split(' / ')[1]} </Button>
                    <div className='w-full flex justify-around'>
                        <ButtonGroup fullWidth >
                            <Button variant='contained' disabled style={{ color: 'white', fontSize: 18, backgroundColor: 'rgba(0,0,0,0.2)', padding: '0 30px' }} className='text-2xl'>Size <br /> {itemDetails.SKU.split('-')[itemDetails.SKU.split('-').length - 1]}</Button>
                            <Button variant='contained' disabled style={{ color: 'white', fontSize: 18, backgroundColor: 'rgba(0,0,0,0.2)', padding: '0 30px' }} className='text-2xl'>Color <br /> {itemDetails.Name.replace('ARCHIVED - ', '').split(' ').filter(x => x !== itemDetails.SKU.split('-')[itemDetails.SKU.split('-').length - 1]).join(' ').split(' - ')[1]} </Button>
                            {changing === 'price' ? 
                            <TextField
                                label='Price'
                                value={itemDetails.Price}
                                onChange={(e) => setItemDetails({...itemDetails, Price: e.target.value})}
                                onBlur={(e) => {
                                    setChanging(false);
                                    changeItem(itemDetails.Barcode, e.target.value, setItemDetails)
                                }}
                                type='number'
                                style={{
                                    width: 110,
                                }}
                                autoFocus
                            />
                            :
                            <Button variant='contained' style={{ color: 'white', fontSize: 18, backgroundColor: 'rgba(0,0,0,0.2)', boxShadow: 'none', padding: '0 30px' }} className='text-2xl' onClick={() => setChanging('price')}>
                                Price <br /> ${itemDetails.Price}
                            </Button>}
                        </ButtonGroup>
                    </div>
                    <div className='mt-4'>
                        {overstock ? 
                        <Box sx={{ width: '100%', bgcolor: 'rgba(0,0,0,0.3)' }}>
                            <List fullWidth>
                                <ListItem fullWidth disablePadding>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <MapIcon />
                                        </ListItemIcon>
                                        <ListItemText style={{ width: '100%', textAlign: 'center', paddingRight: 80 }} primary='Locations' />
                                    </ListItemButton>
                                </ListItem>
                                {
                                overstock
                                    .filter(ov => ov.item === itemDetails.SKU)
                                    .map(ov => 
                                        <ListItem fullWidth disablePadding>
                                            <ListItemButton>
                                                <div style={{ marginLeft: 10 }}>→</div>
                                                <ListItemIcon style={{ paddingLeft: 20 }}>
                                                    <InventoryIcon />
                                                </ListItemIcon>
                                                <ListItemText style={{ width: '100%', textAlign: 'center' }} primary={
                                                    ov.position.includes('ROW') ? 'Event Row ' + (parseInt(ov.position) - 100) + ' slot ' + (parseInt(ov.position.split('/')[0].split(' - ')[1]) - 100) : ov.position.includes('TempTemp') ? 'Temporary Slot ' + ov.position.split('/')[1] : ov.position.includes('BAY') ? 'Bay Row ' + (parseInt(ov.position) - 200) + ' slot ' + (parseInt(ov.position.split('/')[0].split(' - ')[1]) - 200) : ov.position
                                                } />
                                            </ListItemButton>
                                        </ListItem>
                                        )
                                }
                            </List>
                        </Box>
                        :
                        <LinearProgress />}
                    </div>
                </div>
            </motion.div>
        </div>
    )
}