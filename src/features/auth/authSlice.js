import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";

export const fetchCountries = createAsyncThunk(
  "auth/fetchCountries",
  async () => {
    try {
      const res = await axios.get(
        "https://restcountries.com/v3.1/all?fields=name,idd,flags,cca2"
      );
      const data = res.data;
      const countries = data
        .map((country) => {
          const dialCodes = country.idd?.root
            ? [country.idd.root + (country.idd.suffixes?.[0] ?? "")]
            : [];
          return {
            name: country.name.common,
            code: country.cca2,
            dialCodes: dialCodes[0] || "",
            flag: country.flags?.svg || "",
          };
        })
        .filter((c) => c.dialCode !== "");
      countries.sort((a, b) => a.name.localeCompare(b.name));

      // toast.success(" countries  Loaded successfully");
      return countries;
    } catch (error) {
      toast.error("Failed loading countries");

      return rejectWithValue(
        error.message || { message: "Failed loading countries" }
      );
    }
  }
);

const LOCAL_STORAGE_KEY = "auth_user_data";

// Load auth state from localStorage if available
const loadFromLocalStorage = () => {
  try {
    const serializedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!serializedData) return { isLoggedIn: false, user: null };
    return JSON.parse(serializedData);
  } catch (e) {
    console.error("Failed to load auth state from localStorage", e);
    return { isLoggedIn: false, user: null };
  }
};

// Save auth state to localStorage
const saveToLocalStorage = (state) => {
  try {
    const serializedData = JSON.stringify(state);
    localStorage.setItem(LOCAL_STORAGE_KEY, serializedData);
  } catch (e) {
    console.error("Failed to save auth state to localStorage", e);
  }
};

// const initialState = loadFromLocalStorage();

const authSlice = createSlice({
  name: "auth",
  initialState: {
    userData: loadFromLocalStorage(),
    countries: [],
    loadingLogout: false,
    loadingCountries: false,
    errorCountries: null,
  },
  reducers: {
    login(state, action) {
      state.userData = {
        user: action.payload,
        isLoggedIn: true,
      };
      saveToLocalStorage(state.userData);
    },
    logout(state) {
      state.userData = null;
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      toast.success("User logged out");
    },
    setLoadingLogout(state, action) {
      state.loadingLogout = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountries.pending, (state) => {
        state.loadingCountries = true;
        state.errorCountries = null;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.loadingCountries = false;
        state.countries = action.payload;
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.loadingCountries = false;
        state.errorCountries = action.error.message;
      });
  },
});

export const { login, logout, setLoadingLogout } = authSlice.actions;
export default authSlice.reducer;
