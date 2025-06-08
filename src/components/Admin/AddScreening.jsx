import { useEffect, useState } from 'react';
import { useAddScreeningMutation, useEditScreeningMutation, useGetAllMoviesQuery, useGetSingleScreeningQuery } from '../../services/movieApi';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { setSelectedMovie } from '../../redux/movieSlice';

function AddScreening() {

  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedMovieId, setSelectedMovieId] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
    
  const [addScreening, { isLoading: isLoadingAddScrening }] = useAddScreeningMutation();
  const [editScreening, { isLoading: isLoadingEditScreening }] = useEditScreeningMutation();
  const { data: movieData, isLoading, isError } = useGetAllMoviesQuery();
  
  const { data: screeningData, isSuccess } = useGetSingleScreeningQuery(id, {
    skip: !isEditMode,
  });

  function getRoomSize(screening) {
    const room = screening.room;
    if (!room) {
      return 3;
    }
    else if (room.rows === 10 && room.seats === 10) {
      return 2;
    }
    else {
      return 1;
    }
  }

  useEffect(() => {
    if (isEditMode && isSuccess && movieData && screeningData && id !== undefined && id !== null) {
      const movie = movieData.find(x => x.screenings.some(x => x.id == id));
      if (movie) {
        const screening = movie.screenings.find(x => x.id == id);
        setSelectedMovieId(movie.id || '');
        setSelectedRoomId(getRoomSize(screeningData) || '');
        setTime(screeningData.start_time || '');
        setDate(screening.date || '');
      }
    }
  }, [isEditMode, isSuccess, movieData, screeningData, id]);


  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const rooms = [
    { id: 1, name: 'Small room' },
    { id: 2, name: 'Large room' },
    { id: 3, name: 'Empty' },
  ];

  const renderFieldError = (fieldName) => (
    <div className="text-sm text-red-500 min-h-[1.2rem]">
      {fieldErrors[fieldName]?.[0] || ''}
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setFieldErrors({});
    const payload = {
      movie_id: parseInt(selectedMovieId, 10),
      room_id: parseInt(selectedRoomId, 10),
      date,
      start_time: time
    };

    try {
      if (isEditMode) {
        await editScreening({ id, ...payload }).unwrap();
        toast.success('Screening edited successfully!');
      } else {
        await addScreening(payload).unwrap();
        toast.success('New screening added!');
      }
      dispatch(setSelectedMovie(null));
      navigate('/');
    } catch (error) {
      const apiError = error?.data;
      setErrorMsg(apiError?.message || 'Error creting screening!');
      setFieldErrors(apiError?.errors || {});
    }

  };

  return (
    <div className="p-5 grid place-items-center mt-5">
      <h1 className="text-4xl text-center mb-8">
      {isEditMode ? 'Edit Screening' : 'Add Screening'}
      </h1>
      <form className="grid gap-5 w-full max-w-md" onSubmit={handleSubmit}>
        <div>
        <select
          className="select select-bordered w-full"
          value={selectedMovieId || ''}
          onChange={(e) => setSelectedMovieId(e.target.value)}
          disabled={isLoading || isError}
        >
            <option value="" disabled hidden>
            Select a movie
          </option>
            {movieData?.map((movie) => (
              <option key={movie.id} value={movie.id}>
                {movie.title}
              </option>
            ))}
          </select>
          {renderFieldError('movie_id')}
        </div>

        <div>
          <select
            className="select select-bordered w-full"
            value={selectedRoomId}
            onChange={(e) => setSelectedRoomId(e.target.value)}
            disabled={isLoading || isError}
          >
            <option value="" disabled hidden>
              Select a room
            </option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </select>
          {renderFieldError('room_id')}
        </div>

        <div>
          <input
            type="date"
            className="input input-bordered w-full"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={isLoading || isError}
          />
          {renderFieldError('date')}
        </div>

        <div>
          <input
            type="time"
            className="input input-bordered w-full"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            disabled={isLoading || isError}
          />
          {renderFieldError('time')}
        </div>

        <button type="submit" className="btn btn-success w-full" disabled={isLoadingAddScrening || isLoadingEditScreening}>
        {(isEditMode ? (isLoadingEditScreening ? 'Editing...' : 'Edit') : (isLoadingAddScrening ? 'Adding...' : 'Add')) + ' Movie'}        </button>
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

export default AddScreening;
