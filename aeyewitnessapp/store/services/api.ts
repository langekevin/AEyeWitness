import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { FileObject } from '@/store/models/Files';
import { CreateResponse } from '@/store/models/Create';


export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_API_URL}`
    }),
    tagTypes: ['images', 'download'],
    endpoints: (build) => ({
        addImage: build.mutation<{}, FormData>({
            query: (body) => ({
                url: `/upload`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['images']
        }),
        fetchImageList: build.query<FileObject[], void>({
            query: () => ({
                url: '/filelist',
            }),
            providesTags: ['download']
        })
    })
});
