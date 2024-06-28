import FlowMonitor from "@/flow/FlowMonitor";
import { useParams } from "react-router-dom";

const Board = () => {
  const { id } = useParams();

  return <FlowMonitor boardId={id} />;
};

export default Board;
