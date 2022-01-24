import axios from 'axios';
import { setAlert } from './alert';
import { useNavigate } from 'react-router-dom';


import {
    GET_PROFILE,
    PROFILE_ERROR
} from './types'

//GEt Current USer Profile
export const getCurrentProfile = () => async dispatch => {
    try {
        const res = await axios.get('http://localhost:5000/api/profile/me')

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });

    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        });
    }
}

// Create or Update a profile
export const createProfile = (formData, useNavigate, edit = false) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const res = await axios.post('http://localhost:5000/api/profile', formData, config);

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });
        console.log("Received Response")
        console.log(res.data)
        dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created'))


        if (!edit) {
            useNavigate('/dashboard')
        }
    } catch (error) {
        console.log(error.response)
        const errors = error.response.data.errors;

        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        });
    }
}