import DroneShowcase from "../../Components/DroneShowcase/DroneShowcase";

/**
 * El home es una sola experiencia: el recorrido en 3D del dron controlado por
 * el scroll. El resto del sitio sigue existiendo y se llega por el navbar.
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
