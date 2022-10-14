import { useState } from 'react'
const axios = require('axios')
const copy_icon = require('../../../assets/images/copy.png')
const eye = require('../../../assets/images/eye.webp')
const dropdown_arrow = require('../../../assets/images/dropdown_arrow.png')

export default function PalletSpace({ id, loc, items, usedPallets, setUsedPallets, row, slot, side, setLoading, setHovering }) {
    const [ selected, setSelected ] = useState(null)
    const [ adding, setAdding ] = useState(false)
    const [ removing, setRemoving ] = useState(false)
    const [ copying, setCopying ] = useState(false)
    const [ size, setSize ] = useState('XXS')
    const [ drill, setDrill ] = useState(null)
    const [ open, setOpen ] = useState([])


    const urlParams = new URLSearchParams(window.location.search);
    const edit = urlParams.get('edit')
    const editing = edit === 'true' ? true : false

    return (<>
    <div 
        key={`droppable-container-${row}-${slot}`}
        style={{ 
            position: selected === id ? 'absolute' : 'relative',
            border: (items && items[0]) ? undefined : '2px dashed rgba(255,255,255,0.2)', 
            color: 'white', 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            top: 0,
            left: 0,
            width: selected === id ? '100vw' : '100%',
            height: selected === id ? '100vh' : '100%',
            minWidth: 70,
            minHeight: 70,
            aspectRatio: '1/1',
            zIndex: selected === id ? 9995 : 1, 
        }}
        onClick={selected !== id ? () => {
            setSelected(id)
        } : () => {}}
        onPointerEnter={() => {
            setHovering(loc)
        }}
        onPointerLeave={() => {
            setHovering(null)
        }}
        >
        {selected && 
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '100vh',
                backgroundColor: 'rgba(0,0,0,0.5)',
                zIndex: 9994,
            }} onClick={() => {
                setSelected(null)
            }}></div>
        }
        <div 
            droppable={['kreilly@shopvitality.com','mchamberlain@shopvitality.com','apafundi@shopvitality.com'].includes(JSON.parse(localStorage.getItem('_vishi:@user_info')).email)}
            onDrop={(e) => {
                handleDrop(e, row, slot, side)
            }}
            onDragOver={e => {
                e.stopPropagation()
                e.preventDefault()
            }}
            draggable={(selected !== id && (items && items[0])) ? (['kreilly@shopvitality.com','mchamberlain@shopvitality.com','apafundi@shopvitality.com'].includes(JSON.parse(localStorage.getItem('_vishi:@user_info')).email)) && editing : false}
            key={`pallet-draggable-${id}`}
            onDragStart={e => handleDragStart(e, row, slot, side, usedPallets[row][slot][side]?.color || '#999')}
            id={`pallet-draggable-${id}`}
            style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'flex-start', 
                alignItems: 'center', 
                overflow: 'auto',
                position: 'relative',
                width: selected === id ? 500 : 70, 
                height: selected === id ? 500 : 70, 
                color: !(items && items[0]) ? '#aaa' : 'white' ,
                padding: 2,
                backgroundColor: ((items && items[0]) || selected === id) ? ((usedPallets[row] && usedPallets[row][slot] && usedPallets[row][slot][side]) ? usedPallets[row][slot][side]?.color : '#ccc' || '#ccc') : '',
                zIndex: selected === id ? 9995 : 1, 
                fontSize: selected === id ? 30 : 7, 
        }}
        >
            <div style={{
                display: 'flex',
            }}>
                {selected === id && (['kreilly@shopvitality.com','mchamberlain@shopvitality.com','apafundi@shopvitality.com'].includes(JSON.parse(localStorage.getItem('_vishi:@user_info')).email)) && editing && [['Default', '#999'],['Red', '#b8372e'], ['Blue', '#2862f7'], ['Green', '#2eb83a'], ['Orange', '#cc8d18']].map((color, i) => {
                    return <div 
                        key={`color-${i}`}
                        style={{
                            width: 20,
                            height: 20,
                            backgroundColor: color[1],
                            borderRadius: 10,
                            margin: 5,
                            cursor: 'pointer',
                        }}
                        onClick={() => {
                            const newUsedPallets = usedPallets
                            if(usedPallets[row] && usedPallets[row][slot] && usedPallets[row][slot][side]){
                                newUsedPallets[row][slot][side].color = color[1]
                            }
                            setUsedPallets(newUsedPallets)
                        }}
                    />
                })}
            </div>
            {selected === id ? 
            <div id={`pallet-scrollable-${id}`}>
                <h3 style={{ marginBottom: 0, textAlign: 'center' }}>{loc}</h3>
                {adding === id && <form style={{ display: 'flex', marginTop: 20 }}
                onSubmit={e => {
                    e.preventDefault()
                    setUsedPallets(was => {
                        const newUsedPallets = { ...was }
                        if(!newUsedPallets[row]){
                            newUsedPallets[row] = {}
                        }
                        if(!newUsedPallets[row][slot]){
                            newUsedPallets[row][slot] = {}
                        }
                        if(!newUsedPallets[row][slot][side]){
                            newUsedPallets[row][slot][side] = { items: [] }
                            newUsedPallets[row][slot][side].color='#999'
                        }
                        if(!e.target.item.value.includes('-')){
                            getByUpc(e.target.item.value, newUsedPallets)
                            return newUsedPallets;
                        }else{
                            newUsedPallets[row][slot][side].items.push(e.target.item.value.toUpperCase())
                        }
                        e.target.item.value = ''
                        return newUsedPallets
                    })
                }}
        >
            <input type='text' placeholder='SKU or Barcode' name='item' id='item-name' autoFocus style={{
                width: '80%',
                fontSize: 30
            }} />
            <input type='submit' value='ADD' style={{
                width: '20%',
                fontSize: 20,
            }} />
        </form>}
        <br />
                {copying && <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        position: 'relative',
                        marginLeft: 20
                    }}>
                            <div style={{ marginBottom: 10 }} key={copying + 100}>
                                {copying}-
                                <select style={{
                                    fontSize: 25,
                                    backgroundColor: 'transparent',
                                    color: 'white',
                                    border: '1px solid white',
                                    borderRadius: 10,
                                }}
                                onChange={(e) => {
                                    const value = e.target.value
                                    setSize(value)
                                }}>
                                    <option value='XXS'>XXS</option>
                                    <option value='XS'>XS</option>
                                    <option value='S'>S</option>
                                    <option value='M'>M</option>
                                    <option value='L'>L</option>
                                    <option value='XL'>XL</option>
                                    <option value='XXL'>XXL</option>
                                    <option value='XXXL'>XXXL</option>
                                    <option value='XXXXL'>XXXXL</option>
                                </select>
                            </div>
                            <div style={{ fontSize: 20, marginLeft: 20, backgroundColor: '#1976d2', padding: 10, borderRadius: '50%', width: 10, height: 10, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                            onClick={() => {
                                setUsedPallets(was => {
                                    const newUsedPallets = { ...was }
                                    if(!newUsedPallets[row]){
                                        newUsedPallets[row] = {}
                                    }
                                    if(!newUsedPallets[row][slot]){
                                        newUsedPallets[row][slot] = {}
                                    }
                                    if(!newUsedPallets[row][slot][side]){
                                        newUsedPallets[row][slot][side] = { items: [] }
                                    }
                                        newUsedPallets[row][slot][side].items = [`${copying}-${size}`, ...newUsedPallets[row][slot][side].items]
                                    return newUsedPallets
                                })
                                setCopying(false)
                                setSize('XXS')
                            }}>
                                ✓
                            </div>
                            <div style={{ marginLeft: 20, backgroundColor: 'red', padding: 10, borderRadius: '50%', width: 10, height: 10, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                            onClick={() => {
                                setCopying(false)
                                setSize('XXS')
                            }}>
                                -
                            </div>
                            </div>
                }
                {drill && 
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        minHeight: '100%',
                        backgroundColor: 'rgba(40,40,40,0.97)',
                        padding: 20,
                        zIndex: 9999,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        paddingTop: 60,
                        fontSize: 25
                    }}>
                        <div style={{
                            position: 'fixed',
                            top: 10,
                            right: 20,
                            cursor: 'pointer',
                        }}
                        onClick={() => setDrill(null)}
                        >x</div>
                        <span>{drill.name}</span>
                        <br />
                        <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%'}}>
                            <div>On Hand</div>
                            <div>Available</div>
                            <div>Allocated</div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%'}}>
                            <div>{drill.warehouse_products.reduce((a,b) => {
                                return a + parseInt(b.on_hand)
                            }, 0)}</div>
                            <div>{drill.warehouse_products.reduce((a,b) => {
                                return a + parseInt(b.available)
                            }, 0)}</div>
                            <div>{drill.warehouse_products.reduce((a,b) => {
                                return a + parseInt(b.allocated)
                            }, 0)}</div>
                        </div>
                        <br />
                        <span>Other Locations:</span>
                        <table>
                            <thead>
                                <tr>
                                    <th>Location</th>
                                    <th>Area</th>
                                    <th>Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {drill.warehouse_products.map(e => e.locations.edges.map(e => e.node)).flat()
                                    .filter(e => {
                                        if(e.location.name === 'Receiving'){
                                            return false
                                        }
                                        if(e.location.name === 'Unassigned'){
                                            return false
                                        }
                                        if(e.location.name === 'Athlete Staging'){
                                            return false
                                        }
                                        if(e.location.name === 'Employee Temp'){
                                            return false
                                        }
                                        if(e.location.name === 'Pop Up Shop'){
                                            return false
                                        }
                                        if(e.location.name === 'Pop Up Shop Reserve'){
                                            return false
                                        }
                                        return true
                                    })
                                    .map(e => {
                                        return <tr>
                                            <td>{e.location.name}</td>
                                            <td>Pick Face</td>
                                            <td>{e.quantity}</td>
                                        </tr>
                                    }
                                )}
                                {Object.keys(usedPallets).map(e => {
                                    return {
                                        location: e < 100 ? 'Racks' : e < 200 ? 'Event Space' : 'Bay Doors',
                                        pallets: Object.keys(usedPallets[e]).map(x => {
                                            return Object.keys(usedPallets[e][x]).map(y => {
                                                return {
                                                    row: e,
                                                    slot: x + (e < 100 ? '/' + (parseInt(x)+1) : ''),
                                                    side: y,
                                                    items: usedPallets[e][x][y].items
                                                }
                                            }).filter(e => e.items.includes(drill.sku)).flat()
                                        }).filter(x => x.filter(e => e.items.includes(drill.sku))).flat()
                                    }
                                }).filter(e => e.pallets.filter(x => x.items.includes(drill.sku)).length > 0).flat()
                                .map(e => {
                                    return {
                                        location: e.location,
                                        spots: e.pallets.map(x => `${x.row > 100 ? x.row < 200 ? parseInt(x.row) - 100 : parseInt(x.row) - 200 : x.row}${x.side}${x.slot > 100 ? x.slot < 200 ? parseInt(x.slot) - 100 : parseInt(x.slot) - 200 : x.slot}`)
                                    }
                                }).map(e => {
                                    console.log(e)
                                    return e.spots.map(x => {
                                        return <tr>
                                            <td>{x}</td>
                                            <td>{e.location}</td>
                                            <td>N/A</td>
                                        </tr>
                                    })
                                })}
                            </tbody>
                        </table>
                    </div>
                }
                <div style={{
                    overflowY: 'scroll',
                    height: adding ? copying ? 230 : 270 : copying ? 300 : 350,
                    width: 450,
                }}>
                    {items ? 
                        [...new Set(items.map(e => e.split('-').slice(0, e.split('-').length - 1).join('-')))].map(e => {
                            return <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                marginBottom: 40
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    position: 'relative',
                                    backgroundColor: 'rgba(0,0,0,0.2)',
                                    padding: 5,
                                }}
                                onClick={() => {
                                    if(open.includes(e)){
                                        setOpen(open.filter(x => x !== e))
                                    } else {
                                        setOpen([...open, e])
                                    }
                                }}>
                                    <div key={e}>{e}</div>
                                    <img src={dropdown_arrow} style={{
                                        width: 20,
                                        height: 20,
                                        filter: 'invert(1)',
                                        marginRight: 20,
                                        transform: open.includes(e) ? 'rotate(180deg)' : 'rotate(0deg)',
                                    }}
                                    />

                                </div>
                                    {open.includes(e) ? [...new Set(items.filter(x => x.split('-').slice(0, x.split('-').length - 1).join('-') === e ).sort((a,b) => {
                                        let aSize = a.split('-').slice(-1)[0].toLowerCase()
                                        let bSize = b.split('-').slice(-1)[0].toLowerCase()
                                        if(aSize === 'xxs'){
                                            return -1
                                        }
                                        if(bSize === 'xxs'){
                                            return 1
                                        }
                                        if(aSize === 'xs'){
                                            return -1
                                        }
                                        if(bSize === 'xs'){
                                            return 1
                                        }
                                        if(aSize === 's'){
                                            return -1
                                        }
                                        if(bSize === 's'){
                                            return 1
                                        }
                                        if(aSize === 'm'){
                                            return -1
                                        }
                                        if(bSize === 'm'){
                                            return 1
                                        }
                                        if(aSize === 'l'){
                                            return -1
                                        }
                                        if(bSize === 'l'){
                                            return 1
                                        }
                                        if(aSize === 'xl'){
                                            return -1
                                        }
                                        if(bSize === 'xl'){
                                            return 1
                                        }
                                        if(aSize === 'xxl'){
                                            return -1
                                        }
                                        if(bSize === 'xxl'){
                                            return 1
                                        }
                                        if(aSize === 'xxxl'){
                                            return -1
                                        }
                                        if(bSize === 'xxxl'){
                                            return 1
                                        }
                                        if(aSize === 'xxxxl'){
                                            return -1
                                        }
                                        if(bSize === 'xxxxl'){
                                            return 1
                                        }
                                        return 0

                                    }).map(e => e))].map((item, i) => {
                                        return <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            position: 'relative',
                                            backgroundColor: 'rgba(0,0,0,0.1)',
                                            padding: 10,
                                            borderBottom: '1px solid rgba(0,0,0,0.2)',
                                        }}>
                                                <div style={{ marginBottom: 10 }} key={item + i}>{item}</div>
                                                <div style={{
                                                    display: 'flex',
                                                }}>
                                                    <div style={{ marginLeft: 20, backgroundColor: removing === id + item ? 'red' : '#1976d2', padding: 10, borderRadius: '50%', width: 20, height: 20, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                                        onClick={() => {
                                                            document.getElementById(`pallet-scrollable-${id}`).scrollTo(0,0)
                                                            getItemDetails(item)
                                                        }}
                                                    >
                                                        <img 
                                                            src={eye} 
                                                            style={{
                                                                width: 20,
                                                                height: 20,
                                                                cursor: 'pointer',
                                                                filter: 'invert(100%) brightness(2)',
                                                            }}
                                                        />
                                                    </div>
                                                    {(['kreilly@shopvitality.com','mchamberlain@shopvitality.com','apafundi@shopvitality.com'].includes(JSON.parse(localStorage.getItem('_vishi:@user_info')).email)) && editing && <div style={{ marginLeft: 10, backgroundColor: removing === id + item ? 'red' : '#1976d2', padding: 10, borderRadius: '50%', width: 20, height: 20, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                                        onClick={() => {
                                                            setCopying(item.split('-').slice(0, item.split('-').length - 1).join('-'))
                                                        }}
                                                    >
                                                        <img 
                                                            src={copy_icon} 
                                                            style={{
                                                                width: 20,
                                                                height: 20,
                                                                cursor: 'pointer',
                                                                filter: 'invert(100%) brightness(2)',
                                                            }}
                                                        />
                                                    </div>}
                                                    {(['kreilly@shopvitality.com','mchamberlain@shopvitality.com','apafundi@shopvitality.com'].includes(JSON.parse(localStorage.getItem('_vishi:@user_info')).email)) && editing && <div style={{ marginLeft: 10, backgroundColor: removing === id + item ? 'red' : '#1976d2', padding: 10, borderRadius: '50%', width: 20, height: 20, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                                    onClick={removing === id + item ? () => {
                                                        setUsedPallets(was => {
                                                            const newUsedPallets = { ...was }
                                                            newUsedPallets[row][slot][side].items = newUsedPallets[row][slot][side].items.filter(e => e !== item)
                                                            return newUsedPallets
                                                        })
                                                    } :
                                                    () => {
                                                        setRemoving(id + item)
                                                        setTimeout(() => setRemoving(false), 1500)
                                                    }}>{removing === id + item ? '✓' : '-'}</div>}
                                                </div>
                                            </div>
                                    }) :
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-around',
                                        backgroundColor: 'rgba(0,0,0,0.1)',
                                        fontSize: 20,
                                        padding: '10px 0',
                                        color: '#ddd',
                                    }}>
                                        {[...new Set(items.filter(x => x.split('-').slice(0, x.split('-').length - 1).join('-') === e ).sort((a,b) => {
                                        let aSize = a.split('-').slice(-1)[0].toLowerCase()
                                        let bSize = b.split('-').slice(-1)[0].toLowerCase()
                                        if(aSize === 'xxs'){
                                            return -1
                                        }
                                        if(bSize === 'xxs'){
                                            return 1
                                        }
                                        if(aSize === 'xs'){
                                            return -1
                                        }
                                        if(bSize === 'xs'){
                                            return 1
                                        }
                                        if(aSize === 's'){
                                            return -1
                                        }
                                        if(bSize === 's'){
                                            return 1
                                        }
                                        if(aSize === 'm'){
                                            return -1
                                        }
                                        if(bSize === 'm'){
                                            return 1
                                        }
                                        if(aSize === 'l'){
                                            return -1
                                        }
                                        if(bSize === 'l'){
                                            return 1
                                        }
                                        if(aSize === 'xl'){
                                            return -1
                                        }
                                        if(bSize === 'xl'){
                                            return 1
                                        }
                                        if(aSize === 'xxl'){
                                            return -1
                                        }
                                        if(bSize === 'xxl'){
                                            return 1
                                        }
                                        if(aSize === 'xxxl'){
                                            return -1
                                        }
                                        if(bSize === 'xxxl'){
                                            return 1
                                        }
                                        if(aSize === 'xxxxl'){
                                            return -1
                                        }
                                        if(bSize === 'xxxxl'){
                                            return 1
                                        }
                                        return 0

                                    }).map(e => e))].map((item, i) => {
                                            return <div>
                                                {item.split('-')[item.split('-').length - 1]}
                                            </div>
                                        })}
                                    </div>
                                    }
                            </div>
                        })
                    : null}
                </div>
                <div  style={{
                    cursor: 'pointer',
                    position: 'absolute',
                    top: 15,
                    right: 20,
                }} onClick={() => {
                    setSelected(() => null);
                    setAdding(() => false);
                    setRemoving(() => false);
                    }}>x</div>
                    {(['kreilly@shopvitality.com','mchamberlain@shopvitality.com','apafundi@shopvitality.com'].includes(JSON.parse(localStorage.getItem('_vishi:@user_info')).email)) && editing && <div  style={{
                        cursor: 'pointer',
                        position: 'absolute',
                        top: 5,
                        left: 20,
                        fontSize: 40,
                        backgroundColor: '#1976d2',
                        borderRadius: '50%',
                        height: 40,
                        width: 40,
                        textAlign: 'center',
                        padding: 5,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        transform: adding ? 'rotate(45deg)' : 'rotate(0deg)',
                    }} onClick={() => {
                        setAdding(was => was === id ? false : id)
                        }}>+</div>}
            </div>
                :
                <div style={{ cursor: 'pointer' }}>{((items && items[0]) && [...new Set(items.map(e => e.split('-').slice(0, 3).join('-')))].map(e => 
                    <div style={{
                        padding: 2,
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        margin: '4px 0',
                        fontSize: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        alignItems: 'center',
                    }}>
                        {e}
                    </div>
                )) || loc} 
                    {!(items && items[0]) && <div style={{
                        fontSize: 15,
                        textAlign: 'center',
                    }}>
                        +
                    </div>}
                </div>
            }
        </div>
    </div>
    </>)

