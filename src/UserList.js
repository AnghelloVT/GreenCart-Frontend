import React, { useEffect, useState } from 'react';

function UserList() {
    const [usuarios, setUsuarios] = useState([]);
    useEffect(() => {
        fetch("http://localhost:8080/usuarios/all")
            .then(res => res.json())
            .then(data => setUsuarios(data));
    }, []);
    return (
        <div>
            
        </div>
    );
}
export default UserList;