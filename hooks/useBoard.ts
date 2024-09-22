import Board from "@/model/Board";
import { getBoards } from "@/services/apiBoards";
import { useQuery } from "@tanstack/react-query";

export const useBoard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["boards"],
    queryFn: getBoards,
  });
  console.log("useBoard data:", data);
  const boards = Array.isArray(data) ? data : data?.boards || [];
  console.log("useBoard boards:", boards);
  return { boards, isLoading, error };
};
