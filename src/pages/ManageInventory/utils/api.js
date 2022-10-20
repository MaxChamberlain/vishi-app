const axios = require('axios');

export const getProducts = async (skuInput, setItems, setLoading, setEmpty) => {
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
    if(!data.length || !data.length > 0){
        setItems([{
            Available: 0,
            Barcode: '',
            Name: 'No items found',
            Price: 0,
            SKU: skuInput.toUpperCase() + ' - None',
            Warehouse: 'NA / NA',
        }])
    }else{
        setItems(data);
    }
    setLoading(false);
    }catch(e){
        console.log(e)
    }
}

export const addItems = async (sku, name, location, price, sizes, barcodes) => {
    await sizes.forEach(async (e, i) => {
        try{
            await axios.post(
                process.env.REACT_APP_SERVER_ADDRESS + '/inventory_snapshot/add_item', 
                {
                    SKU: sku.toUpperCase() + '-' + e.toUpperCase(),
                    Name: name + ' - ' + e,
                    Warehouse: 'Vitality / ' + location,
                    Price: parseFloat(price),
                    Barcode: barcodes[e],
                },
                {
                    headers:{
                        'Content-type': 'application/json'
                    }
                }
            )
            if(i === sizes.length - 1){
                alert('Items added successfully')
            }
        }catch(e){
            console.log(e)
        }
    })
}

export const getItemDetails = async (upc, setItemDetails, setLoading) => {
    try{
        setLoading(true);
        const { data } = await axios.post(
            process.env.REACT_APP_SERVER_ADDRESS + '/inventory_snapshot/getbyupc', 
            {
                Barcode: upc,
            },
            {
                headers:{
                    'Content-type': 'application/json'
                }
            }
        )
        setItemDetails(data);
        setLoading(false);
    }catch(e){
        console.log(e)
    }
}

export const changeItem = async (Barcode, price, setItemDetails) => {
    const Price = price.includes('.') ? price : price + '.00';
    try{
        const { data } = await axios.post(
            process.env.REACT_APP_SERVER_ADDRESS + '/inventory_snapshot/update_item', 
            {
                Barcode: Barcode,
                Price: Price,
            },
            {
                headers:{
                    'Content-type': 'application/json'
                }
            }
        )
        console.log(data)
        alert('Item updated successfully')
        setItemDetails(data)
    }catch(e){
        console.log(e)
        alert('Error updating item')
    }
}