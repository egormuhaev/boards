import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  EdgeChange,
  Connection,
  ConnectionMode,
  ReactFlowInstance,
  useNodesState,
  useEdgesState,
  NodeChange,
} from "reactflow";
import {
  $boardPlayground,
  setIsMovementPlayground,
} from "./store/playground.slice";
import { useUnit } from "effector-react";
import FlowHeadToolbar from "./FlowHeadToolbar";
import {
  ControlPointData,
  EditableEdge,
} from "@/components/egdes/EditableEdge";
import { DEFAULT_ALGORITHM } from "@/components/egdes/EditableEdge/constants";
import { v4 } from "uuid";
import { ConnectionLine } from "@/components/egdes/ConectionLine";
import { DragEvent, MouseEvent, useCallback, useRef, useState } from "react";
import { NodeTypes } from "@/components";
import { getHelperLines } from "@/lib/utils";
import HelperLines from "@/components/HelperLines";
import useCopyPaste from "@/hooks/useCopyPaste";
import CanvasNode from "@/components/nodes/CanvasNode";
import RectangleNode from "@/components/nodes/RectangleNode";
import CircleNode from "@/components/nodes/CircleNode";
import TextNode from "@/components/nodes/TextNode";
import VideoNode from "@/components/nodes/VideoNode";
import FileNode from "@/components/nodes/FileNode";
import PictureNode from "@/components/nodes/PictureNode";
import PDFNode from "@/components/nodes/PDFNode";
import { EdgeTypes } from "@/components/egdes";
import { randomColor } from "./utils/randomColor";
import FlowUndoRedo from "./FlowUndoRedo";
import useUndoRedo from "@/hooks/useUndoRedo";

const nodeTypes = {
  [NodeTypes.CanvasNodeFlowTypes]: CanvasNode,
  [NodeTypes.RectangleNodeFlowTypes]: RectangleNode,
  [NodeTypes.CircleNodeFlowTypes]: CircleNode,
  [NodeTypes.TextNodeFlowTypes]: TextNode,
  [NodeTypes.VideoNodeFlowTypes]: VideoNode,
  [NodeTypes.FileNodeFlowTypes]: FileNode,
  [NodeTypes.PictureNodeFlowTypes]: PictureNode,
  [NodeTypes.PDFNodeFlowTypes]: PDFNode,
};

const edgeTypes = {
  [EdgeTypes.EditableEdgeFlowTypes]: EditableEdge,
};

const fileTypes: Record<string, NodeTypes> = {
  pdf: NodeTypes.PDFNodeFlowTypes,
  jpeg: NodeTypes.PictureNodeFlowTypes,
  jpg: NodeTypes.PictureNodeFlowTypes,
  png: NodeTypes.PictureNodeFlowTypes,
  mov: NodeTypes.VideoNodeFlowTypes,
  mp4: NodeTypes.VideoNodeFlowTypes,
  webm: NodeTypes.VideoNodeFlowTypes,
};

const defaultNodeData = {
  horizontalAlign: "center",
  verticalAlign: "center",
  textColor: "black",
  bgColor: "gray",
  fontSize: 14,
  rotation: 0,
};

const colorsPalet = [
  "8ecae6",
  "219ebc",
  "023047",
  "cdb4db",
  "ffc8dd",
  "ffafcc",
  "bde0fe",
  "a2d2ff",
  "ffbe0b",
  "fb5607",
  "ff006e",
  "8338ec",
  "3a86ff",
  "9b5de5",
  "f15bb5",
  "fee440",
  "00bbf9",
  "00f5d4",
];

//TODO: DnD файла

