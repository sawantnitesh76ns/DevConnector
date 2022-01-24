import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const PrivateRoute = ({ children, auth: { isAuthenticated, loading } }) => {
    return !isAuthenticated && !loading ? <Navigate to='/login' /> : children
}


PrivateRoute.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProp = state => ({
    auth: state.auth
})

export default connect(mapStateToProp)(PrivateRoute);
