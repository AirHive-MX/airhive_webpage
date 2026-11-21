import EntradaAlmacen from "../../Components/EntradaAlmacen/EntradaAlmacen";

/**
 * El home es la historia del dron entrando al almacén: la fachada de noche, el
 * giro, el pasillo con obstáculos, el conteo frente al rack, el WMS con su
 * agente de IA, el resultado y el llamado al diagnóstico.
 *
 * El recorrido anterior (DroneShowcase.jsx: giro, despegue, conteo y ruta sobre
 * fondo fijo) se borró junto con los componentes que ya no se montaban; vive
 * en el historial de git. De su carpeta quedan droneTrack.js y WmsCards.jsx,
 * que usa EntradaAlmacen.
 */
const Home = () => <EntradaAlmacen />;

export default Home;
