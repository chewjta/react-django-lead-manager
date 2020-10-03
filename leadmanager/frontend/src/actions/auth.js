import axios from "axios";
import { returnErrors } from "./messages";

import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
} from "./types";

// CHECK TOKEN & LOAD USER
export const loadUser = () => (dispatch, getState) => {
    // User Loading
    dispatch({ type: USER_LOADING });
    axios
        .get("/api/auth/user", tokenConfig(getState))
        .then((res) => {
            dispatch({
                type: USER_LOADED,
                payload: res.data,
            });
        })
        .catch((err) => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({
                type: AUTH_ERROR,
            });
        });
};

// LOGIN USER

export const login = (username, password) => (dispatch) => {
    // headers

    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    // Request body

    const body = JSON.stringify({ username, password });

    axios
        .post("/api/auth/login", body, config)
        .then((res) => {
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data,
            });
        })
        .catch((err) => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({
                type: LOGIN_FAIL,
            });
        });
};

//REGISTER USER

export const register = ({ username, password, email }) => (dispatch) => {
    // headers

    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    // Request body

    const body = JSON.stringify({ username, password, email });

    axios
        .post("/api/auth/register", body, config)
        .then((res) => {
            dispatch({
                type: REGISTER_SUCCESS,
                payload: res.data,
            });
        })
        .catch((err) => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({
                type: REGISTER_FAIL,
            });
        });
};

//Logout user

export const logout = () => (dispatch, getState) => {
    // GET TOKEN FROM STATE

    axios
        .post("/api/auth/logout/", null, tokenConfig(getState))
        .then((res) => {
            dispatch({
                type: LOGOUT_SUCCESS,
            });
        })
        .catch((err) => {
            dispatch(returnErrors(err.response.data, err.response.status));
        });
};

// set up config with token - helper function

export const tokenConfig = (getState) => {
    // GET TOKEN FROM STATE
    const token = getState().auth.token;

    // headers

    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    // if token added to headers config
    if (token) {
        config.headers["Authorization"] = `Token ${token}`;
    }

    return config;
};
