import React, { useEffect, useState } from 'react';

function UserList() {
    const [usuarios, setUsuarios] = useState([]);
    useEffect(() => {
        fetch("https://greencart-backend-085d.onrender.com/usuarios/all")
            .then(res => res.json())
            .then(data => setUsuarios(data));
    }, []);
    return (
        <div>
            
        </div>
    );
}
export default UserList;