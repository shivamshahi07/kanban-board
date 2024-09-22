import { useDispatch, useSelector } from "react-redux";
import Button from "../components/UI/Button";
import LogoDarkIcon from "@/icons/logo-dark.svg";
import LogoLightIcon from "@/icons/logo-light.svg";
import LogoMobileIcon from "@/icons/logo-mobile.svg";
import ChevronDownIcon from "@/icons/icon-chevron-down.svg";
import AddIcon from "@/icons/icon-add-task-mobile.svg";
import Dropdown from "@/components/UI/Dropdown";
import { selectBoard, setActiveModal } from "@/store/uiSlice";
import ModalEnum from "@/model/ModalEnum";
import { useQuery } from "@tanstack/react-query";
import Board from "@/model/Board";
import { Kanban, Sparkles, Table2, Table2Icon } from "lucide-react";
interface HeaderProps {
  isListView: boolean;
  toggleView: () => void;
}
const Header: React.FC<HeaderProps> = ({ isListView, toggleView }) => {
  const dispatch = useDispatch();
  const { data } = useQuery<{ boards: Board[] }>({ queryKey: ["boards"] });
  const activeBoard = useSelector(selectBoard);
  const isDisables =
    data?.boards?.length === 0 ||
    data?.boards?.[activeBoard]?.columns.length === 0;
  return (
    <div className="flex  items-center justify-between  ">
      {/* Desktop Header */}
      <div className="sm:flex  items-center justify-between  w-full hidden">
        <div className="px-8 py-8   w-[260px] md:w-[300px] ">
          {/* <LogoDarkIcon className="dark:hidden " />
          <LogoLightIcon className="dark:block hidden" /> */}
          <div className="text-primary1 text-3xl font-bold tracking-wide flex items-center ">
            <Kanban />
            <span>Kanban Board</span>
          </div>
        </div>
        <button
          onClick={toggleView}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          {isListView ? (
            <span className="flex items-center hover:text-secondary1 text-primary1">
              <Kanban /> Switch to Board View
            </span>
          ) : (
            <span className="flex items-center hover:text-secondary2 text-primary1">
              <Table2Icon /> Switch to List View
            </span>
          )}
        </button>
        <div className="px-7  flex flex-1 items-center justify-between  ">
          <h1 className="text-2xl md:text-3xl flex items-center">
           {isListView ? "Observe Tasks through List View" : "Customize Your Kanban Board"} <Sparkles className="text-primary1" />
          </h1>
          <div className="flex items-center gap-6">
            <Button
              label="+ Add New Task"
              type="primary large"
              disabled={isDisables}
              onClick={() => dispatch(setActiveModal(ModalEnum.CREATE_TASK))}
            />
            <Dropdown
              disable={data?.boards.length === 0}
              items={[
                {
                  label: "Edit Board",
                  onClick: () => dispatch(setActiveModal(ModalEnum.EDIT_BOARD)),
                  className: "text-gray3",
                },
                {
                  label: "Delete Board",
                  onClick: () =>
                    dispatch(setActiveModal(ModalEnum.DELETE_BOARD)),
                  className: "text-destructive2",
                },
              ]}
            />
          </div>
        </div>
      </div>
      {/* Mobile Header */}
      <div className="sm:hidden  items-center justify-between  w-full flex px-4 py-5">
        <div
          className="flex"
          onClick={() => dispatch(setActiveModal(ModalEnum.MOBILE_MENU))}
        >
          <LogoMobileIcon className="mr-4" />
          <div className="flex items-center gap-x-2">
            <h2 className="">{data?.boards?.[activeBoard]?.name}</h2>
            <ChevronDownIcon />
          </div>
        </div>
        <div className="flex items-center gap-x-4">
          <button
            className={`bg-primary2 py-4 px-6 rounded-full ${
              isDisables ? "opacity-25 cursor-not-allowed" : ""
            }`}
            onClick={() => {
              dispatch(setActiveModal(ModalEnum.CREATE_TASK));
            }}
            disabled={isDisables}
          >
            <AddIcon />
          </button>
          <Dropdown
            disable={data?.boards.length === 0}
            items={[
              {
                label: "Edit Board",
                onClick: () => dispatch(setActiveModal(ModalEnum.EDIT_BOARD)),
                className: "text-gray3",
              },
              {
                label: "Delete Board",
                onClick: () => dispatch(setActiveModal(ModalEnum.DELETE_BOARD)),
                className: "text-destructive2",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
