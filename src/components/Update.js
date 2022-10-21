import { Button } from '@mui/material';
const { updateUserVersion } = require('../utils/user.js');

export default function Update(){
    return(
        <div className='absolute top-0 left-0 right-0 bottom-0 flex justify-center items-start z-[9998]'>
            <div
                className='absolute top-0 left-0 right-0 bottom-0'
                style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
            ></div>
            <div className='bg-slate-700 p-6 flex flex-col items-center text-white z-[9999]'>
                <div className='text-2xl font-bold mb-4'>Vishi has been updated!</div>
                <div className='text-lg mb-4'>To apply the update, click "OKAY"</div>
                <div className='text-lg mb-4 font-bold'>Vishi version {process.env.REACT_APP_VERSION} patch notes:</div>
                <div className='w-full text-start mt-6 text-xl'>Bug Fixes</div>
                <div className='bg-slate-800 p-4 w-full'>
                </div>
                <div className='w-full text-start mt-6 text-xl'>General Additions</div>
                <div className='bg-slate-800 p-4 w-full'>
                    <div className='text-lg text-start w-full'>- Changed mobile design to better mimic a native application</div>
                    <div className='text-lg text-start w-full'>- Added an inventory manager for VISHI'S INVENTORY (does not affect shiphero)</div>
                    <div className='text-lg text-start w-full'>- Added ability to add items to vishi within this page (does not affect shiphero)</div>
                    <div className='text-lg text-start w-full'>- Added ability to change the price details of a Vishi item within this page (does not affect shiphero)</div>
                    <div className='text-lg text-start w-full'>- Added ability to see overstock locations of selected item within this page</div>
                </div>
                <div className='w-full text-start mt-6 text-xl font-bold'>Restocks Page</div>
                <div className='bg-slate-800 p-4 w-full'>
                    <div className='text-lg text-start w-full'>- Added ability to undo changes</div>
                    <div className='text-lg text-start w-full font-bold'>- Added loading feedback to status change of a card</div>
                </div>
                <div className='w-full text-start mt-6 text-xl'>Barcode Printing</div>
                <div className='bg-slate-800 p-4 w-full'>
                    <div className='text-lg text-start w-full'>- Added ability to keep selection across searches</div>
                    <div className='text-lg text-start w-full'>- Added "Clear Selection" Button"</div>
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