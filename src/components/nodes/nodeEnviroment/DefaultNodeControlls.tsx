// import { Handle, Position, NodeResizer, NodeToolbar } from "reactflow";
// import ToolbarControlls,  from "./ToolbarControlls";
// import { memo } from "react";

// interface Props extends Settings {
//   id: string;
//   children: React.ReactNode;
//   isSelect: boolean;
//   isDrawMode: boolean;
// }

// const DefaultNodeControlls = ({
//   id,
//   children,
//   isSelect,
// }: Props) => {
//   return (
//     <>
//       <NodeToolbar isVisible={isSelect} position={Position.Top}>
//         <ToolbarControlls
//           id={id}

//         />
//       </NodeToolbar>

//       <NodeResizer
//         isVisible={isSelect}
//         minWidth={180}
//         minHeight={68}
//         keepAspectRatio
//       />

//       <Handle type="source" position={Position.Top} id={"1"} />
//       <Handle type="source" position={Position.Bottom} id={"2"} />
//       <Handle type="source" position={Position.Left} id={"3"} />
//       <Handle type="source" position={Position.Right} id={"4"} />

//       {children}
//     </>
//   );
// };

// export default memo(DefaultNodeControlls);
