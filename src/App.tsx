import { useEffect, useState } from 'react';
import './App.css';

type  Tablero = ( "O" | "X" | "")[]
type  Jugador = ( "O" | "X")

function App() {
  const [jugadorActual, setJugadorActual] = useState<Jugador>("O")
  const [tablero, setTablero] = useState<Tablero>(
    [
      "", "", "",
      "", "", "",
      "", "", "",
    ]
  )
  const [juegoTerminado, setjuegoTerminado] = useState<boolean>(false)
  const [hayGanador, setHayGanador] = useState<boolean>(false)
  

  interface ClickEvent extends React.MouseEvent<HTMLDivElement> {
    target: HTMLDivElement & EventTarget;
  }

  const handleClickCoordeanda = (e: ClickEvent) => {
    e.preventDefault();
    // Si el juego ya terminó o la celda ya está ocupada, no hacemos nada
    if (juegoTerminado || tablero[parseInt(e.target.id)] !== "") {
      return;
    }
    setJugadorActual(jugadorActual === "O" ? "X" : "O");
    // Obtenga la coordenada desde el id del elemento (e.target.id)
    const coordenada = parseInt(e.target.id)
    // Copio el tablero actual
    const tableroNuevo = [...tablero];
    // Agrego el símbolo del jugador a la coordenada donde hizo click
    tableroNuevo[coordenada] = jugadorActual;
    setTablero(tableroNuevo);
    // Cambio el jugador después de actualizar el tablero
    setJugadorActual(jugadorActual === "O" ? "X" : "O");
  };




  // Creo un useEffect para observar y reaccionar cada vez que cambie el tablero chequeando si hay un ganador o el juego terminó
  useEffect(() => {
    const unJugadorGano = (): boolean => {
      // Revisa las columnas
      for(let i=0; i<= 2; i++) {
        if (tablero[i] !== "" && tablero[i] === tablero[i+3] && tablero[i] === tablero[i+6]) {
          return true
        }
      }

      // Revisa las filas
      for(let i=0; i<= 6; i++) {
        if (tablero[i] !== "" && tablero[i] === tablero[i+1] && tablero[i] === tablero[i+2]) {
          return true
        }
      }

      // Revisa la primer diagonal
      if (tablero[0] !== "" && tablero[0] === tablero[4] && tablero[0] === tablero[8]) {
        return true
      }
      
      // Revisa la segunda diagonal
      if (tablero[2] !== "" && tablero[2] === tablero[4] && tablero[2] === tablero[6]) {
        return true
      }

      return false
    };

    const gano = unJugadorGano();
    if (gano) {
      setHayGanador(true);
      setjuegoTerminado(true);
      return;
    }

    // Filtro el tablero usando método some, si hay al menos un "" quiere decir que hay movimientos, devolviendo verdadero
    const quedanMovimientos: boolean = tablero.some(celda => celda === "");
    // Si no quedan movimientos terminamos el juego
    if (!quedanMovimientos) {
      setjuegoTerminado(true)
    }
  }, [tablero])




  return (
    <div className="app">
      {
        juegoTerminado ? (
          <h1>
            {hayGanador 
              ? `El ganador es ${jugadorActual === "X" ? "O" : "X"}!!`
              : "¡Empate!"}
          </h1>
        ) : (
          <h1>Jugador Actual: {jugadorActual}</h1>
        )
      }
      <div className='contendor-principal'>
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
            <div key={idx} id={idx.toString()} className='celda' onClick={handleClickCoordeanda}>
              {tablero[idx]}
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default App;
