const axios = require('axios');

export const getRequests = async (setRequests, setOverstock) => {
    try{
      const { data } = await axios.post(
        process.env.REACT_APP_SERVER_ADDRESS + '/requests/items', 
        {},
        {
            headers:{
                'Content-type': 'application/json'
            }
        }
      )
        setRequests({
            new: data.filter(e => e.status !== 'cleared').sort((a, b) => a.sku - b.sku)
        })
      getOverstock(setOverstock)
    }catch(e){
        console.log(e)
    }
}


export const getOverstock = async (setOverstock) => {
  const { data } = await axios.post(
      process.env.REACT_APP_SERVER_ADDRESS + '/pallets/getall',
      {},
      {
          headers: {
              'Content-Type': 'application/json',
          }
      }
  )
  let pallets = [] 
  Object.keys(data[0].pallets).forEach(row => {
    Object.keys(data[0].pallets[row], row).forEach(slot => {
      Object.keys(data[0].pallets[row][slot]).forEach(side => {
       data[0].pallets[row][slot][side].items.forEach(item => {
        if(!pallets.find(e => e.item === item && e.position === `${row}${side === 'Ground' ? '' : side} - ${parseInt(slot)}${side === 'Ground' ? '' : '/' + (parseInt(slot) + 1)}`)){
          pallets.push({
            item: item,
            color: data[0].pallets[row][slot][side].color,
            position: `${row}${side === 'Ground' ? '' : side} - ${parseInt(slot)}${side === 'Ground' ? '' : '/' + (parseInt(slot) + 1)}`
          })
        }
       })
      })
    })
  })

  setOverstock(pallets)
}


export const updateItem = async (_id, status, setRequests, setOverstock) => {
  const name = JSON.parse(localStorage.getItem('_vishi:@user_info')).name
  try{
    await axios.post(
        process.env.REACT_APP_SERVER_ADDRESS + '/requests/' + status,
        {
          _id,
          name
        },
        {
            headers:{
                'Content-type': 'application/json'
            }
        }
    )
    getRequests(setRequests, setOverstock)
  }catch(e){
      console.error(e)
  }
}