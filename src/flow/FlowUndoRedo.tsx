import useUndoRedo from '@/hooks/useUndoRedo'
import { Redo, Undo } from 'lucide-react'
import { useEffect } from 'react'
import { Panel } from 'reactflow'

//FIXME: не обновляется

const FlowUndoRedo = () => {
	const { undo, redo, canUndo, canRedo, takeSnapshot } = useUndoRedo()

	useEffect(() => {
		console.log('snapshot into FlowUndoRedo')
	}, [undo, redo, takeSnapshot])

	return (
		<Panel
			position='bottom-center'
			className='w-[100px] flex justify-around z-50 gap-5 p-2 bg-white rounded-lg border border-solid-1 border-slate-300'
		>
			<>
				<button disabled={canUndo} onClick={undo}>
					<Undo color={!canUndo ? 'black' : '#e5e7eb'} />
				</button>
				<button disabled={canRedo} onClick={redo}>
					<Redo color={!canRedo ? 'black' : '#e5e7eb'} />
				</button>
			</>
		</Panel>
	)
}

export default FlowUndoRedo
