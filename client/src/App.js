import './App.css';
import { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './component/layout/Navbar';
import HomeBody from './component/layout/HomeBody';
import Register from './component/auth/Register';
import Login from './component/auth/Login';
import Alert from './component/layout/Alert';
import Dashboard from './component/dashboard/Dashboard';
import CreateProfile from './component/profilr-form/CreateProfile';
import PrivateRoute from './component/routing/PrivateRoute';
import EditProfile from './component/profilr-form/EditProfile';
import AddExperience from './component/profilr-form/AddExperience';
import AddEducation from './component/profilr-form/AddEducation';
import Profiles from './component/profiles/Profiles';
import Profile from './component/profile/Profile';
import Posts from './component/posts/Posts';
import Post from './component/post/Post';


//Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './action/auth';
import setAuthToken from './utils/setAuthToken';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  //if you are passing empty list [], So then the useEffect will run only once
  //And then it will work as component did mount
  useEffect(() => {
    store.dispatch(loadUser())
  }, [])
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Routes>
            <Route exact path='/' element={<HomeBody />} ></Route>
          </Routes>
          <section className="container">
            <Alert />
            <Routes>
              <Route exact path='/register' element={<Register />} ></Route>
              <Route exact path='/login' element={<Login />} ></Route>
              <Route exact path='/profiles' element={<Profiles />} ></Route>
              <Route exact path='/profile/:id' element={<Profile />} ></Route>
              <Route exact path='/dashboard' element={<PrivateRoute >< Dashboard /></PrivateRoute>} ></Route>
              <Route exact path='/create-profile' element={<PrivateRoute >< CreateProfile /></PrivateRoute>} ></Route>
              <Route exact path='/edit-profile' element={<PrivateRoute >< EditProfile /></PrivateRoute>} ></Route>
              <Route exact path='/add-experience' element={<PrivateRoute >< AddExperience /></PrivateRoute>} ></Route>
              <Route exact path='/add-education' element={<PrivateRoute >< AddEducation /></PrivateRoute>} ></Route>
              <Route exact path='/posts' element={<PrivateRoute >< Posts /></PrivateRoute>} ></Route>
              <Route exact path='/posts/:id' element={<PrivateRoute >< Post /></PrivateRoute>} ></Route>
            </Routes>
          </section>
        </Fragment>
      </Router >
    </Provider>
  )
}

export default App;
