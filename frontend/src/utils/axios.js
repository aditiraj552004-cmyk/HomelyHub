import axios from "axios";
import qs from "qs";

const configuredBaseURL = import.meta.env.VITE_API_BASE_URL;
const baseURL =
  import.meta.env.PROD && configuredBaseURL?.startsWith("/")
    ? "https://homelyhub-sprw.onrender.com/api"
    : configuredBaseURL || "/api";

export const axiosInstance =
  axios.create({
    baseURL,

    withCredentials: true,

    paramsSerializer: {
      serialize: (params) =>
        qs.stringify(params, {
          arrayFormat: "repeat",
        }),
    },
  });
