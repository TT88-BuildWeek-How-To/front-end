import React, { useState, useContext, useEffect } from 'react'
import { UserContext } from '../contexts/UserContext';
import { axiosWithAuth } from '../utils/axiosWithAuth';
import HowTo from './HowTo';
import logo from '../logo.svg'

import { Label, Input } from 'reactstrap';
// Sample Data - will come from api get request for howtos
import testHowtos from '../data/howtos'


// component will display all existing howtos for logged in user
function HowTos() {
    const { user } = useContext(UserContext);
    const [howtos, setHowtos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchterm, setSearchterm] = useState('');
    const [filteredHowtos, setFilteredHowtos] = useState(howtos)

    const handleChange = e => {
        setSearchterm(e.target.value);
    }
  
    // get all howtos from the api and display when component mounts
    // use an authorized get request to howtos route
    useEffect(()=> {
        axiosWithAuth().get('https://reqres.in/api/users')
        .then(res => {
            console.log(res);
            setError('');
            setIsLoading(false);
            // using sample data to mock data return
            setHowtos(testHowtos)
        })
        .catch(err => console.log(err))
    },[])

    // filter howtos by title when the howtos or searchterm changes
    useEffect(() => {
       setFilteredHowtos(howtos.filter(howto => howto.title.toLowerCase().includes(searchterm.toLowerCase())))
    }, [searchterm, howtos])


    return (
        <div className='howtos-wrapper'>
            <div className='howto-header'>
                <h2>Welcome {user.username}</h2>    
                <div className='formgroup'>
                    <Label style={{textAlign: 'right', marginRight: '8px'}}for='searchterm'>Search by Title</Label>
                    <Input type='text' name='searchterm' id='searchterm' placeholder='enter a keyword to search' value={searchterm} onChange={handleChange}/>
                </div>
            </div>
            { isLoading? (<div className='loading-howtos'><img src={logo} /><span>...Loading...</span></div>): (
                <>
                {filteredHowtos.map(howto => (
                    <HowTo key={howto.id} howto={howto}/>
                ))}
                </>
            )}
        </div>
    )
}

export default HowTos