const FlowMonitor = () => {
  useCopyPaste();

  const playgroundState = useUnit($boardPlayground);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const { takeSnapshot } = useUndoRedo();
  const [creatingType, setCreatingType] = useState<NodeTypes | NodeTypes[]>();
  const [helperLineHorizontal, setHelperLineHorizontal] = useState<number>();
  const [helperLineVertical, setHelperLineVertical] = useState<number>();
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  const inputFileRef = useRef<HTMLInputElement>(null);

  const onCustomNodesChange = (changes: NodeChange[]) => {
    setHelperLineHorizontal(undefined);
    setHelperLineVertical(undefined);

    if (
      changes.length === 1 &&
      changes[0].type === "position" &&
      changes[0].dragging &&
      changes[0].position
    ) {
      const helperLines = getHelperLines(changes[0], nodes);

      changes[0].position.x =
        helperLines.snapPosition.x ?? changes[0].position.x;
      changes[0].position.y =
        helperLines.snapPosition.y ?? changes[0].position.y;

      setHelperLineHorizontal(helperLines.horizontal);
      setHelperLineVertical(helperLines.vertical);
    }

    onNodesChange(changes);
  };

  const onCustomEdgesChange = (changes: EdgeChange[]) => {
    onEdgesChange(changes);
  };

  const onDropNode = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();

      if (!reactFlowInstance) return;

      const type = e.dataTransfer.getData("application/reactflow");

      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      });

      const newNode = {
        id: v4(),
        type,
        position,
        data: {
          ...defaultNodeData,
          bgColor: randomColor(colorsPalet),
          textColor: randomColor(colorsPalet),
        },
      };

      takeSnapshot();

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, takeSnapshot, setNodes]
  );

  const onDropFiles = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      handleDragEvent(e);

      if (!reactFlowInstance) return;

      const files = e.dataTransfer.files;
      if (!files.length) return;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);

        const type: NodeTypes =
          fileTypes[fileExtension] ?? NodeTypes.FileNodeFlowTypes;

        const position = reactFlowInstance.screenToFlowPosition({
          x: e.clientX,
          y: e.clientY + i * 100,
        });

        const newNode = {
          id: v4(),
          data: { file },
          type,
          position,
        };

        setNodes((nds) => nds.concat(newNode));
      }
    },
    [reactFlowInstance]
  );

  //FIXME: при отмене выбора промис зависает, потому что не срабатывает функция onChange
  const selectFiles = (): Promise<FileList | null> => {
    return new Promise((resolve) => {
      if (inputFileRef.current) {
        inputFileRef.current.onchange = (event) => {
          const files = (event.target as HTMLInputElement).files;

          resolve(files);
        };
        inputFileRef.current.click();
      } else {
        resolve(null);
      }
    });
  };

  const onClickAddNode = useCallback(
    async (e: MouseEvent<HTMLDivElement>) => {
      // Нажатие кнопки в тулбаре задает тип добавляемой ноды, если типа нет, то ничего не происходит (обычный клик),
      // если тип есть, то происходит проверка является ли тип массивом типов, в случае успеха происходит выбор файла,
      // по расширению которого определяется тип ноды, если такое расширение не учтено, то добавится FileNode

      if (creatingType) {
        if (!reactFlowInstance) return;

        if (typeof creatingType === "undefined" || !creatingType) {
          return;
        }

        const position = reactFlowInstance.screenToFlowPosition({
          x: e.clientX,
          y: e.clientY,
        });

        if (Array.isArray(creatingType)) {
          const files = await selectFiles();

          if (!files?.length) {
            setCreatingType(undefined);
            return;
          }

          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileExtension = file.name.slice(
              file.name.lastIndexOf(".") + 1
            );

            const type =
              creatingType.find((t) => t === fileTypes[fileExtension]) ??
              NodeTypes.FileNodeFlowTypes;

            const newNode = {
              id: v4(),
              data: { file },
              type,
              position,
            };

            setNodes((nds) => nds.concat(newNode));
            setCreatingType(undefined);
            // Очищаем инпут, чтобы при выборе того же файла второй раз подряд вызывалось событие onChange
            if (inputFileRef.current) inputFileRef.current.value = "";
          }
        } else {
          const newNode = {
            id: v4(),
            type: creatingType,
            position,
            data: {
              ...defaultNodeData,
              bgColor: randomColor(colorsPalet),
              textColor: randomColor(colorsPalet),
            },
          };

          setNodes((nds) => nds.concat(newNode));
          setCreatingType(undefined);
        }
      }
    },
    [creatingType, nodes]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      const edge = {
        ...connection,
        id: `${v4()}-${connection.source}-${connection.target}`,
        type: "editableEdge",
        selected: true,
        data: {
          algorithm: DEFAULT_ALGORITHM,
          points: playgroundState.connectionLinePath.map(
            (point, i) =>
              ({
                ...point,
                data: {
                  lineColor: "#000",
                  lineWidth: 2,
                },
                id: v4(),
                prev:
                  i === 0
                    ? undefined
                    : playgroundState.connectionLinePath[i - 1],
                active: true,
              } as ControlPointData)
          ),
        },
      };
      takeSnapshot();
      setEdges((edges) => addEdge(edge, edges));
    },
    [setEdges, takeSnapshot]
  );

  const handleDragEvent = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onCustomDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();

      const files = e.dataTransfer.files;

      if (files.length) {
        onDropFiles(e);
      } else {
        onDropNode(e);
      }
    },
    [reactFlowInstance]
  );

  return (
    <>
      {/* Инпут находится снаружи, чтобы искусственный клик по нему не вызывал заново функцию onClick */}
      <input type="file" ref={inputFileRef} hidden />
      <ReactFlow
        onInit={setReactFlowInstance}
        onClick={onClickAddNode}
        onContextMenu={(e) => e.preventDefault()}
        onDrop={onCustomDrop}
        onConnect={onConnect}
        onDragOver={handleDragEvent}
        onDragEnter={handleDragEvent}
        onDragLeave={handleDragEvent}
        onNodesChange={onCustomNodesChange}
        onEdgesChange={onCustomEdgesChange}
        onMoveStart={() => setIsMovementPlayground(true)}
        onMoveEnd={() => setIsMovementPlayground(false)}
        selectionOnDrag
        edges={edges}
        nodes={nodes}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionMode={ConnectionMode.Loose}
        minZoom={0.1}
        maxZoom={500}
        connectionLineComponent={ConnectionLine}
      >
        <FlowUndoRedo />

        <FlowHeadToolbar setCreatingNodeType={setCreatingType} />
        <Background color="#ccc" variant={BackgroundVariant.Cross} size={1} />
        <Controls />

        <HelperLines
          horizontal={helperLineHorizontal}
          vertical={helperLineVertical}
        />

        <MiniMap nodeStrokeWidth={3} zoomable pannable />
      </ReactFlow>
    </>
  );
};

export default FlowMonitor;
