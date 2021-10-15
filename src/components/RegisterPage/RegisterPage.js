import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import app from '../../firebase';
import md5 from 'md5';
import { getDatabase, ref, set } from "firebase/database";

function RegisterPage() {

    const { register, watch, handleSubmit, formState: { errors } } = useForm();
    const [ errorFromSubmit, setErrorFromSubmit] = useState("");
    const [ loading, setLoading ] = useState(false);

    const password = useRef();  // 모듈때문에 state로 비교하지 않음.
    password.current = watch("password");

    // console.log(watch("email"));
    const onSubmit = async (data) => {
    // 파이어베이스를 통해 이메일과 패스워드로 유저 생성.
        try {
            setLoading(true);      
            // 비밀번호 기반 계정 만들기
            //https://firebase.google.com/docs/auth/web/password-auth#sign_in_a_user_with_an_email_address_and_password
            const auth = getAuth(app);
            let createdUser  = await createUserWithEmailAndPassword(auth, data.email, data.password);            
            console.log("createdUser", createdUser);

            // 사용자 프로필 업데이트 https://firebase.google.com/docs/auth/web/manage-users
            await updateProfile(auth.currentUser, {
                displayName: data.name,
                photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
            });

            // 파이어베이스 데이터베이스에 저장 
            // 기본 쓰기 작업 https://firebase.google.com/docs/database/web/read-and-write
            const db = getDatabase(app);
            await set(ref(db, 'users/' + createdUser.user.uid), {
                name : createdUser.user.displayName,
                image: createdUser.user.photoURL
            });

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

                <input type="submit" disabled={loading}/>

                <Link style={{color:'gray', textDecoration: 'none'}} to="login">이미 아이디가 있다면</Link>
            </form>

               
        </div>
    )
}

export default RegisterPage
