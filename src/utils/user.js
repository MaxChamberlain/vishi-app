const axios = require('axios')

export const updateUserVersion = async () => {
    const _id = JSON.parse(localStorage.getItem('_vishi:@user_info'))._id
    const version = process.env.REACT_APP_VERSION
    const { data } = await axios.post(
        process.env.REACT_APP_SERVER_ADDRESS + '/users/updateversion',
        {
            _id,
            version
        },
        {
        headers: {
            'Content-Type': 'application/json',
        },
        }
    )
    localStorage.setItem('_vishi:@user_info', JSON.stringify(data))
    window.location.reload()
}