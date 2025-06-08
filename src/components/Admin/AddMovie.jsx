import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useAddMovieMutation,
  useEditMovieMutation,
  useGetSingleMovieQuery
} from '../../services/movieApi';
import { useDispatch } from 'react-redux';
import { setSelectedMovie } from '../../redux/movieSlice';
import toast from 'react-hot-toast';

function AddMovie() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [length, setLength] = useState('');
  const [genre, setGenre] = useState('');
  const [releaseYear, setReleaseYear] = useState('');
  const [image, setImage] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const [addMovie, { isLoading: isAdding }] = useAddMovieMutation();
  const [editMovie, { isLoading: isEditing }] = useEditMovieMutation();
  const { data: movieData, isSuccess } = useGetSingleMovieQuery(id, {
    skip: !isEditMode,
  });
    

  useEffect(() => {
    if (isEditMode && isSuccess && movieData) {
      setTitle(movieData.title || '');
      setDesc(movieData.description || '');
      setLength(movieData.duration?.toString() || '');
      setGenre(movieData.genre || '');
      setReleaseYear(movieData.release_year?.toString() || '');
      setImage(movieData.image_path || '');
    }
  }, [isEditMode, isSuccess, movieData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setFieldErrors({});

    const moviePayload = {
      title,
      description: desc,
      length: Number(length),
      genre,
      releaseYear: Number(releaseYear),
      image,
    };

    try {
      if (isEditMode) {
        await editMovie({ id, ...moviePayload }).unwrap();
        dispatch(setSelectedMovie(null));
        toast.success('Movie edited successfully');
      } else {
        await addMovie(moviePayload).unwrap();
        toast.success('New movie added!');
      }
      navigate('/');
    } catch (error) {
      const apiError = error?.data;
      setErrorMsg(apiError?.message || 'Error saving movie!');
      setFieldErrors(apiError?.errors || {});
      toast.error('Error! Cannot add or edit movie!');
    }
  };

  const renderFieldError = (fieldName) => (
    <div className="text-sm text-red-500 min-h-[1.2rem]">
      {fieldErrors[fieldName]?.[0] || ''}
    </div>
  );

  return (
    <div className="p-5 grid place-items-center mt-5">
      <h1 className="text-4xl text-center mb-8">
        {isEditMode ? 'Edit Movie' : 'Add Movie'}
      </h1>
      <form onSubmit={handleSubmit} className="grid gap-5 w-full max-w-md">
        <div>
          <input
            type="text"
            placeholder="Title"
            className="input input-bordered w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {renderFieldError('title')}
        </div>

        <div>
          <textarea
            placeholder="Description"
            className="textarea textarea-bordered w-full"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          {renderFieldError('description')}
        </div>

        <div>
          <input
            type="number"
            placeholder="Length (in minutes)"
            className="input input-bordered w-full"
            value={length}
            onChange={(e) => setLength(e.target.value)}
          />
          {renderFieldError('duration')}
        </div>

        <div>
          <input
            type="text"
            placeholder="Genre"
            className="input input-bordered w-full"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          />
          {renderFieldError('genre')}
        </div>

        <div>
          <input
            type="number"
            placeholder="Release Year"
            className="input input-bordered w-full"
            value={releaseYear}
            onChange={(e) => setReleaseYear(e.target.value)}
          />
          {renderFieldError('release_year')}
        </div>

        <div>
          <input
            type="text"
            placeholder="Image URL"
            className="input input-bordered w-full"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
          {renderFieldError('image_path')}
        </div>

        <button
          type="submit"
          className="btn btn-success w-full"
          disabled={isAdding || isEditing}
        >
          {(isEditMode ? (isEditing ? 'Editing...' : 'Edit') : (isAdding ? 'Adding...' : 'Add')) + ' Movie'}
        </button>
      </form>

      <p
        className="text-red-500 mt-3"
        style={{ minHeight: '1.5rem', maxHeight: '1.5rem', overflow: 'hidden' }}
      >
        {errorMsg}
      </p>
    </div>
  );
}

export default AddMovie;
