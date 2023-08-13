import React from 'react';
import {useEffect} from 'react';
import {useParams, Link, useNavigate} from 'react-router-dom';
import { useContext } from 'react';
import DataContext from './context/DataContext';

const EditPost = () => {
    const {posts, handleEdit, editPostBody, setEditPostBody, editPostTitle, setEditPostTitle, isSaved, setIsSaved} = useContext(DataContext)
    const {id} = useParams();
    const history = useNavigate();
    const post = posts.find(post => post.id.toString() === id);

    useEffect(() => {
        if(post) {
            setEditPostTitle(post.title);
            setEditPostBody(post.body);
        }
    }, [post, setEditPostTitle, setEditPostBody])
  return (
    <main className="NewPost">
        {editPostTitle ? 
            (<>
                <h2>Edit Post</h2>
                <form className='newPostForm' onSubmit={(e) => e.preventDefault()}>
                <label htmlFor='editPostTitle'>Post Title</label>
                <input 
                    id='editPostTitle'
                    type='text'
                    required
                    value={editPostTitle}
                    onChange={(e) => setEditPostTitle(e.target.value)}
                />
                <label htmlFor='postBody'>Post Body</label>
                <textarea 
                    id='editPostBody'
                    type='text'
                    required
                    value={editPostBody}
                    onChange={(e) => setEditPostBody(e.target.value)}
                />
                <button type='submit' onClick={() => handleEdit(post.id)}>Submit</button>
                {isSaved && (<p className='statusMsg'>Message Saved Succesfully.</p>)}
                </form>
            </>) : (
              <>
                <h2>Page Not Found.</h2>
                <p>Well, that's disappointing.</p>
                <p><Link to="/">Visit Our HomePage.</Link></p>
              </>
            )
        } 
    </main>
  )
}

export default EditPost