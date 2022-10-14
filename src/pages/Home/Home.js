import { motion } from 'framer-motion';

export default function Home(){
    return(
        <motion.div 
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.3}}
            className='w-screen grid justify-center align-center pt-52 pl-24'
            style={{gridTemplateColumns: 'repeat(auto-fit, 760px)', gridGap: 20}}
        >
            <iframe 
                src='https://vishi.us/inventory/restocks/view'
                style={{
                    width: 1320,
                    height: 1000,
                    transform: 'scale(0.5)',
                    transformOrigin: '0 0',
                }}
                className='shadow-2xl border border-slate-700'
            />
            <iframe 
                src='https://vishi.us/inventory/pallets'
                style={{
                    width: 1320,
                    height: 1000,
                    transform: 'scale(0.5)',
                    transformOrigin: '0 0',
                }}
                className='shadow-2xl border border-slate-700'
            />
        </motion.div>
    )
}