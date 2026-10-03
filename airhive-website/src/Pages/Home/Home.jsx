import DroneShowcase from "../../Components/DroneShowcase/DroneShowcase";

/**
 * El home es el recorrido de scroll del dron: giro, despegue, conteo y ruta.
 *
 * Después iba una sección con la captura del WMS; se desmontó porque va a
 * sustituirse por completo. El componente sigue en
 * Components/WmsHandoff/ junto con su imagen y sus textos: para recuperarlo
 * basta con volver a importarlo y ponerlo aquí debajo.
 */
// Sin padding arriba: la sección mide 100vh y con sticky top-0 queda encuadrada
// desde el primer píxel. El navbar es fijo y opaco, así que se monta encima sin
// tapar nada (el showcase ya reserva 84px para él).
const Home = () => (
  <main>
    <DroneShowcase />
  </main>
);

export default Home;
