import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials } from '../redux/authSlice';

export const movieApi = createApi({
  reducerPath: 'movieApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { endpoint }) => {

      const auth = localStorage.getItem("auth");
      const token = auth ? JSON.parse(auth).token : null;

      if (token &&
        (
          endpoint === 'addMovie'
          || endpoint == 'editMovie'
          || endpoint == 'deleteMovie'
          || endpoint == 'addScreening'
          || endpoint == 'editScreening'
          || endpoint == 'deleteScreening'
          || endpoint == 'bookSeats'
        )) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Movies', 'Screenings'],
  endpoints: (builder) => ({

    getMoviesByWeek: builder.query({
      query: (week) => `/movies/week?week_number=${week}`,
      transformResponse: (response) => response.data,
      providesTags: ['Movies']
    }),

    getAllMovies: builder.query({
      query: () => '/movies',
      transformResponse: (response) => response.data,
      providesTags: ['Movies'],
    }),

    login: builder.mutation({
      query: (data) => ({
        url: '/login',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { user, token } = data.data;
          localStorage.setItem("auth", JSON.stringify({user, token}));
          dispatch(setCredentials({ user, token }));
        } catch (error) {
          console.error('Login failed', error);
        }
      },
    }),

    register: builder.mutation({
      query: (data) => ({
        url: '/register',
        method: 'POST',
        body: {
          name: data.name,
          email: data.email,
          password: data.password,
          password_confirmation: data.passwordAgain,
        },
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error('Registration failed', error);
        }
      },
    }),

    addMovie: builder.mutation({
      query: ({ title, description, length, genre, releaseYear, image }) => ({
        url: '/movies',
        method: 'POST',
        body: {
          title,
          description,
          duration: length,
          genre,
          release_year: releaseYear,
          image_path: image,
        },
      }),
      invalidatesTags: ['Movies'],
    }),

    getSingleMovie: builder.query({
      query: (id) => `/movies/${id}`,
      transformResponse: (response) => response.data,
    }),

    editMovie: builder.mutation({
      query: ({ id, title, description, length, genre, releaseYear, image }) => ({
        url: `/movies/${id}`,
        method: 'PUT',
        body: {
          title,
          description,
          duration: length,
          genre,
          release_year: releaseYear,
          image_path: image,
        },
      }),
      invalidatesTags: ['Movies'],
    }),

    deleteMovie: builder.mutation({
      query: (id) => ({
        url: `/movies/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Movies'],
    }),

    getSingleScreening: builder.query({
      query: (id) => `/screenings/${id}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, id) => [{ type: 'Screenings', id }],
    }),

    addScreening: builder.mutation({
      query: ({ movie_id, room_id, date, start_time }) => ({
        url: '/screenings',
        method: 'POST',
        body: {
          movie_id,
          room_id,
          date,
          start_time
        },
      }),
      invalidatesTags: ['Screenings'],
    }),

    editScreening: builder.mutation({
      query: ({ id, movie_id, room_id, date, start_time }) => ({
        url: `/screenings/${id}`,
        method: 'PUT',
        body: {
          movie_id,
          room_id,
          date,
          start_time
        },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Screenings', id },
        { type: 'Movies' }
      ],
    }),
    

    deleteScreening: builder.mutation({
      query: (id) => ({
        url: `/screenings/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Screenings', id }],
    }),
    

    bookSeats: builder.mutation({
      query: (body) => ({
        url: '/bookings',
        method: 'POST',
        body: body
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Screenings', id: arg.screening_id } // Vagy arg.screeningId, ahogy te küldöd
      ],
    }),
    
  }),
});

export const {
  useGetMoviesByWeekQuery,
  useGetAllMoviesQuery,
  useLoginMutation,
  useRegisterMutation,
  useAddMovieMutation,
  useAddScreeningMutation,
  useGetSingleMovieQuery,
  useEditMovieMutation,
  useGetSingleScreeningQuery,
  useBookSeatsMutation,
  useDeleteMovieMutation,
  useDeleteScreeningMutation,
  useEditScreeningMutation
} = movieApi;
