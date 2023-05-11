
import { useRef, useState, useEffect, useReducer } from "react"

const ballReducer = (state, action) => {
	switch (action.type) {
		case "UPDT_Y":
			return ({
				...state,
				y: action.y
			})
		case "FALL":
			return ({
				...state,
				y: state.y + action.dy,
				isFalling: true
			})
		case "MOVE":
			if (state.isFalling) return state
			return ({
				...state,
				x: state.x + action.dx
			})
		case "STOP_FALL":
			if (state.y < action.y - state.r) return state
			return ({
				...state,
				isFalling: false,
				id: state.id + 1
			})
		case "FINISH":
			return ({
				...state,
				isOver: true
			})
		default:
			return state
	}
}

export default function BallGame({ onGameOver, speed, width=500, height=800, 
	gap=30, fSpacing=60, nFloors=20, ballR=20}) {

	const [floors, setFloors] = useState(createFloors)

	const [ball, dispatch] = useReducer(ballReducer, {
		x: width/2, 
		y: floors.at(5).pos - ballR,
		id: 5,
		r: ballR,
		isFalling: false,
		isOver: false
	})

	const controls = useRef(function(e) {
			if (e.key === "ArrowLeft") dispatch({type:"MOVE", dx:-10})
			if (e.key === "ArrowRight") dispatch({type:"MOVE", dx:10})
		})

	useEffect(() => {
		requestAnimationFrame(animate)
		addEventListener("keydown", controls.current)
	}, [])

	useEffect(() => {
		let floor = floors.at(ball.id)
		let li = floor.width1 
		let ld = floor.width1 + gap - ball.r

		if (ball.isOver) {
			ball.y <= 0 ? onGameOver(false) : onGameOver(true)
			removeEventListener("keydown", controls.current)
			return
		}
		
		if ((ball.x > li && ball.x < ld) || ball.isFalling) {
			dispatch({type:"FALL", dy: 2})
			if (floors.length > ball.id + 1) {
				dispatch({type:"STOP_FALL", y: floors.at(ball.id + 1).pos})
			} 
			else if (ball.y >= height - 2 * ball.r) dispatch({type:"FINISH"})
		}
		else dispatch({ type:"UPDT_Y", y: floor.pos - ball.r})

		if (ball.y <= 0) dispatch({type:"FINISH"})

		requestAnimationFrame(animate)

	}, [floors])

	function animate() {
		setFloors(prevState => prevState.map(item => ({...item, pos: item.pos - speed})))	
	}

	function createFloors() {
		return (
			Array(nFloors).fill(1).map((val, id)=> {
				let fWidth = Math.random()
				return ({
					width1: (fWidth * (width - gap)),
					width2: (1 - fWidth) * (width - gap),
					pos: id * fSpacing
				})
			})
		)
	}

	return (
		<div 
			className="ballgame" 
			style={{width: width, height: height}}>
			{floors.map((floor, id)=>{
				return (
					<div 
						key={id} 
						className="ballgame-floor" 
						style={{top: floor.pos, gap: gap}}>
						<div style={{width: floor.width1}}></div>
						<div style={{width: floor.width2}}></div>
					</div>					
				)
			})}
			<span 
				className="ballgame-ball"
				style={{
					top: ball.y, 
					left: ball.x,
					padding: ballR / 2
				}}>
			</span>
		</div>
	)
}

