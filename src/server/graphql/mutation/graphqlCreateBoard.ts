// import { useEffect } from "react";
// import { useReactFlow } from "reactflow";
// import { useMutation, gql } from "@apollo/client";

// const CREATE_BOARD = gql`
//   mutation CREATE_BOARD($data: BoardCreateInput!) {
//     createBoard(data: $data) {
//       name
//       id
//     }
//   }
// `;

// export function graphqlCreateBoard(boardName?: string) {
//   //   const [createBoard] = useMutation(CREATE_BOARD, {
//   //     variables: {
//   //       data: {
//   //         name: boardName,
//   //       },
//   //     },
//   //   });
//   //   const [
//   //     createBoard,
//   //     {
//   //       loading: loadingCreateBoard,
//   //       error: errorCreateBoard,
//   //       data: dataCreateBoard,
//   //     },
//   //   ] = useMutation(CREATE_BOARD, {
//   //     variables: {
//   //       data: {
//   //         name: boardName,
//   //       },
//   //     },
//   //   });
//   //   useEffect(() => {
//   //     if (!loadingCreateBoard && !errorCreateBoard) {
//   //       createBoard({
//   //         variables: {
//   //           data: {
//   //             name: boardName,
//   //           },
//   //         },
//   //       });
//   //     }
//   //     async () => {
//   //       try {
//   //         console.log("asdfasd");
//   //         await createBoard();
//   //       } catch {
//   //         // setFoundErrors(true);
//   //       }
//   //     };
//   //     newBoard();
//   //   });
//   // }, [loadingCreateBoard, errorCreateBoard, dataCreateBoard]);
//   // createBoard();
//   // useEffect(() => {
//   //   if (!loadingCreateBoard && !errorCreateBoard) {
//   //     createBoard({
//   //       variables: {
//   //         "data": {
//   //           "name": boardName
//   //         }
//   //       }
//   //     })
//   //   }
//   //   async () => {
//   //     try {
//   //       await createBoard({
//   //         variables: {
//   //           "data": {
//   //             "name": boardName
//   //           }
//   //         }
//   //       })
//   //     } catch {
//   //       // setFoundErrors(true);
//   //     }
//   //   }
//   //   newBoard();
//   // }, [loadingCreateBoard, errorCreateBoard, dataCreateBoard]);
//   // const {
//   //   loading: loadingGetEdges,
//   //   error: errorGetEdges,
//   //   data: dataGetEdges,
//   // } = useQuery(GET_EDGES, {
//   //   variables: {
//   //     id: boardId,
//   //   },
//   // });
//   // const { setEdges } = useReactFlow();
//   // useEffect(() => {
//   //   if (!loadingGetEdges && !errorGetEdges) {
//   //     setEdges(
//   //       dataGetEdges.edges.map((item: any) => {
//   //         return { ...item.data };
//   //       }),
//   //     );
//   //   }
//   // }, [loadingCreateBoard, errorCreateBoard, dataCreateBoard]);
// }
