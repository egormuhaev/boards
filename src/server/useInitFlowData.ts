import { graphqlGetEdgesByBoardId } from "./graphql/query/graphqlGetEdgesByBoardId";
import { graphqlGetViewportByBoardId } from "./graphql/query/graphqlGetViewportByBoardId";
import { graphqlGetNodesByBoardId } from "./graphql/query/graphqlGetNodesByBoardId";
import { useUnit } from "effector-react";
import { $flow } from "@/flow/store/flow.slice";

export default function useInitFlowData() {
  const { targetBoard } = useUnit($flow);
  graphqlGetEdgesByBoardId(targetBoard);
  graphqlGetViewportByBoardId(targetBoard);
  graphqlGetNodesByBoardId(targetBoard);
}
