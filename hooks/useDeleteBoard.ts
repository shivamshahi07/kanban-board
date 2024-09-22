import Board from "@/model/Board";
import { deleteBoardApi } from "@/services/apiBoards";
import { setActiveBoard, setActiveModal } from "@/store/uiSlice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

export const useDeleteBoard = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { isLoading: isDeleting, mutate: deleteBoard } = useMutation({
    mutationFn: (id: string) => deleteBoardApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      dispatch(setActiveModal(undefined));
      const data = queryClient.getQueryData(["boards"]) as Board[] | undefined;
      if (data && data.length > 0) {
        dispatch(setActiveBoard(0));
      } else {
        // Handle case when no boards are left
        dispatch(setActiveBoard(-1)); // or any other appropriate action
      }
    },
    onError: (error) => {
      console.error('Error deleting board:', error);
      // Handle error (e.g., show error message to user)
    },
  });
  return { isDeleting, deleteBoard };
};