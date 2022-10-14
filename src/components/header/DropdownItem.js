import { useNavigate } from 'react-router-dom';

export default function DropdownItem({ title, items, setHovering, hovering }){
    const navigate = useNavigate();

    return(
        <div 
            className='h-10 bg-neutral-800 text-white shadow-xl border-x border-neutral-900 flex justify-center items-center p-2 w-full relative z-[9990]'
            onMouseEnter={() => setHovering(was => `${title}/${was.split('/')[1]}`)}
            onMouseLeave={() => setHovering('null/null')}
        >
            {title}
            {hovering && hovering.split('/')[0] === title &&
                <div className='absolute top-full left-1/2 -translate-x-1/2'>
                    {items.map(e => {
                        return <div 
                            className="p-2 text-xs md:text-lg border-stone-400 border bg-neutral-800 relative"
                            onMouseEnter={() => setHovering(was => `${was.split('/')[0]}/${e.title}`)}
                            onMouseLeave={() => setHovering(was => `${was.split('/')[0]}/null`)}
                        >
                            <div>
                                {e.title}
                            </div>
                            <div className="absolute p-2 flex flex-col" style={{ top: '-9px', right: 'calc(100% - 8px)', }}>
                                {hovering && hovering.split('/')[1] === e.title && e.items && 
                                    e.items.map(x => {
                                        return <div className="p-2 border-stone-400 border bg-neutral-800 w-max min-w-full cursor-pointer">
                                            <div onClick={() => {setHovering('null/null'); navigate(x.link)}}>{x.title}</div>
                                        </div>
                                    })
                                }  
                            </div> 
                        </div>
                    })}
                </div>
            }
        </div>
    )
}