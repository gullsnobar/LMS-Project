import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    token: string;
    user: any;
}

const initialState: AuthState = {
    token: "",
    user: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        userRegistration: (state, action: PayloadAction<{ token: string }>) => {
            state.token = action.payload.token;
        },
        userLoggedIn: (
            state,
            action: PayloadAction<{ accessToken: string; user: any }>
        ) => {
            state.token = action.payload.accessToken;
            // Only overwrite user if a real user object was provided
            if (action.payload.user !== null && action.payload.user !== undefined) {
                state.user = action.payload.user;
            }
        },
        userLoggedOut: (state) => {
            state.token = "";
            state.user = "";
        },
    },
});

export const { userRegistration, userLoggedIn, userLoggedOut } =
    authSlice.actions;

export default authSlice.reducer;
