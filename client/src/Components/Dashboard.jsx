import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get('http://localhost:8000/auth/verify')
            .then(res => {
                if (!res.data.status) {
                    navigate('/');
                }
            })
            .catch(err => {
                console.error('Error verifying user:', err);
                navigate('/');
            });
    }, []); 

    return (
        <div>
            Dashboard
        </div>
    );
}

export default Dashboard;
