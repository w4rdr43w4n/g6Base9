import axios from 'axios';

export const login = async (username: string, password: string) => {
    const response = await axios.post('http://localhost:3000/api/auth/login',{usr:username,pwd:password});
    return response
};

export const verifyUser = async(token:string,email:string)=>{
    const verifyState = await axios.post('http://localhost:3000/api/auth/verify',{token,email});
    return verifyState
  };