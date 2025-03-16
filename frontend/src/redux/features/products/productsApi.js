// features/api/productsApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getBaseURL } from '../../../utils/baseUtil';

const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseURL()}/api/products`,
    credentials: "include", // ✅ Ensures authentication headers & cookies are sent
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json"); // ✅ Ensures proper JSON content type
      return headers;
    },
  }),
  tagTypes: ["products"],

  endpoints: (builder) => ({
    // Fetch all products with optional filters (category, price range, pagination)
    fetchAllProducts: builder.query({
      query: ({ category, minPrice, maxPrice, page = 1, limit = 10 }) => {
        const queryParams = new URLSearchParams({
          category: category || '',
          minPrice: minPrice || 0,
          maxPrice: maxPrice || '',
          page: page.toString(),
          limit: limit.toString(),
        }).toString();
        return `/?${queryParams}`;
      },
      providesTags: ['products'],
    }),

    // Fetch a single product by ID
    fetchProductById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'products', id }],
    }),

    // Create a new product
    addProduct: builder.mutation({
      query: (newProduct) => ({
        url: '/',
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ['products'], // ✅ Clears the product cache after adding

      // ✅ Handles API response & errors
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("✅ Product added successfully:", data);
        } catch (error) {
          console.error("❌ Error adding product:", error);
        }
      },
    }),

    // Fetch related products
    fetchRelatedProducts: builder.query({
      query: (id) => `/${id}/related`,
      providesTags: (result, error, id) => [{ type: 'products', id }],
    }),

    // Update an existing product
    updateProduct: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: rest,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'products', id }],
    }),

    // Delete a product
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: 'products', id }],
    }),
  }),
});

export const {
  useFetchAllProductsQuery,
  useFetchProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useFetchRelatedProductsQuery,
} = productsApi;

export default productsApi;
