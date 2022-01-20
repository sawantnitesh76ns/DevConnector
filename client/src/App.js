import './App.css';
import { Fragment } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navbar } from './component/layout/Navbar';
import { HomeBody } from './component/layout/HomeBody';
import Register from './component/auth/Register';
import Login from './component/auth/Login';
import Alert from './component/layout/Alert';


//Redux
import { Provider } from 'react-redux';
import store from './store';

const App = () => {
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

            </Routes>
          </section>
        </Fragment>
      </Router >
    </Provider>
  )
}

export default App;
