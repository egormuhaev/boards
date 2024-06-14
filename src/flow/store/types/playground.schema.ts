import { nodeTypes } from '@/components/nodes'
import { ShapeComponents } from '@/components/nodes/shapeNode/ShapeNode'
import { Edge, XYPosition } from 'reactflow'

export type TextAlign = 'center' | 'left' | 'right'
export type AlignContent = 'start' | 'center' | 'end'

export interface ICreateNewNodeBuffer {
	nodeType?: keyof typeof nodeTypes
	subType?: keyof typeof ShapeComponents
}

export interface IReactFlowSliceSchema {
	edges: Edge[]
	buffer: ICreateNewNodeBuffer | null
	connectionLinePath: XYPosition[]
	isMovementPlayground: boolean
	theme: string
}
