import {useEffect, useState, createContext} from 'react';
import { useNavigate } from 'react-router-dom';
import {format} from 'date-fns';
import api from '../api/posts';
import useWindowSize from '../hooks/useWindowSize';
import useAxiosFetch from '../hooks/useAxiosFetch';

const DataContext = createContext({})

export const DataProvider = ({children}) => {
    const [posts, setPosts] = useState([]);
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [postTitle, setPostTitle] = useState('');
    const [postBody, setPostBody] = useState('');
    const [editPostTitle, setEditPostTitle] = useState('');
    const [editPostBody, setEditPostBody] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const history = useNavigate();
    const {width} = useWindowSize();
    const {data, fetchError, isLoading} = useAxiosFetch('http://localhost:3500/posts');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
      const datetime = format(new Date(), 'MMMMM dd, yyyy pp');
      const newPost = {id, title: postTitle, datetime, body: postBody};
      try {
        const response = await api.post('/posts', newPost);
        const allPosts = [...posts, response.data];
        setPosts(allPosts);
        setPostTitle('');
        setPostBody('');
        history('/');
      }
      catch(err) {
        console.log(`Error: ${err.message}`);
      }
    }
  
    const handleDelete = async (id) => {
      try {
        await api.delete(`/posts/${id}`);
        const postsList = posts.filter(post => post.id !== id);
        setPosts(postsList);
        history('/');
      }
      catch(err) {
        console.log(`Error: ${err.message}`);
      }
    }
  
    const handleEdit = async (id) => {
      const datetime = format(new Date(), 'MMMMM dd, yyyy pp');
      const updatedPost = {id, title: editPostTitle, datetime, body: editPostBody};
      try {
        const response = await api.put(`/posts/${id}`, updatedPost);
        if(response && response.data) {
          setPosts(posts.map(post => post.id === id ? {...response.data} : post));
          setEditPostTitle('');
          setEditPostBody('');
          setIsSaved(true);

          setTimeout(() => {
            setIsSaved(false);
          }, 3000);
        }
      }
      catch(err) {
        console.log(`Error: ${err.message}`);
      }
    }
  
    useEffect(() => {
      setPosts(data)
    }, [data]);
  
    useEffect(() => {
      const filteredResults = posts.filter(post => (
        (post.body.toLowerCase()).includes(search.toLowerCase()) ||
        (post.title.toLowerCase()).includes(search.toLowerCase())
      ));
      setSearchResults(filteredResults.reverse());
    }, [posts, search]);

    return (
        <DataContext.Provider value={{
            width, search, setSearch, searchResults, posts, fetchError, isLoading, handleSubmit, postTitle, setPostTitle, postBody, setPostBody,
            handleEdit, editPostTitle, setEditPostTitle, editPostBody, setEditPostBody, isSaved, setIsSaved, handleDelete
        }}>
            {children}
        </DataContext.Provider>
    )
}

export default DataContext;