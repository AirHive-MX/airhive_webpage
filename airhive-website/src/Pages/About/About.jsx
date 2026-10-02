import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import about1 from "/foto3entrevista.jpg";
import fotoEquipo from "/foto equipo.JPG";

/*
 * Página oscura, con la misma paleta y la misma tipografía que el recorrido
 * del dron: rótulo en versalitas muy espaciadas, titular con interletraje
 * negativo e interlínea corta, y cuerpo al 60% de blanco. Las tarjetas usan la
 * receta de los globos (.ah-tarjeta-oscura), y el atributo data-ah-oscuro deja
 * fuera las reglas de index.css que pintan de blanco todo lo que parece
 * tarjeta, y de paso le dice a la barra de navegación que vaya en blanco.
 */
const About = () => {
  const { t } = useTranslation();

  return (
    <main data-ah-oscuro className="ah-oscura pt-28">
      <section className="ah-container grid items-center gap-10 pt-12 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-[0.62rem] font-medium uppercase tracking-[0.22em] text-white/45">Air Hive</p>
          <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-[1.18] tracking-[-0.015em] sm:text-5xl">
            {t("about.story_title")}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-[1.65] text-white/60">{t("about.story_text")}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          /* Sobre oscuro una foto a sangre corta en seco: el ring interior le
             pone canto, igual que a las tarjetas. */
          className="overflow-hidden rounded-[14px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07),0_26px_70px_-28px_rgba(0,0,0,0.85)] transition duration-500 hover:-translate-y-1"
        >
          <img src={about1} alt="Air Hive story" className="h-[420px] w-full object-cover" />
        </motion.div>
      </section>

      <section className="ah-container grid gap-6 pt-12 md:grid-cols-2">
        {[
          { key: "mission", text: t("about.mission_text") },
          { key: "vision", text: t("about.vision_text") },
        ].map((item) => (
          <motion.article
            key={item.key}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
            className="ah-tarjeta-oscura px-7 py-6 sm:px-8 sm:py-7"
          >
            {/* Más grandes y en blanco: aquí no son un rótulo de apoyo como en
                el recorrido, son el título de la tarjeta. El interletraje baja
                de 0.22em a 0.18em porque a este cuerpo el anterior se abre
                demasiado. */}
            <p className="text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-white">
              {t(`about.${item.key}_button`)}
            </p>
            <p className="mt-3 text-base leading-[1.65] text-white/70 sm:text-lg">{item.text}</p>
          </motion.article>
        ))}
      </section>

      <section className="ah-container grid items-center gap-10 pb-16 pt-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6 }}
          className="overflow-hidden rounded-[14px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07),0_26px_70px_-28px_rgba(0,0,0,0.85)] transition duration-500 hover:-translate-y-1"
        >
          <img
            src={fotoEquipo}
            alt="Air Hive team"
            className="h-[360px] w-[115%] max-w-none object-cover object-left"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-semibold leading-[1.18] tracking-[-0.015em] sm:text-4xl">
            {t("about.team_title")}
          </h2>
          <p className="mt-4 text-base leading-[1.65] text-white/60">{t("about.team_text_1")}</p>
        </motion.div>
      </section>
    </main>
  );
};

export default About;
