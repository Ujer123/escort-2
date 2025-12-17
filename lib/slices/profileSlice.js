import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching profiles list
export const fetchProfiles = createAsyncThunk(
  'profile/fetchProfiles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/services');
      if (!response.ok) {
        throw new Error('Failed to fetch profiles');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching favorites
export const fetchFavorites = createAsyncThunk(
  'profile/fetchFavorites',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch('/api/favorites', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          return data.map(fav => fav.service);
        }
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
    // Fallback to localStorage
    const savedFavs = JSON.parse(localStorage.getItem('favorites') || '[]');
    return savedFavs;
  }
);

// Async thunk for toggling favorite (authenticated)
export const toggleFavorite = createAsyncThunk(
  'profile/toggleFavorite',
  async ({ serviceId }, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ serviceId })
      });
      if (response.ok) {
        const data = await response.json();
        return data.map(fav => fav.service);
      } else {
        throw new Error('Failed to toggle favorite');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching a single profile
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/profiles/${slug}`);
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    profiles: [],
    favorites: [],
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearProfile: (state) => {
      state.data = null;
      state.error = null;
    },
    toggleFavoriteLocal: (state, action) => {
      const profile = action.payload;
      const isFav = state.favorites.find(fav => fav._id === profile._id || fav.phone === profile.phone);
      if (isFav) {
        state.favorites = state.favorites.filter(fav => fav._id !== profile._id && fav.phone !== profile.phone);
      } else {
        state.favorites.push(profile);
        localStorage.setItem('favorites', JSON.stringify(state.favorites));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfiles.fulfilled, (state, action) => {
        state.loading = false;
        state.profiles = action.payload;
      })
      .addCase(fetchProfiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchFavorites.pending, (state) => {
        // Optionally set loading for favorites
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        // Handle error, perhaps fallback
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        state.favorites = action.payload;
      })
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProfile, toggleFavoriteLocal } = profileSlice.actions;
export default profileSlice.reducer;
