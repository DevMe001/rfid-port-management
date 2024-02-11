import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Immutable from "../immutable/constant";

export const authService = createApi({
    reducerPath:'auth',
    tagTypes:['Auth'],
    baseQuery:fetchBaseQuery({
        baseUrl:Immutable.API
    }),
    endpoints:(builder) => ({
        googleAuth:builder.mutation({
            query() {
                return {
                  url: `auth/google`,
                  method: 'GET',
                };
              },
        
            invalidatesTags:[{type:'Auth',id:'auth'}]
        }),
        facebookAuth : builder.mutation({
            query() {
                return {
                  url: `auth/facebook`,
                  method: 'GET',
                };
              },
            invalidatesTags:[{type:'Auth',id:'auth'}]
        })
    })
})

export const {useGoogleAuthMutation,useFacebookAuthMutation} = authService;