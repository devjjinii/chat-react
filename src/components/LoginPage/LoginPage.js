import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from '../../firebase';
// import { getDatabase, ref, set } from "firebase/database";

function LoginPage() {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const [ errorFromSubmit, setErrorFromSubmit] = useState("");
    const [ loading, setLoading ] = useState(false);

    const onSubmit = async (data) => {
        try {
            setLoading(true);    
            
            const auth = getAuth(app);
            // Sign in using some other provider.
            const result = await signInWithEmailAndPassword(auth, data.email, data.password);  
            console.log(result);

            setLoading(false);

        } catch (error) {
            setErrorFromSubmit(error.message);
            setLoading(false);
            setTimeout(() => {
                setErrorFromSubmit(error.message)
            }, 5000);
        }
       
    };

    return (
        <div className="auth-wrapper">
            <div style={{textAlign:'center'}}>
                <h3>로그인</h3>
            </div>
            <form onSubmit = {handleSubmit(onSubmit)}>
                <label>Email</label>
                <input 
                    name="email" 
                    type="email" {...register("email", {required: true, pattern: /^\S+@\S+$/i })}/>
                {errors.email && <p>필수입력</p>}

                <label>Password</label>
                <input name="password" type="password" 
                     {...register("password", {required: true, minLength: 6 })} />
                {errors.password && errors.password.type === "required" && <p>필수입력</p>}
                {errors.password && errors.password.type === "minLength" && <p>최소 6자 이상</p>}
 
                {errorFromSubmit && 
                    <p>{errorFromSubmit}</p>}

                <input type="submit" disabled={loading}/>

                <Link style={{color:'gray', textDecoration: 'none'}} to="register">아직 아이디가 없다면..</Link>
            </form>

               
        </div>
    )
}

export default LoginPage
