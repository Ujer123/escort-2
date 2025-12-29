import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

// Async thunk for fetching profiles list with caching
export const fetchProfiles = createAsyncThunk(
  'profile/fetchProfiles',
  async (_, { getState, rejectWithValue }) => {
    const state = getState().profile;
    const now = Date.now();
    
    // Return cached data if valid
    if (state.profiles.length > 0 && state.lastFetch && (now - state.lastFetch) < CACHE_DURATION) {
      return { profiles: state.profiles, cached: true };
    }
    
    try {
      const response = await fetch('/api/services');
      if (!response.ok) {
        throw new Error('Failed to fetch profiles');
      }
      const data = await response.json();
      return { profiles: data, cached: false };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching favorites
export const fetchFavorites = createAsyncThunk(
  'profile/fetchFavorites',
  async (_, { getState, rejectWithValue }) => {
    const state = getState().profile;
    const now = Date.now();
    
    // Return cached data if valid
    if (state.favorites.length > 0 && state.lastFetchFavorites && (now - state.lastFetchFavorites) < CACHE_DURATION) {
      return { favorites: state.favorites, cached: true };
    }
    
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      try {
        const response = await fetch('/api/favorites', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          return { favorites: data.map(fav => fav.service), cached: false };
        }
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
    // Fallback to localStorage (client only)
    if (typeof window !== 'undefined') {
      const savedFavs = JSON.parse(localStorage.getItem('favorites') || '[]');
      return { favorites: savedFavs, cached: false };
    }
    return { favorites: [], cached: false };
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

// Async thunk for fetching a single profile with caching
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (slug, { getState, rejectWithValue }) => {
    const state = getState().profile;
    
    // Check cache first
    const cached = state.profileCache[slug];
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      return { profile: cached.data, slug, cached: true };
    }
    
    try {
      const response = await fetch(`/api/profiles/${slug}`);
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      const data = await response.json();
      return { profile: data, slug, cached: false };
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
    profileCache: {}, // Cache individual profiles by slug
    favoritesLoading: true, // Initial loading for favorites to match server render
    loading: false,
    error: null,
    lastFetch: null, // Timestamp of last profiles fetch
    lastFetchFavorites: null, // Timestamp of last favorites fetch
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
    invalidateProfilesCache: (state) => {
      state.lastFetch = null;
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
        if (!action.payload.cached) {
          state.profiles = action.payload.profiles;
          state.lastFetch = Date.now();
        }
      })
      .addCase(fetchProfiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchFavorites.pending, (state) => {
        state.favoritesLoading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.favoritesLoading = false;
        state.favorites = action.payload.favorites;
        if (!action.payload.cached) {
          state.lastFetchFavorites = Date.now();
        }
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.favoritesLoading = false;
        state.error = action.payload;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        state.favorites = action.payload;
        state.lastFetchFavorites = Date.now(); // Invalidate cache on toggle
      })
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.profile;
        if (!action.payload.cached) {
          // Update cache
          state.profileCache[action.payload.slug] = {
            data: action.payload.profile,
            timestamp: Date.now()
          };
        }
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProfile, toggleFavoriteLocal, invalidateProfilesCache } = profileSlice.actions;
export default profileSlice.reducer;
