import { Button } from '@mui/material';
const { updateUserVersion } = require('../utils/user.js');

export default function Update(){
    return(
        <div className='absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center z-[9998]'>
            <div
                className='absolute top-0 left-0 right-0 bottom-0'
                style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
            ></div>
            <div className='bg-slate-700 p-6 flex flex-col items-center text-white z-[9999]'>
                <div className='text-2xl font-bold mb-4'>Vishi has been updated!</div>
                <div className='text-lg mb-4'>To apply the update, click "OKAY"</div>
                <div className='text-lg mb-4 font-bold'>Vishi version {process.env.REACT_APP_VERSION} patch notes:</div>
                <div className='bg-slate-800 p-4'>
                    <div className='text-lg text-start w-full'>- Fixed a bug causing the restock page to update slowly</div>
                    <div className='text-lg text-start w-full'>- Added loading feedback to restock page</div>
                    <div className='text-lg text-start w-full'>- Added home screen navigation buttons</div>
                    <div className='text-lg text-start w-full'>- Added patch notes prompt</div>
                </div>
                <div className='w-full mt-5'>
                    <Button
                        variant='contained'
                        color='primary'
                        fullWidth
                        onClick={() => updateUserVersion()}
                    >OKAY</Button>
                </div>

            </div>
        </div>
    )
}