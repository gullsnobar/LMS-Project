import { apiSlice } from "../api/apiSlice";


export const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        updateAvatar: builder.mutation({
            query: (avatar) => ({
                url: "/api/users/update-user-avatar",
                method: "PUT",
                body: avatar,
                credentials: "include",
            }),
        }),

        editProfile: builder.mutation({
            query: ({ name, email }) => ({
                url: "/api/users/update-user-info",
                method: "PUT",
                body: { name, email },
                credentials: "include",
            }),
        }),

        updatePassword: builder.mutation({
            query: ({ newPassword, oldPassword }) => ({
                url: "/api/users/update-user-password",
                method: "PUT",
                body: { newPassword, oldPassword },
                credentials: "include",
            }),
        }),

        getAllUsers: builder.query({
            query: () => ({
                url: "/api/users/get-users",
                method: "GET",
                credentials: "include",
            }),
        }),

        updateUserRole: builder.mutation({
            query: ({ id, role }) => ({
                url: "/api/users/update-user-role",
                method: "PUT",
                body: { id, role },
                credentials: "include" as const,
            }),
        }),

        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/api/users/delete-user`,
                method: "DELETE",
                body: { id },
                credentials: "include" as const,
            }),
        }),
    })
})

export const { useUpdateAvatarMutation, useEditProfileMutation, useUpdatePasswordMutation, useGetAllUsersQuery, useUpdateUserRoleMutation, useDeleteUserMutation } = userApi;