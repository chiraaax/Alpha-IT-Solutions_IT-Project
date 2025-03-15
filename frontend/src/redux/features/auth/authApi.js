//This is to create an auth api
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getBaseURL } from '../../../utils/baseUtil'

const authAPi = createApi({
    reducerPath: 'authApi',

    baseQuery: fetchBaseQuery({
        baseUrl: `${getBaseURL()}/api/auth`,
        credentials: 'include',
    }),
    tagTypes: ["User"],
    endpoints : (builder) => ({
        //register functionality
        registerUser : builder.mutation({
            query: (newUser) => ({
                url: '/register',
                method: 'POST',
                body: newUser,
            }),
        }),
        //login functionality
        loginUser : builder.mutation({
            query: (credentials) => ({
                url: '/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        //logout functionality
        logoutUser : builder.mutation({
            //no need to pass any data because the server will handle the logout
            query: () => ({
                url: '/logout',
                method: 'POST',
            }),
        }),
        //get user functionality
        getUser : builder.query({
            //no need to pass any data because the server will handle the logout
            query: () => ({
                url: '/users',
                method: 'GET',
            }),
            //invalidates the cache when the user logs out
            refetchOnMount : true,
            invalidatesTags : ['User'],
        }),
        //delete user functionality
        //mutation is used because we are deleting data
        deleteUser : builder.mutation({
            query: (userId) => ({
                url: `/users/${userId}`,
                method: 'DELETE',
            }),
            invalidatesTags : ['User'],
        }),
        //update user role functionality
        updateUserRole : builder.mutation({
            query: ({userId, role}) => ({
                url: `/users/${userId}`,
                method: 'PUT',
                body: {role},
            }),
            refetchOnMount : true,
            invalidatesTags : ['User'],
        }),
        //edit profile functionality
        editProfile : builder.mutation({
            query: (data) => ({
                url: '/edit-profile',
                method: 'PATCH',
                body: data,
            }),
            refetchOnMount : true,
            invalidatesTags : ['User'],
        }),
    })
    
})

export const { useRegisterUserMutation, useLoginUserMutation ,  useLogoutUserMutation , useGetUserQuery, useDeleteUserMutation, useUpdateUserRoleMutation, useEditProfileMutation} = authAPi;
export default authAPi;