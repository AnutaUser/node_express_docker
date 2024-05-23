import React, {useEffect, useState} from 'react';
import axios from 'axios';

const App = () => {
    const [users, setUsers] = useState([]);

    useEffect( () => {
        axios.get('../api/users').then(value => value.data).then(value => setUsers(value.data));
    }, []);
    console.log(users);

    return (
        <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
            {users.map(user => <div key={user._id} style={{
                    border: '2px solid blue',
                    margin: '10px',
                    background: 'aqua',
                    width: '40vw',
                    padding: '8px'
                }}>
                    <h3 style={{textAlign: 'center'}}>{user.username}</h3>
                    <div>Name: {user.age}</div>
                    <div>Gender: {user.gender}</div>
                    <div>Email: {user.email}</div>
                    <div>Status: {user.status}</div>
                    <div>Phone: {user.phone}</div>
                </div>
            )}
        </div>
    );
};

export {App};
