import { Input, InputLabel, FormHelperText, Button, FormControl, CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';
const { submitLogin } = require('./utils/login');

export default function Login(){
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ emailValid, setEmailValid ] = useState(true);
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(null);

    useEffect(() => {
        if(email.length > 0){
            if(!email.includes('@')){
                setEmailValid(false);
            }else if(!email.includes('.')){
                setEmailValid(false);
            }else if(email.split('@')[1].split('.')[0].length < 2){
                setEmailValid(false);
            }else if(email.split('.')[1].length < 2){
                setEmailValid(false);
            }else{
                setEmailValid(true);
            }
    }
    }, [email])

    return(
        <div className="w-screen h-screen flex items-center justify-center">
            <div className="bg-slate-200 p-6 rounded flex flex-col items-center text-xl justify-center relative">
                {loading &&
                <div className='absolute top-0 left-0 right-0 bottom-0 rounded bg-stone-200 flex justify-center items-center bg-opacity-60 z-[9990]'>
                    <CircularProgress />
                </div>
                }
                <div className='font-bold'>
                    Login
                </div>
                <div className='mt-4'>
                    <FormControl>
                        <InputLabel htmlFor="email">Email</InputLabel>
                        <Input 
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => {
                                if(e.key === 'Enter'){
                                    if(emailValid && password){
                                        submitLogin(email, password, setLoading, setError);
                                    }
                                }
                            }}
                            style={{ width: '20rem' }}
                        />
                        <FormHelperText 
                            id="email-helper-text"
                            style={{ color: 'red' }}
                            onKeyDown={(e) => {
                                if(e.key === 'Enter'){
                                    if(emailValid && password){
                                        submitLogin(email, password, setLoading, setError);
                                    }
                                }
                            }}
                        >
                            {!emailValid && 'Please enter a valid email'}
                        </FormHelperText>
                    </FormControl>
                </div>
                <div className='mt-4'>
                    <FormControl>
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '20rem' }}
                        />
                    </FormControl>
                </div>
                <div className='mt-4 w-full'>
                    <Button
                        variant={(emailValid && password) ? "contained" : "outlined"}
                        color='primary'
                        disabled={!(emailValid && password)}
                        fullWidth
                        onClick={() => {
                            submitLogin(email, password, setLoading, setError);
                        }}
                    >
                        Login
                    </Button>
                </div>
            </div>
        </div>
    )
}