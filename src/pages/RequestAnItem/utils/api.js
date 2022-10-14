const axios = require('axios');

const getProducts = async (skuInput, setItems, setLoading) => {
    try{
      setLoading(true);
      const { data } = await axios.post(
        process.env.REACT_APP_SERVER_ADDRESS + '/inventory_snapshot/items', 
        {
          sku: skuInput.toUpperCase(), 
        },
        {
            headers:{
                'Content-type': 'application/json'
            }
        }
    )
    console.log(data)
    setLoading(false);
    setItems(data);
    }catch(e){
        console.log(e)
    }
  }

  const submitRequest = async (sku, item_name, priority, quantity_needed, bin, setBin, setQty, setSelected, setPriority ) => {
    const company = 'Vitality'
    const submitter = await JSON.parse(localStorage.getItem('_vishi:@user_info')).name
    const status = 'open'
    const bin_number = bin.toUpperCase()
    try{

      const { data } = await axios.post(
        process.env.REACT_APP_SERVER_ADDRESS + '/requests/new',
        {
          sku,
          status,
          priority,
          quantity_needed,
          bin_number,
          item_name,
          submitter,
          company
        },
        {
          headers:{
              'Content-type': 'application/json'
          }
        }
    )

    setBin(null)
    setQty(null)
    setSelected(null)
    setPriority(1)

    console.log(data)
    }catch(e){
        console.log(e)
    }
  }

  module.exports = {
    getProducts,
    submitRequest
  }