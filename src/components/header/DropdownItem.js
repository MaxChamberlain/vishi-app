import { useNavigate } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

export default function DropdownItem({ title, items, setHovering, hovering }){
    const navigate = useNavigate();
    return(
        <div className='w-full'>
            <div 
                className='h-10 bg-neutral-800 text-white shadow-xl border-x border-neutral-900 flex justify-center items-center p-2 w-full relative'
                onMouseEnter={() => setHovering(was => `${title}/${was.split('/')[1]}`)}
                onMouseLeave={() => setHovering('null/null')}
            >
                <div className='z-[500]' >{title}</div>
                <TransitionGroup component='div' className='z-[1]'>
                    <div>
                        <CSSTransition timeout={300} classNames="fade" in={hovering.split('/')[0] === title} appear unmountOnExit>
                            <div>
                                <div className='absolute top-full left-1/2 -translate-x-1/2 z-[1]'>
                                    {items.map(e => {
                                        return <div 
                                            className="p-2 text-xs md:text-lg border-stone-400 border bg-neutral-800 relative z-[1] text-white"
                                            onMouseEnter={() => setHovering(was => `${was.split('/')[0]}/${e.title}`)}
                                            onMouseLeave={() => setHovering(was => `${was.split('/')[0]}/null`)}
                                        >
                                            <div>
                                                {e.title}
                                            </div>
                                            <div className="absolute p-2 flex flex-col" style={{ top: '-9px', right: 'calc(100% - 8px)', }}>
                                                <CSSTransition timeout={300} classNames="right-to-left-fade" in={hovering.split('/')[1] === e.title} appear unmountOnExit>
                                                    <div>
                                                        {e.items.map(x => {
                                                            return <div className="p-2 border-stone-400 border bg-neutral-800 w-max min-w-full cursor-pointer z-[1]">
                                                                <div onClick={() => {setHovering('null/null'); navigate(x.link)}}>{x.title}</div>
                                                            </div>
                                                        })}
                                                    </div>
                                                </CSSTransition>
                                            </div> 
                                        </div>
                                    })}
                                </div>
                            </div>
                        </CSSTransition>
                    </div>
                </TransitionGroup>
            </div>
        </div>
    )
}