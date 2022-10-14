const axios = require('axios');

export const submitLogin = async (email, password, setLoading, setError) => {
    console.log('logging', email)
    try{
        setLoading(true)
            const { data } = await axios.post(
                process.env.REACT_APP_SERVER_ADDRESS + '/users/login',
                {
                    email: email.toLowerCase(),
                    password
                },
                {
                    headers:{
                        'Content-type': 'application/json'
                    }
                }
            )
            setLoading(false)
            console.log(data)
        if(!data){
            setError('Invalid Email or Password')
        }else if(data.isApproved === true){
            localStorage.setItem('_vishi:@user_info', JSON.stringify(data))
            setError(false)
            window.location.reload()
        }else{
            setError('Your account has not been approved yet. Please contact your administrator.')
        }
    }catch(e){
        setLoading(false)
        setError('Internal Server Error')
        console.error(e)
    }
  }