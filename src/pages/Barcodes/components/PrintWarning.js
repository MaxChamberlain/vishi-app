import { Button } from '@mui/material';

export default function PrintWarning({ selected, handlePrint, setSelected, setPrinting }){
    return(
        <div className='absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center z-[9998]' >
            <div 
                className='absolute top-0 left-0 right-0 bottom-0' 
                style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                onClick={() => setPrinting(false)}
            ></div>
            <div className='bg-slate-700 p-6 rounded flex flex-col items-center text-white z-[9999]'>
                <div className='text-2xl font-bold mb-4'>Are you sure you want to print?</div>
                <div className='text-lg mb-4'>You are about to print {selected.length} labels.</div>
                <div className='text-lg mb-4'>In this batch you have:</div>
                {selected.filter(e => e.archived).length > 0 && <div className='text-lg mb-4 text-red-400'>Archived SKUS</div>}
                {
                [...new Set(selected
                    .map(e => e.sku))].map((e, i) => 
                        <div key={i} className='text-lg mb-2'>{e}</div>
                    )
                }
                <Button
                    variant='contained'
                    color='primary'
                    fullWidth
                    onClick={() => handlePrint(setPrinting, selected)}
                    style={{ marginTop: 20 }}
                >Continue</Button>
            </div>
        </div>
    )
}