import { createSlice } from '@reduxjs/toolkit';

function getWeekOfYear(date = new Date()) {
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);

  const firstThursday = new Date(target.getFullYear(), 0, 4);
  const firstThursdayDayNr = (firstThursday.getDay() + 6) % 7;

  const weekNumber = 1 + Math.round(((target - firstThursday) / 86400000 - 3 + firstThursdayDayNr) / 7);

  return weekNumber;
}


function getISODayNumber(jsDay) {
  return jsDay === 0 ? 7 : jsDay;
}

const movieSlice = createSlice({
  name: 'screening',
  initialState: {
    selectedMovie: null,
    selectedScreeningId: null,
    selectedTickets: [
      { type: 'Student', price: 2000, tickerNum: 0 },
      { type: 'Normal', price: 2500, tickerNum: 0 },
      { type: 'Senior', price: 1800, tickerNum: 0 }
    ],
    selectedSeats: [],
    selectedDay: getISODayNumber(new Date().getDay()),
    selectedWeek:getWeekOfYear()
  },
  reducers: {
    setSelectedMovie: (state, action) => {
      state.selectedMovie = action.payload;
      state.selectedScreeningId = null;
    },
    setSelectedScreening: (state, action) => {
      state.selectedScreeningId = action.payload;
      state.selectedSeats = [];
      state.selectedTickets.forEach(ticket => {
        ticket.tickerNum = 0;
      })
    },
    setDay: (state, action) => {
      state.selectedDay = action.payload;
    },
    setWeek: (state, action) => {
      state.selectedMovie = null;
      state.selectedWeek = action.payload;
    },
    setSelectedSeats: (state, action) => {
      state.selectedSeats = action.payload;
    },
    addSelectedSeat: (state, action) => {
    state.selectedSeats.push(action.payload);
  },

  removeSelectedSeat: (state, action) => {
    const seatIndex = state.selectedSeats.findIndex(
      seat => seat.row === action.payload.row && seat.seat === action.payload.seat
    );
    if (seatIndex !== -1) {
      state.selectedSeats.splice(seatIndex, 1);
    }
    },
    removeScreeningFromSelectedMovie: (state, action) => {
      const screeningIdToRemove = action.payload;
      if (state.selectedMovie && state.selectedMovie.screenings) {
        state.selectedMovie.screenings = state.selectedMovie.screenings.filter(
          screening => screening.id !== screeningIdToRemove
        );
      }
    },
    updateScreeningFromSelectedMovie: (state, action) => {
      const updatedScreening = action.payload; // Várhatóan teljes screening objektum, amely tartalmazza az `id`-t is
      if (state.selectedMovie && state.selectedMovie.screenings) {
        const index = state.selectedMovie.screenings.findIndex(s => s.id === updatedScreening.id);
        if (index !== -1) {
          state.selectedMovie.screenings[index] = updatedScreening;
        }
      }
    },
  updateTicketCount: (state, action) => {
    const { type, delta } = action.payload;
    const ticket = state.selectedTickets.find(t => t.type === type);
    if (ticket) {
      ticket.tickerNum = Math.max(0, ticket.tickerNum + delta);
    }
  },
  bookSelectedSeats: (state, action) => {
    const selectedScreening = state.selectedMovie.screenings.find(x => x.id === state.selectedScreeningId);
    const seats = action.payload;
      
      seats.forEach(s => {
        selectedScreening.bookings.push({ row: s.row + 1, seat: s.seat + 1 });
      });

      state.selectedTickets.forEach(t => t.tickerNum = 0);
      state.selectedSeats = [];
  }
  },
});

// Reducer
export default movieSlice.reducer;

// Actions
export const { 
  setSelectedMovie, 
  setSelectedScreening, 
  setDay, 
  setWeek,
  setSelectedSeats, 
  addSelectedSeat, 
  removeSelectedSeat,
  updateTicketCount,
  bookSelectedSeats,
  removeScreeningFromSelectedMovie,
  updateScreeningFromSelectedMovie
} = movieSlice.actions;

// Selectors
export const selectSeats = (state) => state.movieScreening.selectedSeats;

export const selectSelectedMovie = (state) => state.movieScreening.selectedMovie;

export const selectSelectedScreening = (state) => {
  const selectedScreeningId = state.movieScreening.selectedScreeningId;
  const selectedMovie = selectSelectedMovie(state);
  if (selectedMovie) {
    return selectedMovie.screenings.find(screening => screening.id === selectedScreeningId);
  }
  return null;
};

export const selectSelectedScreeningId = (state) => state.movieScreening.selectedScreeningId;

export const selectSelectedDay = (state) => state.movieScreening.selectedDay;

export const selectSelectedWeek = (state) => state.movieScreening.selectedWeek;

export const selectSelectedTickets = (state) => state.movieScreening.selectedTickets;

export const selectMaxSeatsToPick = (state) => {
  return state.movieScreening.selectedTickets.reduce((sum, t) => sum + t.tickerNum, 0);
};
