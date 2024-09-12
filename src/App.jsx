import { createContext, useContext, useEffect, useState, useRef } from 'react';
import Lottie from 'react-lottie';
import './App.css';
import likeAnimationData from './animations/likeAnimation.json';
import dislikeAnimationData from './animations/dislikeAnimation.json';

const RouterContext = createContext(null);

const routes = [
  {
    id: crypto.randomUUID(),
    name: 'Home',
    url: '#/',
    element: <Home />,
  },
  {
    id: crypto.randomUUID(),
    name: 'About',
    url: '#/about',
    element: <About />,
  },
  {
    id: crypto.randomUUID(),
    name: 'Posts',
    url: '#/posts',
    element: <Posts />,
  },
  {
    id: crypto.randomUUID(),
    name: 'Contact',
    url: '#/contact',
    element: <Contact />,
  },
];

const notFound = {
  name: 'Page not found',
  element: <NotFound />,
};

function getRoute(routeUrl) {
  const route = routes.find(x => x.url === routeUrl);
  return route ?? notFound;
}

const title = "App";

function setTitle(pageTitle) {
  document.title = `${pageTitle} - ${title}`;
}

function App() {
  const [route, setRoute] = useState(() => {
    if (location.hash.length < 2) {
      return routes[0];
    }
    return getRoute(location.hash);
  });

  useEffect(() => {
    setTitle(route.name);
  }, [route]);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(getRoute(location.hash));
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="container">
      <RouterContext.Provider value={route}>
        <Header />
        <Main />
        <Footer />
      </RouterContext.Provider>
    </div>
  );
}

function Main() {
  return (
    <div className="main">
      <Content />
      <Sidebar />
    </div>
  );
}

function Header() {
  return (
    <div className="header">
      <a href="#/" className='logo'>App</a>
      <Nav />
    </div>
  );
}

function Nav() {
  const route = useContext(RouterContext);

  return (
    <ul className="nav">
      {routes.map(x =>
        <li key={x.id}>
          <a href={x.url} className={route.url === x.url ? 'selected' : ''}>{x.name}</a>
        </li>
      )}
    </ul>
  );
}

function Content() {
  const route = useContext(RouterContext);

  return (
    <div className="content">
      <h1>{route.name}</h1>
      <div className="contentItem">
        {route.element}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="footer">&copy; 2024</div>
  );
}

function Sidebar() {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useLocalStorage('comments', []);

  function handleInputChange(e) {
    setComment(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (comment.trim() !== '') {
      const newComments = [...comments, comment];
      setComments(newComments);
      setComment('');
    }
  }

  return (
    <div className="sidebar">
      <div className="comments">
        <div className="userComments">
          <h5>Kullanıcı Yorumları</h5>
          <ul>
            {comments.map((comment, x) => (
              <li key={x}>{comment}</li>
            ))}
          </ul>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder='Yorumunuzu yazınız.'
            value={comment}
            onChange={handleInputChange}
          />
        </form>
      </div>
      <div className="widget">
        <LikeDislikeBtn isLike={true} />
        <LikeDislikeBtn isLike={false} />
      </div>
    </div>
  );
}

function LikeDislikeBtn({ isLike }) {
  const [count, setCount] = useState(
    localStorage[isLike ? 'likeCount' : 'dislikeCount'] ? parseInt(localStorage[isLike ? 'likeCount' : 'dislikeCount']) : 0
  );
  const lottieRef = useRef(null);

  useEffect(() => {
    localStorage[isLike ? 'likeCount' : 'dislikeCount'] = count;
  }, [count, isLike]);

  function increaseCount() {
    setCount(count + 1);
    if (lottieRef.current) {
      lottieRef.current.stop();
      lottieRef.current.play();
    }
  }

  const defaultOptions = {
    loop: false,
    autoplay: false,
    animationData: isLike ? likeAnimationData : dislikeAnimationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <button className={isLike ? 'likeBtn' : 'dislikeBtn'} onClick={increaseCount}>
      <Lottie options={defaultOptions} height={50} width={50} ref={lottieRef} />
      {count}
    </button>
  );
}

function Home() {
  return (
    <>
      <h1>Welcome to App Page </h1>
    </>
  );
}

function About() {
  return (
    <>
      <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusamus harum mollitia veniam, quidem fugiat corporis ab voluptatum odit sequi voluptate error repellat numquam nulla quae corrupti vero sunt delectus minus.</p>
      <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusamus harum mollitia veniam, quidem fugiat corporis ab voluptatum odit sequi voluptate error repellat numquam nulla quae corrupti vero sunt delectus minus.</p>
      <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusamus harum mollitia veniam, quidem fugiat corporis ab voluptatum odit sequi voluptate error repellat numquam nulla quae corrupti vero sunt delectus minus.</p>
      <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusamus harum mollitia veniam, quidem fugiat corporis ab voluptatum odit sequi voluptate error repellat numquam nulla quae corrupti vero sunt delectus minus.</p>
    </>
  );
}

function Contact() {
  return (
    <>
      <h1>Hi Guys 👋 I'm Arda</h1>
      <p>toramanarda.com.tr is my personal webpage. If you want to contact, visit my personal page :)</p>
    </>
  );
}

function Posts() {
  const [postId, setPostId] = useState(null);

  return (
    <>
      {postId ? <PostDetail postId={postId} setPostId={setPostId} /> : <PostList setPostId={setPostId} />}
    </>
  );
}

function PostList({ setPostId }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10); // Number of posts per page

  useEffect(() => {
    fetch('https://dummyjson.com/posts')
      .then(r => r.json())
      .then(r => {
        setPosts(r.posts);
        setLoading(false);
      })
      .catch(e => {
        setError(e);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading posts!</p>;

  // Calculate total pages
  const totalPages = Math.ceil(posts.length / postsPerPage);

  // Slice posts for the current page
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = posts.slice(startIndex, endIndex);

  // Change page handler
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <div className="postItems">
        {currentPosts.map(x =>
          <h3 key={x.id}>
            {x.title} <a
              href={'#/posts/' + x.id}
              onClick={e => { e.preventDefault(); setPostId(x.id); }}
            ><p>Click Me</p></a>
          </h3>
        )}
      </div>
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Former
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}> Next
        </button>
      </div>
    </div>
  );
}

function PostDetail({ postId, setPostId }) {
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function getData() {
    try {
      const postData = await fetch('https://dummyjson.com/posts/' + postId).then(r => r.json());
      const commentsData = await fetch(`https://dummyjson.com/posts/${postId}/comments`).then(r => r.json());

      setPost(postData);
      setComments(commentsData.comments);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, [postId]);

  function handleClick(e) {
    e.preventDefault();
    setPostId(null);
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading post!</p>;

  return (
    <>
      <h3>{post.title}</h3>
      <p>{post.body}</p>
      <h4>Comments</h4>
      {comments.map(x => <p key={x.id}><strong>{x.user.fullName}</strong>: {x.body}</p>)}
      <p><a href="#" onClick={handleClick}>Back</a></p>
    </>
  );
}

function NotFound() {
  return (
    <p>Page not found. <a href="#/">return home</a></p>
  );
}

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

export default App;
