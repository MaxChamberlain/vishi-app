const axios = require('axios');

export const handlePrint = (setPrinting, data) => {
    const container = document.getElementById('printable-content')
    const newWindow = window.open('', '', 'left=0,top=0,location=no,menubar=no,scrollbars=no,status=no,toolbar=no')
    newWindow.document.head.innerHTML = `
        <style>
            @page {
                size: a4;
                margin: 0;
            }
            body {
                margin: 0;
                padding: 0;
            }
        </style>
    `

    for(let i = 0; i < container.childNodes.length; i++){
        newWindow.document.body.appendChild(container.childNodes[i].cloneNode(true))
        
    }

    newWindow.print()
    newWindow.close()
    setPrinting(false)
    pushPrints(data)
}

async function pushPrints(data){
    const name = JSON.parse(localStorage.getItem('_vishi:@user_info')).name
    data.forEach(e => {
        axios.post(
            process.env.REACT_APP_SERVER_ADDRESS + '/printhistory/new',
            {
                print_sku: e.sku,
                printed_by: name,
                print_date: new Date(),
            },
            {
                headers:{
                    'Content-type': 'application/json'
                }
            }
        )
    })
}

export const getHistory = async (print_sku, setHistory) => {
    try{
        const { data } = await axios.post(
            process.env.REACT_APP_SERVER_ADDRESS + '/printhistory/getall',
            {
                print_sku
            },
            {
                headers:{
                    'Content-type': 'application/json'
                }
            }
        )
        console.log(data)
        setHistory(data)
    }catch(e){
        console.error(e)
    }
}