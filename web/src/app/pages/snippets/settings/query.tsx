import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetApiKey = () => {
  return useQuery({
    queryKey: ["get_api_key"],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/get-api-key`);
        console.log(res);
        return res.data.data;
      } catch (error) {
        return null;
      }
    },
  });
};
