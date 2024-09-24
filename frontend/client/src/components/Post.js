import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';


const PostCreation = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState('');
    const [availableTags, setAvailableTags] = useState([]);
    const baseURL = "http://localhost:8000";

    const { token } = useContext(AuthContext);
    console.log(token)


    const handleTagChange = (e) => {
        const selectedTags = Array.from(e.target.selectedOptions, option => option.value);
        setTags(selectedTags);
    };

    // Add a new tag
    const handleAddTag = () => {
        if (newTag && !availableTags.includes(newTag)) {
            setAvailableTags([...availableTags, newTag]);
            setTags([...tags, newTag]);
            setNewTag('');
        }
    };

    // Submit the post data
    const handleSubmit = (e) => {
        e.preventDefault();

        const postData = {
            title,
            content,
            tags
        };
        if (!token) {
            console.error('No authentication token found');
            return; // Prevent further execution if no token
        }

        fetch(`${baseURL}/api/posts/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Post created:', data);
            })
            .catch(error => console.error('Error creating post:', error));
    };

    return (
        <div>
            <h2>Create a New Post</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Content:</label>
                    <textarea 
                        value={content} 
                        onChange={(e) => setContent(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Tags:</label>
                    <select multiple value={tags} onChange={handleTagChange}>
                        {availableTags.map(tag => (
                            <option key={tag} value={tag}>
                                {tag}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <input 
                        type="text" 
                        value={newTag} 
                        onChange={(e) => setNewTag(e.target.value)} 
                        placeholder="Add a new tag" 
                    />
                    <button type="button" onClick={handleAddTag}>Add Tag</button>
                </div>
                <button type="submit">Create Post</button>
            </form>
        </div>
    );
};

const PostView = ({ postId }) => {
    const [post, setPost] = useState(null);
    const [contact, setContact] = useState('');

    useEffect(() => {
        // Fetch the post details
        fetch(`/api/posts/${postId}/`)
            .then(response => response.json())
            .then(data => setPost(data))
            .catch(error => console.error('Error fetching post:', error));
    }, [postId]);

    const handleInterestedUserSubmit = (e) => {
        e.preventDefault();

        // Submit the interested user's contact to the backend
        fetch(`/api/posts/${postId}/interested_users/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ contact }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('User added:', data);
                setContact('');
            })
            .catch(error => console.error('Error submitting contact:', error));
    };

    if (!post) return <div>Loading...</div>;

    return (
        <div>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <div>
                <h3>Interested Users</h3>
                <form onSubmit={handleInterestedUserSubmit}>
                    <input 
                        type="text" 
                        value={contact} 
                        onChange={(e) => setContact(e.target.value)} 
                        placeholder="Enter your contact" 
                    />
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
};

export { PostCreation, PostView };
