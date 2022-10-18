import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home(){
    const [ menu, setMenu ] = useState('warehouse');
    const navigate = useNavigate();

    return(
        <motion.div 
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0, x: -100}}
            transition={{duration: 0.3}}
            className='w-screen flex justify-center align-center p-10'
        >
            <motion.div className='p-5 w-full bg-slate-800 text-white text-2xl relative'>
                <div className='m-5'>
                    Warehouse
                </div>
                <svg 
                    className={`absolute cursor-pointer right-0 top-0 h-24 py-8 w-3 mr-12 -rotate-90`} 
                    onClick={() => setMenu(was => was === 'warehouse' ? null : 'warehouse')}
                >
                    <motion.line x1="0" y1="0" x2="90%" y2="50%" stroke="white" strokeWidth="2" strokeLinecap='butt'
                        animate={{ x1: menu === 'warehouse' ? 0 : '90%', x2: menu === 'warehouse' ? '90%' : 0 }}
                    />
                    <motion.line x1="0" y1="100%" x2="90%" y2="50%" stroke="white" strokeWidth="2" strokeLinecap='butt'
                        animate={{ x1: menu === 'warehouse' ? 0 : '90%', x2: menu === 'warehouse' ? '90%' : 0 }}
                    />
                </svg>
                {menu === 'warehouse' && <div className='bg-slate-800 mt-4' style={{
                    backgroundColor: 'rgb(26, 32, 44)'
                }}>
                    <div className='cursor-pointer p-4 border-slate-800 border-b-2' onClick={() => navigate('/inventory/restocks/create')}>
                        Request An Item
                    </div>
                    <div className='cursor-pointer p-4 border-slate-800 border-b-2' onClick={() => navigate('/inventory/restocks/view')}>
                        View Requests
                    </div>
                    <div className='cursor-pointer p-4 border-slate-800 border-b-2' onClick={() => navigate('/inventory/barcodes')}>
                        Print Barcodes
                    </div>
                    <div className='cursor-pointer p-4' onClick={() => navigate('/inventory/pallets')}>
                        Pallet Tracker
                    </div>
                </div>}
            </motion.div>
        </motion.div>
    )
}