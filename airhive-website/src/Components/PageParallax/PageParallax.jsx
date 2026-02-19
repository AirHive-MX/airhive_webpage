import { motion, useScroll, useTransform } from "framer-motion";

const PageParallax = () => {
  const { scrollYProgress } = useScroll();
  const yPrimary = useTransform(scrollYProgress, [0, 1], [-60, 60]);
  const ySecondary = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <motion.div
        style={{ y: yPrimary }}
        className="absolute -left-28 top-[16%] h-72 w-72 rounded-full bg-[radial-gradient(circle,#2A47F6_0%,transparent_68%)] opacity-[0.08] blur-2xl"
      />
      <motion.div
        style={{ y: ySecondary }}
        className="absolute right-[-120px] top-[58%] h-80 w-80 rounded-full bg-[radial-gradient(circle,#6443DB_0%,transparent_70%)] opacity-[0.07] blur-2xl"
      />
    </div>
  );
};

export default PageParallax;
