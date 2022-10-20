import DropdownItem from "./DropdownItem";
import { useState, useEffect } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { useNavigate } from "react-router-dom";
const hamburger = require("../../assets/images/hamburger.png");

export default function Header(){
    const [ hovering, setHovering ] = useState('null/null');
    const [ dropdown, setDropdown ] = useState(false);

    const navigate = useNavigate();

    return (
        <>
        <div className='w-screen h-12 bg-neutral-900 z-[9998]'>
            <div className='cursor-pointer z-[9999]' onClick={() => navigate('/')}>
                <svg width="38" height="38" viewBox="0 0 384 384" fill="none" xmlns="http://www.w3.org/2000/svg" className='pt-2 ml-2'>
                    <rect width="384" height="384"/>
                    <path d="M192 32C187.757 32 183.687 33.6857 180.686 36.6863C177.686 39.6869 176 43.7565 176 48C176 52.2435 177.686 56.3131 180.686 59.3137C183.687 62.3143 187.757 64 192 64C196.243 64 200.313 62.3143 203.314 59.3137C206.314 56.3131 208 52.2435 208 48C208 43.7565 206.314 39.6869 203.314 36.6863C200.313 33.6857 196.243 32 192 32V32ZM360 176C357.878 176 355.843 176.843 354.343 178.343C352.843 179.843 352 181.878 352 184C352 186.122 352.843 188.157 354.343 189.657C355.843 191.157 357.878 192 360 192C362.122 192 364.157 191.157 365.657 189.657C367.157 188.157 368 186.122 368 184C368 181.878 367.157 179.843 365.657 178.343C364.157 176.843 362.122 176 360 176ZM24 176C21.8783 176 19.8434 176.843 18.3431 178.343C16.8429 179.843 16 181.878 16 184C16 186.122 16.8429 188.157 18.3431 189.657C19.8434 191.157 21.8783 192 24 192C26.1217 192 28.1566 191.157 29.6569 189.657C31.1571 188.157 32 186.122 32 184C32 181.878 31.1571 179.843 29.6569 178.343C28.1566 176.843 26.1217 176 24 176Z" fill="white"/>
                    <path d="M203.36 36.736L192 49.6L180.64 36.736L19.248 177.568L24 192H64V320C64 328.832 71.168 336 80 336H144C152.832 336 160 328.832 160 320V224H224V320C224 328.832 231.168 336 240 336H304C312.832 336 320 328.832 320 320V192H360L364.752 177.568L203.36 36.736Z" fill="white"/>
                </svg>
            </div>
        </div>
        <div className='w-screen h-10 bg-neutral-900 text-white text-lg shadow-xl flex justify-around items-center z-[500]'>
            <DropdownItem 
                title='Warehouse'
                setHovering={setHovering}
                hovering={hovering}
                items={[
                    {
                        title: 'Restock Requests', 
                        items: [
                            {title: 'Request an Item', link: '/inventory/restocks/create'},
                            {title: 'View Requests', link: '/inventory/restocks/view'},
                        ]
                    },
                    {
                        title: 'Barcodes',
                        items: [
                            {title: 'Print Barcodes', link: '/inventory/barcodes'},
                        ]
                    },
                    {
                        title: 'Pallets',
                        items: [
                            {title: 'Pallet Tracker', link: '/inventory/pallets'},
                        ]
                    },
                    {
                        title: 'Inventory',
                        items: [
                            {title: 'Manage Vishi Inventory', link: '/inventory/manage'},
                        ]
                    }
                ]}
            />
            <div className="absolute top-3 right-4 z-[10000]" onClick={() => setDropdown(was => !was)}>
                <svg className='w-6 h-6 cursor-pointer'>
                    <line x1="0" y1="50%" x2="100%" y2="50%" stroke="white" strokeWidth="3"/>
                    <line x1="0" y1="25%" x2="100%" y2="25%" stroke="white" strokeWidth="3"/>
                    <line x1="0" y1="75%" x2="100%" y2="75%" stroke="white" strokeWidth="3"/>
                </svg>
            </div>
        </div>
        <TransitionGroup component='div'>
            {dropdown && 
            <CSSTransition timeout={300} classNames='right-menu'>
                <div className={`absolute right-0 top-12 p-2 w-52 bg-neutral-900 bottom-0 text-white text-lg shadow-xl flex flex-col justify-center items-center z-[9999]`}>
                    <div className='absolute text-center bottom-4 right-4  w-44 border border-red-500 text-red-500 cursor-pointer' onClick={() => {
                        localStorage.removeItem('_vishi:@user_info');
                        window.location.href = '/login';
                    }}>
                        Sign Out
                    </div>
                </div>
            </CSSTransition>
            }
        </TransitionGroup>
        </>
    );
}