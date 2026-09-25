import DroneShowcase from "../../Components/DroneShowcase/DroneShowcase";
import WmsHandoff from "../../Components/WmsHandoff/WmsHandoff";

/**
 * El home es un recorrido de scroll en dos actos: primero el dron (giro,
 * despegue, conteo y ruta) y después lo que pasa con esos datos en el WMS.
 * El resto del sitio sigue existiendo y se llega por el navbar.
 */
// Sin padding arriba: la sección mide 100vh y con sticky top-0 queda encuadrada
// desde el primer píxel. El navbar es fijo y opaco, así que se monta encima sin
// tapar nada (el showcase ya reserva 84px para él).
const Home = () => (
  <main>
    <DroneShowcase />
    <WmsHandoff />
  </main>
);

export default Home;
