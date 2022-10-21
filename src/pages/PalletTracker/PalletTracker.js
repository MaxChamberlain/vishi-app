import PalletSpace from './components/PalletSpace'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import {isMobile} from 'react-device-detect';
import { Button, ButtonGroup, Autocomplete, Badge, FormControl, TextField, Paper } from '@mui/material'
import { motion } from 'framer-motion';

export default function PalletTracker(){
    const [ usedPallets, setUsedPallets ] = useState({})
    const [ displayedPallets, setDisplayedPallets ] = useState({})
    const [ filters, setFilters ] = useState('')
    const [ page, setPage ] = useState('racks')   
    const [ loading, setLoading ] = useState(null)
    const [ hovering, setHovering ] = useState(null)
    const [ time, setTime ] = useState(new Date())
    const [ pageLoaded, setPageLoaded ] = useState(new Date())
    const [ editedBy, setEditedBy ] = useState(null)
    const [ confirmEdit, setConfirmEdit ] = useState(null)


    const urlParams = new URLSearchParams(window.location.search);
    const edit = urlParams.get('edit')
    const editing = edit === 'true' ? true : false


    useEffect(() => {
        const init = async () => {
            setLoading({
                message: 'Loading...',
                color: '#56d154'
            })
            await getPallets()
            setLoading(null)
        }
        init()
        if(!editing){
            setInterval(() => getPallets(), 2000)
        }
        setInterval(() => setTime(new Date()), 1000)
    }, [])

    useEffect(() => {
        if(usedPallets){
            // console log usedPallets where any of the items include the filters
            const filteredPallets = {}
            Object.keys(usedPallets).forEach(row => {
                Object.keys(usedPallets[row]).forEach(slot => {
                    Object.keys(usedPallets[row][slot]).forEach(side => {
                        if(usedPallets[row][slot][side].items.some(item => item.includes(filters))){
                            if(!filteredPallets[row]){
                                filteredPallets[row] = {}
                            }
                            if(!filteredPallets[row][slot]){
                                filteredPallets[row][slot] = {}
                            }
                            filteredPallets[row][slot][side] = usedPallets[row][slot][side]
                        }
                    } )
                } )
            })
            setDisplayedPallets(filteredPallets)
        }
    }, [filters, usedPallets])

    let pallets = [[],[],[]] 
    for (let i = 0; i < 3; i++) {
        for(let x = 0; x < 44; x += 2){
            pallets[i].push({
                row: i + 1,
                slot: x + 1,
                side: 'MF'
            })
            pallets[i].push({
                row: i + 1,
                slot: x + 1,
                side: 'MB'
            })
            pallets[i].push({
                row: i + 1,
                slot: x + 1,
                side: 'TF'
            })
            pallets[i].push({
                row: i + 1,
                slot: x + 1,
                side: 'TB'
            })
        }
    }
    
    let eventPallets = []
    for (let i = 0; i < 7; i++) {
        eventPallets.push([])
        for(let x = 0; x < 12; x ++){
            if(i < 3){
                if(x < 6){
                    eventPallets[i].push({
                        row: i + 101,
                        slot: x + 101,
                        side: 'ROW'
                    }) 
                }
            }else{
                eventPallets[i].push({
                    row: i + 101,
                    slot: x + 101,
                    side: 'ROW'
                })
            }
        }
    }
    
    let bayPallets = []
    for (let i = 0; i < 7; i++) {
        bayPallets.push([])
        for(let x = 0; x < 11; x ++){
            bayPallets[i].push({
                row: i + 201,
                slot: x + 201,
                side: 'BAY'
            })
        }
    }

    return(
        <motion.div 
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.3}}
        >
        <TransitionGroup component='div'>
            {hovering && 
                <CSSTransition timeout={800} classNames='fade-blur'>
                    <div className='absolute top-36 text-white left-9 right-0 flex justify-center align-center text-xl'>
                        <div className='p-2 bg-slate-700'>
                            {hovering}
                        </div>
                    </div>
                </CSSTransition>
            }
        </TransitionGroup>
        {!editing && (['kreilly@shopvitality.com','mchamberlain@shopvitality.com','apafundi@shopvitality.com'].includes(JSON.parse(localStorage.getItem('_vishi:@user_info')).email)) &&
            <div className='absolute top-28 right-6 text-white cursor-pointer' >
                <Button
                    variant='contained'
                    onClick={() => {
                        const go = async () => {
                            const lastEdited = await getEdit()
                            setConfirmEdit(lastEdited)
                            if(!lastEdited){
                                addEdit()
                            }
                        }
                        go()
                    }}
                >
                    Start Editing
                </Button>
            </div>
        }
        {loading && <div style={{
            position: 'absolute',
            top: 100,
            left: 0,
            right: 20,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 25
        }}>
            <div style={{
                padding: 10,
                backgroundColor: loading.color,
                borderRadius: 5,
                zIndex: 9999,
                color: 'white',
            }}>
                {loading.message}    
            </div>
        </div>}
        {confirmEdit && 
            <div className='absolute top-28 left-0 right-0 bottom-0 flex justify-center align-center z-[9998] text-white' style={{ backgroundColor: 'rgba(0,0,0,0.5)', }}>
                <div style={{
                    padding: 20,
                    backgroundColor: 'rgb(72, 74, 77)',
                    borderRadius: 5,
                    zIndex: 9999,
                    fontSize: 20,
                    height: 'fit-content',
                    marginTop: 40
                }}>
                    <div className='font-bold text-center'>{confirmEdit.user} started editing this page at {new Date(confirmEdit.started).toLocaleTimeString('en-US')} and hasn't closed it.</div>
                    <div className='mt-4 text-center'>If you continue, their changes will be discarded and you will be editing.</div>
                    <div className='text-center mt-4 font-bold'>Are you sure you want to continue?</div>
                    <div className='flex justify-end mt-4'>
                        <Button
                            variant='outlined'
                            color='primary'
                            style={{ color: 'white', borderColor: 'white', marginRight: 10 }}
                            onClick={() => setConfirmEdit(null)}
                        >Cancel</Button>
                        <Button
                            variant='contained'
                            color='primary'
                            onClick={addEdit}
                        >Continue</Button>
                    </div>
                </div>
            </div>
        }
        { (['kreilly@shopvitality.com','mchamberlain@shopvitality.com','apafundi@shopvitality.com'].includes(JSON.parse(localStorage.getItem('_vishi:@user_info')).email)) && editing && <div style={{
            display: 'flex',
            position: 'absolute',
            top: 100,
            right: 20,
            color: 'white'
        }}>
            <div style={{
                position: 'fixed',
                top: 90,
                left: 20,
                backgroundColor: new Date(new Date(time) - new Date(pageLoaded)).getMinutes() < 5 ? '#2eb83a' : new Date(new Date(time) - new Date(pageLoaded)).getMinutes() < 20 ? '#cc8d18' : '#b8372e',
                padding: 10,
                cursor: 'pointer'
            }}
            onClick={() => window.location.reload()}
            >
                Updated {
                    `
                    ${new Date(new Date(time) - new Date(pageLoaded)).getMinutes()}m
                    ${new Date(new Date(time) - new Date(pageLoaded)).getSeconds()}s
                    `
                } ago.
            </div>
            <Button
                variant='contained'
                color='primary'
                onClick={() => {
                insertPallets(usedPallets)
            }}>Save</Button>
            <Button
                variant='contained'
                color='primary'
                onClick={stopEdit}
                style={{ backgroundColor: 'rgb(184, 55, 46)', marginLeft: 10 }}
            >Stop Editing</Button>
        </div>}
        <div style={{
            width: '80%',
            padding: 20,
            marginTop: 80,
            display: 'flex',
            justifyContent: 'flex-srart',
            color: 'white',
            fontSize: 20,
            zIndex: 100,
            position: 'static'
        }}>
            <FormControl style={{ width: '50%', color: 'white', marginRight: 20 }}>
                <Autocomplete style={{
                    fontSize: 25,
                    color: 'white',
                    width: '100%',
                }}
                    size={'small'}
                    id='sku'
                    includeInputInList
                    options={[...new Set(Object.keys(usedPallets).map(a => 
                        Object.keys(usedPallets[a]).map(b => (
                            Object.keys(usedPallets[a][b]).map(c => (
                                usedPallets[a][b][c]
                            ))
                        )    
                    ).flat()).flat().map(e => e.items).flat())]}
                    PaperComponent={children => {
                        return (
                            <Paper {...children} style={{ backgroundColor: 'rgb(46, 52, 64)', color: 'white' }} />
                        )
                    }}
                    renderOption={(option) => (
                        <div style={{ color: 'white', zIndex: 9999 }} onClick={() => setFilters(option.key)}
                            className='p-1 pl-2 cursor-pointer hover:bg-slate-600 text-white'
                        >
                            {option.key}
                        </div>
                    )}
                    value={filters}
                    renderInput={params => (
                        <TextField {...params} label={filters || 'SKU'} variant='outlined' style={{ color: 'white', width: '100%'  }} defaultValue={filters} value={filters} onChange={e => setFilters(e.target.value.toUpperCase())} />
                    )}
                    freeSolo
                />
            </FormControl>
            <div style={{
                display: 'flex',
                justifyContent: 'flex-start',
                width: '100%',
                alignItems: 'center',
                fontSize: 20
            }}>
                <ButtonGroup>
                    <Badge
                        badgeContent={Object.keys(displayedPallets).length > 0 ? ((Object.keys(Object.keys(displayedPallets).map(e => displayedPallets[e]).flat(2)[0]).map(e => Object.keys(Object.keys(displayedPallets).map(e => displayedPallets[e]).flat(2)[0][e])).flat().filter(e => !e.includes('ROW') && !e.includes('BAY')) || [])?.length || 0) : 0}
                        color='primary'
                        style={{ marginRight: 30, zIndex: 100 }}
                    >
                        <Button
                            variant='contained'
                            style={{ backgroundColor: page === 'racks' ? '#dd7000' : 'rgb(46,52,64)' }}
                            onClick={() => setPage('racks')}
                        >Racks</Button>
                    </Badge>
                    <Badge
                        badgeContent={Object.keys(displayedPallets).length > 0 ? ((Object.keys(displayedPallets).map(e => displayedPallets[e]).flat(2).filter(e => Object.keys(e).some(x => parseInt(x) < 200 && parseInt(x) > 100)).map(e => Object.keys(e)).flat() || [])?.length || 0) : 0}
                        color='primary'
                        style={{ marginRight: 30, zIndex: 100 }}
                    >
                        <Button
                            variant='contained'
                            style={{ backgroundColor: page === 'event' ? '#dd7000' : 'rgb(46,52,64)' }}
                            onClick={() => setPage('event')}
                        >Event Space</Button>
                    </Badge>
                    <Badge
                        badgeContent={Object.keys(displayedPallets).length > 0 ? ((Object.keys(displayedPallets).map(e => displayedPallets[e]).flat(2).filter(e => Object.keys(e).some(x => parseInt(x) < 300 && parseInt(x) > 200)).map(e => Object.keys(e)).flat() || [])?.length || 0) : 0}
                        color='primary'
                        style={{ marginRight: 30, zIndex: 100 }}
                    >
                        <Button
                            variant='contained'
                            style={{ backgroundColor: page === 'bay' ? '#dd7000' : 'rgb(46,52,64)' }}
                            onClick={() => setPage('bay')}
                        >Bay Doors</Button>
                    </Badge>
                </ButtonGroup>
            </div>
        </div>
        <div id='content-container-main' style={{
        display: 'flex', 
        justifyContent: 'flex-start', 
        alignItems: 'flex-start',
        width: '100vw',
        height: `calc(100vh - 360px)`,
        overflow: 'auto',
        paddingBottom: 20
        }}>
            {/*!isMobile && <>
                <div id='up' style={{
                    position: 'absolute',
                    bottom: 235,
                    left: 0,
                    right: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: 'rgba(0,0,0,0.2)',
                    height: 50,
                }}>
                    <svg style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        transform: 'scale(0.6)',
                        paddingTop: 120
                    }}>
                        <path d="M0 0 L30 30 L60 0" stroke="white" strokeWidth="2" fill="none"/>
                    </svg>
                </div>
                <div id='down' style={{
                    position: 'absolute',
                    top: 180,
                    left: 0,
                    right: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: 'rgba(0,0,0,0.2)',
                    cursor: 'pointer',
                    height: 50,
                }}>
                    <svg style={{
                        transform: 'scale(0.6)',
                        paddingTop: 120
                    }}>
                        <path d="M0 30 L30 0 L60 30" stroke="white" strokeWidth="2" fill="none"/>
                    </svg>
                </div>
                </>*/}

                {page === 'racks' ? pallets.reverse().map(palletRow => {
                    return (<div style={{
                        marginRight: 40,
                        height: '100%'
                    }}>
                        <div style={{
                            color: '#fff',
                            textAlign: 'center',
                            backgroundColor: 'rgba(0, 255, 225, 0.5)',
                            padding: 5,
                            width: '100%',
                        }}>
                            Rack {palletRow[0].row}
                        </div>
                        <div style={{
                            display: 'flex',
                            width: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '50%',
                                color: 'white',
                                backgroundColor: 'rgba(115, 0, 255, 0.5)'
                            }}>
                                Middle
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '50%',
                                color: 'white',
                                backgroundColor: 'rgba(255, 0, 85, 0.5)'
                            }}>
                                Top
                            </div>
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            height: '100%',
                            width: 'calc(100% + 20px)',
                        }}>
                            <div style={{
                                color: '#fff',
                                textAlign: 'center',
                                backgroundColor: 'rgba(115, 0, 255, 0.5)',
                                padding: 5,
                                height: 1880,
                                marginRight: 10,
                            }}>
                            </div>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(4, 70px)',
                                gridGap: 10,
                                marginTop: 10,
                            }}>
                                {palletRow.map((pallet, i) => {

                                    if(displayedPallets[pallet.row] && displayedPallets[pallet.row][pallet.slot] && displayedPallets[pallet.row][pallet.slot][pallet.side]){
                                        return <div style={{ marginLeft: ((i + 2) % 4 === 0 || (i + 2) % 4 === 1) ? 20 : 0, marginTop: pallet.slot === 25 ? 50 : 0 }}>
                                            <PalletSpace
                                                setLoading={setLoading}
                                                setHovering={setHovering} 
                                                usedPallets={displayedPallets} 
                                                setUsedPallets={setUsedPallets} 
                                                setDisplayedPallets={setDisplayedPallets}
                                                id={`${pallet.row}${pallet.side} - ${pallet.slot}/${pallet.slot + 1}`} 
                                                key={`${pallet.row}${pallet.side} - ${pallet.slot}/${pallet.slot + 1}`} 
                                                items={displayedPallets[pallet.row][pallet.slot][pallet.side].items} 
                                                row={pallet.row}
                                                slot={pallet.slot}
                                                side={pallet.side}
                                                loc={`RACK ${pallet.row}${pallet.side} - ${pallet.slot}/${pallet.slot + 1}`} 
                                            />
                                        </div>
                                    }else{
                                        return <div style={{ marginLeft: ((i + 2) % 4 === 0 || (i + 2) % 4 === 1) ? 20 : 0, marginTop: pallet.slot === 25 ? 50 : 0 }}>
                                            <PalletSpace
                                                setLoading={setLoading}
                                                setHovering={setHovering} 
                                                usedPallets={displayedPallets} 
                                                setUsedPallets={setUsedPallets} 
                                                setDisplayedPallets={setDisplayedPallets}
                                                id={`${pallet.row}${pallet.side} - ${pallet.slot}/${pallet.slot + 1}`} 
                                                key={`${pallet.row}${pallet.side} - ${pallet.slot}/${pallet.slot + 1}`} 
                                                loc={`RACK ${pallet.row}${pallet.side} - ${pallet.slot}/${pallet.slot + 1}`} 
                                                row={pallet.row}
                                                slot={pallet.slot}
                                                side={pallet.side}
                                            />
                                        </div>
                                    }

                                })}
                            </div>
                            <div style={{
                                color: '#fff',
                                textAlign: 'center',
                                backgroundColor: 'rgba(255, 0, 85, 0.5)',
                                padding: 5,
                                marginLeft: 30,
                                height: 1880,
                            }}>
                            </div>
                        </div>
                    </div>)
                }) : page === 'event' ? <>
                    <div style={{
                        width: '100%',
                    }}>

                        <div style={{
                            backgroundColor: 'rgba(0,0,0,0.2)',
                            padding: 20,
                            marginRight: 40,
                            height: '100%',
                            color: 'white',
                            marginBottom: 40,
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center',
                            fontSize: 20
                        }}>
                            Bay Doors
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%',
                            alignItems: 'flex-end',
                            position: 'relative'
                        }}>

                        <div style={{
                            backgroundColor: 'rgba(0,0,0,0.2)',
                            padding: 20,
                            height: '50%',
                            color: 'white',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center',
                            fontSize: 20,
                            position: 'absolute',
                            top: 0,
                            height: '45%',
                            width: '40%'
                        }}>
                            <span>Affiliate Station</span>
                        </div>
                            {eventPallets.map(palletRow => {
                                return (<div>
                                    <div style={{
                                        color: '#ccc',
                                        textAlign: 'center',
                                        width: 70
                                    }}>
                                        Row {palletRow[0].row - 100}
                                    </div>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(1, 70px)',
                                        gridGap: 10,
                                        marginRight: 40,
                                    }}>
                                        {palletRow.map((pallet, i) => {

                                            if(displayedPallets[pallet.row] && displayedPallets[pallet.row][pallet.slot] && displayedPallets[pallet.row][pallet.slot][pallet.side]){
                                                return <div style={{ marginTop: i === 9 ? 60 : 0}}>
                                                    <PalletSpace
                                                        setLoading={setLoading}
                                                        setHovering={setHovering} 
                                                        usedPallets={displayedPallets} 
                                                        setUsedPallets={setUsedPallets} 
                                                        setDisplayedPallets={setDisplayedPallets}
                                                        id={`${pallet.row}${pallet.side} - ${pallet.slot}/${pallet.slot + 1}`} 
                                                        key={`${pallet.row}${pallet.side} - ${pallet.slot}/${pallet.slot + 1}`} 
                                                        items={displayedPallets[pallet.row][pallet.slot][pallet.side].items} 
                                                        row={pallet.row}
                                                        slot={pallet.slot}
                                                        side={pallet.side}
                                                        loc={`EVNT ${pallet.side} ${pallet.row - 100} - SLOT ${pallet.slot - 100}`} 
                                                    />
                                                </div>
                                            }else{
                                                return <div style={{ marginTop: i === 9 ? 60 : 0}}>
                                                    <PalletSpace
                                                        setLoading={setLoading}
                                                        setHovering={setHovering} 
                                                        usedPallets={displayedPallets} 
                                                        setUsedPallets={setUsedPallets} 
                                                        setDisplayedPallets={setDisplayedPallets}
                                                        id={`${pallet.row}${pallet.side} - ${pallet.slot}/${pallet.slot + 1}`} 
                                                        key={`${pallet.row}${pallet.side} - ${pallet.slot}/${pallet.slot + 1}`} 
                                                        loc={`EVNT ${pallet.side} ${pallet.row - 100} - SLOT ${pallet.slot - 100}`} 
                                                        row={pallet.row}
                                                        slot={pallet.slot}
                                                        side={pallet.side}
                                                    />
                                                </div>
                                            }

                                        })}
                                    </div>
                                    </div>

                                )
                            })}
                        </div>
                    </div>
                </> : <>
                    <div style={{
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        padding: 20,
                        height: '50%',
                        color: 'white',
                        fontSize: 20,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                    }}>
                        Bay Doors
                    </div>
                    <div style={{
                        width: '100%'
                    }}>
                        <div style={{
                            backgroundColor: 'rgba(0,0,0,0.2)',
                            padding: 20,
                            marginRight: 40,
                            height: '100%',
                            color: 'white',
                            marginBottom: 40,
                            fontSize: 20,
                            textAlign: 'center'
                        }}>
                            North Wall
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%'
                        }}>

                            {bayPallets.map(palletRow => {
                                return (<div>
                                    <div style={{
                                        color: '#ccc',
                                        textAlign: 'center',
                                        marginLeft: 40,
                                        width: 70
                                    }}>
                                        Row {palletRow[0].row - 200}
                                    </div>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(1, 70px)',
                                            gridGap: 10,
                                            marginLeft: 40,
                                        }}>
                                            {palletRow.reverse().map((pallet, i) => {

                                                if(displayedPallets[pallet.row] && displayedPallets[pallet.row][pallet.slot] && displayedPallets[pallet.row][pallet.slot][pallet.side]){
                                                    return <PalletSpace
                                            setLoading={setLoading} 
                                        setHovering={setHovering} 
                                        usedPallets={displayedPallets} 
                                                        setUsedPallets={setUsedPallets} 
                                                        setDisplayedPallets={setDisplayedPallets}
                                                        id={`${pallet.row}${pallet.side} - ${pallet.slot}/${pallet.slot + 1}`} 
                                                        key={`${pallet.row}${pallet.side} - ${pallet.slot}/${pallet.slot + 1}`} 
                                                        items={displayedPallets[pallet.row][pallet.slot][pallet.side].items} 
                                                        row={pallet.row}
                                                        slot={pallet.slot}
                                                        side={pallet.side}
                                                        loc={`BAY ROW ${pallet.row - 200} - SLOT ${pallet.slot - 200}`} 
                                                    />
                                                }else{
                                                    return <PalletSpace
                                            setLoading={setLoading} 
                                        setHovering={setHovering} 
                                        usedPallets={displayedPallets} 
                                                        setUsedPallets={setUsedPallets} 
                                                        setDisplayedPallets={setDisplayedPallets}
                                                        id={`${pallet.row}${pallet.side} - ${pallet.slot}/${pallet.slot + 1}`} 
                                                        key={`${pallet.row}${pallet.side} - ${pallet.slot}/${pallet.slot + 1}`} 
                                                        loc={`BAY ROW ${pallet.row - 200} - SLOT ${pallet.slot - 200}`} 
                                                        row={pallet.row}
                                                        slot={pallet.slot}
                                                        side={pallet.side}
                                                    />
                                                }

                                            })}
                                        </div>
                                    </div>

                                )
                            })}
                        </div>
                    </div>
                </>
            }
        </div>
        <div className='bg-slate-700' style={{
            width: '100vw',
            display: 'grid',
            gridTemplateColumns: 'repeat(14, 70px)',
            gridGap: 10,
            fontSize: 10,
            position: 'static',
            bottom: 0,
            opacity: 1,
            zIndex: 9999,
            overflowY: 'hidden',
            overflowX: 'auto',
            paddingBottom: 20,
            paddingTop: 10,
        }}>
            {[1,2,3,4,5,6,7,8,9,10,11,12,13,14].map((pallet, i) => {
                if(displayedPallets['Temp'] && displayedPallets['Temp'][i] && displayedPallets['Temp'][i]['Temp']){
                return <PalletSpace
                    setLoading={setLoading} 
                    usedPallets={usedPallets} 
                    setUsedPallets={setUsedPallets} 
                    id={`Temp ${pallet}`} 
                    key={`Temp ${pallet}`} 
                    loc={`Temp ${pallet}`} 
                    items={displayedPallets['Temp'][i]['Temp'].items} 
                    row='Temp'
                    slot={i}
                    side='Temp'
                    />
                }else{
                    return <PalletSpace
                    setLoading={setLoading} 
                    usedPallets={usedPallets} 
                    setUsedPallets={setUsedPallets} 
                    id={`Temp ${pallet}`} 
                    key={`Temp ${pallet}`} 
                    loc={`Temp ${pallet}`} 
                    row='Temp'
                    slot={i}
                    side='Temp'
                    />
                }

            })}
        </div>
    </motion.div>
    )

    async function getPallets(){
        try{
            const { data } = await axios.post(
                process.env.REACT_APP_SERVER_ADDRESS + '/pallets/getall',
                {},
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            )
            setUsedPallets(data[0].pallets)
            return null
        }catch(err){
            setLoading({
                message: 'Error Loading Pallets',
                color: 'red'
            })
            console.log(err)
        }
    }

    async function insertPallets(pallets){
        setLoading({
            message: 'Loading...',
            color: '#56d154'
        })
        try{
            const { data } = await axios.post(
                process.env.REACT_APP_SERVER_ADDRESS + '/pallets/post',
                {
                    pallets
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            )
            setLoading({
                message: 'Saved!',
                color: '#56d154'
            })
            setTimeout(() => {
                setLoading(null)
            }, 3000)
        }catch(e){
            setLoading({
                message: 'Error Saving Pallets',
                color: 'red'
            })
            console.log(e)
        }
    }

    async function addEdit() {
        const user = JSON.parse(localStorage.getItem('_vishi:@user_info')).name
        try{
            await axios.post(
                process.env.REACT_APP_SERVER_ADDRESS + '/palletedit/new',
                {
                    user,
                    started: new Date(),
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            )
            window.location = `?edit=true`
        }catch(e){
            console.log(e)
        }
    }

    async function stopEdit() {
        const user = JSON.parse(localStorage.getItem('_vishi:@user_info')).name
        try{
            await axios.post(
                process.env.REACT_APP_SERVER_ADDRESS + '/palletedit/update',
                {
                    user,
                    finished: new Date(),
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            )
            window.location = `?edit=false`
        }catch(e){
            console.log(e)
        }
    }

    async function getEdit() {
        try{
            const { data } = await axios.post(
                process.env.REACT_APP_SERVER_ADDRESS + '/palletedit/get',
                {
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            )
            console.log(data)
            return(data.sort((a, b) => {
                return new Date(b.started) - new Date(a.started)
            })[0])
        }catch(e){
            console.log(e)
        }
    }
}