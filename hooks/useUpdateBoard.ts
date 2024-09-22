import Board from "@/model/Board";
import ModalEnum from "@/model/ModalEnum";
import { updateBoardApi } from "@/services/apiBoards";
import { selectModal, setActiveModal } from "@/store/uiSlice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";

export const useUpdateBoard = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const activeModal = useSelector(selectModal);
  const { mutate: updateBoard, isLoading: isUpdating } = useMutation({
    mutationFn: ({ id, board }: { id: string; board: Board }) =>
      updateBoardApi(id, board),
    onSuccess: (updatedBoard) => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      //do not close modal if viewing task.
      if (activeModal !== ModalEnum.VIEW_TASK) {
        dispatch(setActiveModal(undefined));
      }
    },
    onError: (error) => {
      console.error('Error updating board:', error);
      // Handle error (e.g., show error message to user)
    },
  });
  return { isUpdating, updateBoard };
};