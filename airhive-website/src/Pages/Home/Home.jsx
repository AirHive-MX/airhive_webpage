import EntradaAlmacen from "../../Components/EntradaAlmacen/EntradaAlmacen";

/**
 * El home es la historia del dron entrando al almacén: la fachada de noche, el
 * giro, el pasillo con obstáculos, el conteo frente al rack, el WMS con su
 * agente de IA, el resultado y el llamado al diagnóstico.
 *
 * El recorrido anterior (giro, despegue, conteo y ruta sobre fondo fijo) sigue
 * en Components/DroneShowcase/: para recuperarlo basta con volver a ponerlo
 * aquí en lugar de EntradaAlmacen.
 */
const Home = () => <EntradaAlmacen />;

export default Home;
