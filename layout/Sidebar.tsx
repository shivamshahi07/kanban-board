import BoardsList from "@/components/BoardsList";
import ToggleTheme from "@/components/ToggleTheme";
import { useBoard } from "@/hooks/useBoard";
import HideIcon from "@/icons/icon-hide.svg";
import ShowIcon from "@/icons/icon-show-sidebar.svg";
import { useDispatch } from "react-redux";
import { selectSidebar, toggleSidebar } from "@/store/uiSlice";
import { useSelector } from "react-redux";
const Sidebar = () => {
  const { boards, isLoading, error } = useBoard();
  const dispatch = useDispatch();
  const sidebarIsOpen = useSelector(selectSidebar);
  return (
    <div className="w-[260px]  md:w-[300px]  fixed  hidden sm:inline-block ">
      <BoardsList boards={boards} />
      <div className=" bottom-12 w-full px-8 space-y-4">
        <div className="mt-10">

        <ToggleTheme />
        </div>
        <div
          className=" text-gray3 flex items-center gap-x-4 mx-auto ml-10  cursor-pointer hover:text-opacity-20"
          onClick={() => dispatch(toggleSidebar())}
        >
          <HideIcon className="mt-20"/>
          <h3 className="mt-20">Hide Sidebar</h3>
        </div>
      </div>
      {!sidebarIsOpen && (
        <div
          className="fixed bottom-9 bg-primary2  px-5 py-4 rounded-r-full cursor-pointer hover:bg-primary1 transition left-0"
          onClick={() => dispatch(toggleSidebar())}
        >
          <ShowIcon />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
