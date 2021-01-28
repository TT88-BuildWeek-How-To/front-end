import React, {useState, useEffect, useContext} from 'react';
import { UserContext, userContext } from '../contexts/UserContext';
import { axiosWithAuth } from '../utils/axiosWithAuth';
import axios from 'axios';
import CreatorHowTo from './CreatorHowTo';
import {
    Button,
    ButtonGroup,
    Form,
    FormGroup,
    Label,
    Input,
    Row
  } from "reactstrap";
// Sample Data - will come from API
import testHowtos from '../data/howtos'

const initialCreator = {
        id: '',
        username: "",
        role: ""
}

const initialFormValues = {
    title: '',
    author: '',
    paragraphs: ['']
}
function Creator() {
    const { user, setUser } = useContext(UserContext);
    const [creator, setCreator] = useState(initialCreator);
    const [creatorHowtos, setCreatorHowtos] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formValues, setFormValues] = useState(initialFormValues);
    
    // request user from api and check for role, permission to create
    useEffect(() => {
        // get user with userid
        // sample users
        const userSubscriber = {
            id: 1,
            username: "user1",
            password: "password",
            role: "subscriber"
          }
             
          const userCreator ={
            id: 2,
            username: "user2",
            password: "abc123",
            role: "creator"
          } 
        // axiosWithAuth().get(`http://reqres.in/api/user/${user.id}`)
        axios.get(`https://reqres.in/api/user/2`)
        .then(res => {
            console.log(res);
            // setCreator({
            //     ...creator, 
            //     id: userSubscriber.id, 
            //     username: userSubscriber.username,
            //     role: userSubscriber.role
            // });
            setCreator({
                ...creator, 
                id: userCreator.id, 
                username: userCreator.username,
                role: userCreator.role
            });
        })
        .catch(err => console.log(err))
    }, [])

    // every time user changes, if user is creator, request howtos from api
    // filter by creator.id matches user.id to list user's howtos
    useEffect(() => {
        // get all howtos and filter for creators howtos
        if (creator.role === 'creator'){
            axios.get('https://reqres.in/api/users')
            .then(res => {
                console.log(res);
                console.log(testHowtos);
                console.log(creator.id);
                const creatorHowTos = testHowtos.filter(howto => howto.creator_id === creator.id);
                console.log(creatorHowTos);
                setCreatorHowtos(creatorHowTos);
            })
            .catch(err => {
                console.log(err)
            })
        }
    }, [creator])

    const handleEdit = (id) => {
        console.log("creator wants to edit HowTo #", id);
    }

    const handleDelete = (id) => {
        console.log("creator wants to delete HowTo #", id);
        //axiosWithAuth().delete('https://route/id)
        setCreatorHowtos(creatorHowtos.filter(howto => howto.id !== id))
    }

    const handleAdd = () => {
        console.log('creator wants to add a howto');
        setIsAdding(true);
    }

    const handleChange = (e) => {
        if (e.target.name.includes("paragraph")) {
            const name = e.target.name;
            const index = name.slice(9);
            const newParagraphs = formValues.paragraphs;
            newParagraphs[Number(index)] = e.target.value;
            setFormValues({
              ...formValues,
              paragraphs: [...newParagraphs]
            });
          } else {
            setFormValues({
              ...formValues,
              [e.target.name]: e.target.value,
            });
        }
    };
   

    const addParagraphField = () => {
        setFormValues({
            ...formValues,
            paragraphs: [...formValues.paragraphs, '']
        });
    }
    
    const cancelAdd = () => {
        setIsAdding(false);
        setFormValues(initialFormValues);
    }

    const removeEmptyParagraphs = () => {
        const newHowTo = formValues;
        const filledParagraphs = formValues.paragraphs.filter((paragraph) => paragraph !== "");
        newHowTo.paragraphs = filledParagraphs;
        return newHowTo;
    }

    const addHowto = (e) => {
        e.preventDefault();
        const newHowTo = removeEmptyParagraphs();
        // submit api request to post new howto
        // axiosWithAuth().post('route', newHowTo);
        console.log(newHowTo);
        setCreatorHowtos([...creatorHowtos, newHowTo]);
        setIsAdding(false);
        setFormValues(initialFormValues);
    }

    if (creator.role !== 'creator') {
        return (
            <div className='not-creator-message'>
                You do not currently have permission to create content.
            </div>
        )
    }
    return (
        <div className='creator-dashboard'>
            <h2>{creator.username}'s Creator Dashboard</h2>
            {!isAdding && (<Button size='md' color='info' onClick={handleAdd}>Add a How-To</Button>)}
            {isAdding && (
                <div className='form-wrapper'>
                    <Form onSubmit={addHowto}>
                        <FormGroup>
                            <Label for='title'>Title</Label>
                            <Input type='text' 
                                id='title'
                                name='title'
                                placeholder='enter a title'
                                value={formValues.title}
                                onChange={handleChange}
                                required
                                />
                        </FormGroup>
                        <FormGroup>
                            <Label for='author'>Author</Label>
                            <Input type='text' 
                                id='author'
                                name='author'
                                placeholder='enter your name or username'
                                value={formValues.author}
                                onChange={handleChange}
                                required
                                />
                        </FormGroup>
                        {formValues.paragraphs.map((paragraph, index) =>(
                            <FormGroup>
                            <Label for='paragraph'>{`Paragraph ${index + 1}`}</Label>
                            <Input className='paragraph-input' type='textarea' 
                                id='paragraph'
                                name={`paragraph${index}`}
                                placeholder='enter your content'
                                value={formValues.paragraphs[index]}
                                onChange={handleChange}
                                />
                            </FormGroup>
                        ) )}
                        <div className='form-controls'>
                            <div className='top-row'>
                                <Button color='info' size='sm' onClick={addParagraphField}>+</Button>
                            </div>
                            <div className='row'>
                            <ButtonGroup>
                                <Button color='info' onClick={cancelAdd}>Cancel</Button>
                                <Button color='info' type='submit'>Add How-To</Button>
                            </ButtonGroup>
                            </div>
                        </div>
                    </Form>
                
                </div>
                
            )}
            
            {creatorHowtos.map(howto => (
                <>
                <CreatorHowTo key={howto.id} howto={howto} handleEdit={handleEdit} handleDelete={handleDelete}/>
            </>
            ))}
        
            
            <p>Edit a tutorial</p> 
            <p>Add a tutorial</p>
        </div>
    )
}

export default Creator
