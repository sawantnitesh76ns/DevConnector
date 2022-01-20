import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { setAlert } from '../../action/alert';
import PropTypes from 'prop-types';


export const Register = ({ setAlert }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    });

    const { name, email, password, password2 } = formData

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })

    const onSubmit = async e => {
        e.preventDefault();
        if (password !== password2) {
            console.log("Paaword diddnnt match")
            setAlert("Password Do Not match", 'danger');

        } else {
            console.log('SUCCESS')
            // const newUser = {
            //     name,
            //     email,
            //     password
            // };

            // try {
            //     const config = {
            //         headers: {
            //             'Content-Type': 'application/json'
            //         }
            //     };

            //     const body = JSON.stringify(newUser);
            //     console.log(body)
            //     console.log(config)
            //     const res = await axios.post('/api/users', body, config);
            //     console.log(res)
            //     console.log(res.data)

            // } catch (error) {
            //     console.error(error.res.data)

            // }
        }

    }

    return (
        <Fragment>
            <h1 className="large text-primary">Sign Up</h1>
            <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
            <form className="form" action="create-profile.html" onSubmit={e => onSubmit(e)}>
                <div className="form-group">
                    <input type="text" placeholder="Name" name="name" value={name} onChange={e => onChange(e)} required />
                </div>
                <div className="form-group">
                    <input type="email" placeholder="Email Address" value={email} onChange={e => onChange(e)} name="email" />
                    <small className="form-text"
                    >This site uses Gravatar so if you want a profile image, use a
                        Gravatar email
                    </small>
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={e => onChange(e)}
                        minLength="6"
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        name="password2"
                        value={password2}
                        onChange={e => onChange(e)}
                        minLength="6"
                    />
                </div>
                <input type="submit" className="btn btn-primary" value="Register" />
            </form>
            <p className="my-1">
                Already have an account? <Link to="/login">Log In</Link>
            </p>
        </Fragment>
    )
};

Register.propTypes = {
    setAlert: PropTypes.func.isRequired
}

export default connect(null, { setAlert })(Register)






