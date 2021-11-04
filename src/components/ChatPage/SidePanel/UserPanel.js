import React, { useRef } from 'react'
import { IoIosChatboxes } from 'react-icons/io';
import Dropdown from 'react-bootstrap/Dropdown';
import Image from 'react-bootstrap/Image';
import { useSelector } from 'react-redux';
import app from '../../../firebase';
import { getAuth, signOut } from "firebase/auth";

function UserPanel() {
  
    const user = useSelector(state => state.user.currentUser);
    
    const inputOpenImageRef = useRef();

    const handleLogout = () => {
        const auth = getAuth(app);
        signOut(auth);
    }

    const haneldOpenImageRef = () => {
        inputOpenImageRef.current.click(); // input 클릭( display )
    }
    
    const handleUploadImage = () => {
        
    }

    return (
        <div>
            <h3 style={{ color: "white" }}>
              <IoIosChatboxes />{" "} Chat App
            </h3>
            <div style={{ display: 'flex', marginBottom: '1rem' }}>
                <Image src ={user && user.photoURL}
                    style={{ width: '30px', height: '30px', marginTop: '3px' }}
                    roundedCircle />

                {/* display none */}
                <input 
                    onChange={handleUploadImage}
                    accept="image/jpeg, image/png"
                    type="file" style={{ display: 'none'}} ref={inputOpenImageRef}/>

                <Dropdown>
                    <Dropdown.Toggle 
                        style={{ background: 'transparent', border: '0px'}}
                        id="dropdown-basic">
                            {user && user.displayName}
                    </Dropdown.Toggle>
                    
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={haneldOpenImageRef}>
                            프로필 사진 변경
                        </Dropdown.Item>
                        <Dropdown.Item onClick={handleLogout}>
                            로그아웃
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </div>
    )
}

export default UserPanel
