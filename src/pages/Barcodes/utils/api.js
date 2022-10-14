const axios = require('axios');

export const getProducts = async (skuInput, setItems, setLoading) => {
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