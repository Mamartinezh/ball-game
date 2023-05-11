
import BallGame from "./components/BallGame"
import { useState, useRef, useReducer, useEffect } from "react"

const gameReducer = (state, action) => {
	switch (action.type) {
		case "SUCCESS":
			return ({
				...state,
				lvlCompleted: true
			})
		case "FAIL":
			return ({
				...state,
				gameOver: true
			})
		case "RESET":
			return ({
				...state,
				gameOver: false,
				key: state.key + 1
			})
		case "NEXT_LVL":
			return ({
				...state,
				lvlCompleted: false,
				lvl: state.lvl + 1,
				key: state.key + 1,
				speed: state.speed + 0.1
			})				
	}
}

const initConf = {
	width: 500,
	height: 800,

}

export default function App() {

	const [ gameConf, setGameConf ] = useState(initConf)
	const [ gameData, dispatch ] = useReducer(gameReducer, {
		gameOver: false,
		lvlCompleted: false,
		lvl: 1,
		key: 0,
		speed: 0.3
	})

	useEffect(()=>{
		addEventListener('resize', onResize)
		return ()=> removeEventListener('resize', onResize)
	}, [])


	function onResize() {
		let conf = {...initConf}
		if (window.innerWidth<500) {
			conf.width = window.innerWidth
		}
		if (window.innerHeight<800) {
			conf.height = window.innerHeight
		}	
		setGameConf(conf)
	}

	function setNewGame(success) {
		if (success) dispatch({type:"SUCCESS"})
		if (!success) dispatch({type:"FAIL"})
	}

	return (
		<>
			<div key={gameData.key} className="ballgame-container">
				<BallGame onGameOver={setNewGame} speed={gameData.speed} {...gameConf}/>
			</div>
			{gameData.gameOver && 			
				<div className={`gameover`}>
					<h2>GAME OVER!</h2>
					<span 
						className="reset" 
						onClick={e => dispatch({type:"RESET"})}>
					Try Again</span>
				</div>}
			{gameData.lvlCompleted && 
				<div className={`gameover`}>
					<h2>LEVEL {gameData.lvl} COMPLETED!</h2>
					<span 
						className="reset" 
						onClick={e => dispatch({type:"NEXT_LVL"})}>
					Next Level</span>
				</div>
			}
		</>
	)
}