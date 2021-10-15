import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import app from '../../firebase';

function RegisterPage() {

    const { register, watch, handleSubmit, formState: { errors } } = useForm();
    const [ errorFromSubmit, setErrorFromSubmit] = useState("");

    const password = useRef();  // 모듈때문에 state로 비교하지 않음.
    password.current = watch("password");

    // console.log(watch("email"));
    const onSubmit = async (data) => {

        try {
            const auth = getAuth(app);
            let createdUser  = await createUserWithEmailAndPassword(auth, data.email, data.password);            
            console.log(createdUser);

        } catch (error) {
            setErrorFromSubmit(error.message);
            setTimeout(() => {
                setErrorFromSubmit(error.message)
            }, 5000);
        }
       
    };

    return (
        <div className="auth-wrapper">
            <div style={{textAlign:'center'}}>
                <h3>가입하기</h3>
            </div>
            <form onSubmit = {handleSubmit(onSubmit)}>
                <label>Email</label>
                <input 
                    name="email" 
                    type="email" {...register("email", {required: true, pattern: /^\S+@\S+$/i })}/>
                {errors.email && <p>필수입력</p>}

                <label>Name</label>
                <input name="name" {...register("name", {required: true, maxLength: 10 })}/>
                {errors.name && errors.name.type === "required" && <p>필수입력</p>}
                {errors.name && errors.name.type === "maxLength" && <p>길이초과(최대10자)</p>}

                <label>Password</label>
                <input name="password" type="password" 
                     {...register("password", {required: true, minLength: 6 })} />
                {errors.password && errors.password.type === "required" && <p>필수입력</p>}
                {errors.password && errors.password.type === "minLength" && <p>최소 6자 이상</p>}

                <label>PassWord Confirm</label>
                <input name="password_confirm" type="password" 
                     {...register("password_confirm", {required: true, validate: (value) => value === password.current })} />

                {errors.password_confirm && errors.password_confirm.type === "required" && <p>필수입력</p>}
                {errors.password_confirm && errors.password_confirm.type === "validate" && <p>패스워드 불일치</p>}
                
                {errorFromSubmit && 
                    <p>{errorFromSubmit}</p>}

                <input type="submit" />

                <Link style={{color:'gray', textDecoration: 'none'}} to="login">이미 아이디가 있다면</Link>
            </form>

               
        </div>
    )
}

export default RegisterPage
