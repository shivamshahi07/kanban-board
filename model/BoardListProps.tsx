interface BoardListProps {
  boards: { _id: string; name: string }[] | { boards: { _id: string; name: string }[] };
}
export default BoardListProps;