function handleDragStart(event, row, slot, side, color){
    console.log('drag start', id)
    event.dataTransfer.setData('row', row)
    event.dataTransfer.setData('slot', slot)
    event.dataTransfer.setData('side', side)
    event.dataTransfer.setData('items', items.join(','))
    event.dataTransfer.setData('color', color)
    console.log(row)
    console.log(slot)
    console.log(side)
    console.log(items)
}

function handleDrop(event, row, slot, side){
    console.log(event.dataTransfer.getData('items') || 'nothing', 'dropped on', row, slot, side)
    if(!((event.dataTransfer.getData('row')) == (row) && (event.dataTransfer.getData('slot')) == (slot) && (event.dataTransfer.getData('side')) == (side))){
        setUsedPallets(pallets => {
            let newPallets = {...pallets}

            console.log(event.dataTransfer.getData('color'))

            if(!newPallets[row]){
                newPallets[row] = {}
            }

            if(!newPallets[row][slot]){
                newPallets[row][slot] = {}
            }

            if(!newPallets[row][slot][side]){
                newPallets[row][slot][side] = {}
                newPallets[row][slot][side].items = event.dataTransfer.getData('items').split(',')
                newPallets[row][slot][side].color = event.dataTransfer.getData('color')
            }
            
            else{
                newPallets[row][slot][side].items = event.dataTransfer.getData('items').split('\n')
                newPallets[row][slot][side].color = event.dataTransfer.getData('color')
            }
            return newPallets
        })

        setUsedPallets(pallets => {
            let newPallets = {...pallets}
            delete newPallets[event.dataTransfer.getData('row')][event.dataTransfer.getData('slot')][event.dataTransfer.getData('side')]
            return newPallets
        })
    }
}
    async function getByUpc(Barcode, pallets){
        setLoading({
            message: 'Loading...',
            color: '#56d154'
        })
        try{
            const { data } = await axios.post(
                process.env.REACT_APP_SERVER_ADDRESS + '/inventory_snapshot/getbyupc',
                {
                    Barcode
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            )
            console.log(data)
    
            setUsedPallets(was => {
                const newUsedPallets = { ...was }
    
                if(!newUsedPallets[row]){
                    newUsedPallets[row] = {}
                }
    
                if(!newUsedPallets[row][slot]){
                    newUsedPallets[row][slot] = {}
                }
    
                if(!newUsedPallets[row][slot][side]){
                    newUsedPallets[row][slot][side] = {}
                }
                if(!newUsedPallets[row][slot][side].items){
                    newUsedPallets[row][slot][side].items = []
                }
                newUsedPallets[row][slot][side].items.push(data.SKU)
                return newUsedPallets
            })
            document.getElementById('item-name').value = ''
            setLoading(null)
        }catch(e){
            console.log(e)
            setLoading({
                message: e.response.data.text,
                color: 'red'
            })
            setTimeout(() => setLoading(null), 2000)
        }
    }

    async function getItemDetails(sku){
        setLoading({
            message: 'Loading...',
            color: '#56d154'
        })
        try{
            const { data } = await axios.post(
                process.env.REACT_APP_SERVER_ADDRESS + '/shipheroitem/get',
                {
                    sku
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            )
            setDrill(data)
            setLoading(null)
        }catch(e){
            console.log(e)
            setLoading({
                message: e.response.data.text,
                color: 'red'
            })
            setTimeout(() => setLoading(null), 2000)
        }
    }
}