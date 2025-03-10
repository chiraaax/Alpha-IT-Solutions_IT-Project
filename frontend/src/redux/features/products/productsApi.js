import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getBaseURL } from '../../../utils/baseUtil';


const productsApi = createApi({ 
    reducerPath: 'productsApi',
    baseQuery : fetchBaseQuery({
        baseUrl: `${(getBaseURL())}/api/products`
    }),
    tagTypes: ["products"],
    endpoints : (builder) => ({

        //fetch all products
        fetchAllProducts : builder.query({
            query: ({
                category,
                color, 
                minPrice,
                maxPrice, 
                page=1, 
                limit =10}) => {
                const queryParams = new URLSearchParams({
                    category: category || '',
                    color : color || '',
                    minPrice : minPrice || 0,
                    maxPrice : maxPrice || '',
                    page: page.toString(),
                    limit : limit.toString(),
                }).toString();

                return `/?${queryParams}`
            },
            providedTags : ['products'],
        }),

        //fetch single product
        fetchProductById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: 'products', id }],
        }),
        
        //add product routes
        AddProduct :  builder.mutation({
            query: (newProduct) => ({
                url: '/create-product',
                method: "POST",
                body: newProduct,
                credentials: "include"
            }),
            invalidatesTags: ['products']
        }),

        //fetch related products
        // To this:
        fetchRelatedProducts: builder.query({ 
            query: (id) => {
                console.log("Fetching related products for ID:", id);
                return `/${id}/related`; 
            },
        }),
        

        //update product
        updateProduct : builder.mutation({
            query: ({id, ...rest}) => ({
                url: `/update-product/${id}`,
                method: "PATCH",
                body: rest,
                credentials: "include"
            }),
            invalidatesTags: ['products'],
        }),

        //delete product
        deleteProduct : builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE",
                credentials: "include"
            }),
            invalidatesTags: (result, error, id) => [{type: 'products', id}]
        }),
    })
})

export const {useFetchAllProductsQuery, useFetchProductByIdQuery, useAddProductMutation , useUpdateProductMutation, useDeleteProductMutation, useFetchRelatedProductsQuery} = productsApi;

export default productsApi;
