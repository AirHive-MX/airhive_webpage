import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = (e) => {
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="bg-white text-black py-32 px-6 relative">
      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg z-50"
        >
          🎉 {t("contact.success")}
        </motion.div>
      )}

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col justify-center"
        >
          <h1 className="text-4xl font-bold mb-6">{t("contact.title")}</h1>
          <p className="text-lg text-gray-700 mb-4">{t("contact.subtitle")}</p>

          <div className="mt-6 text-gray-600">
            <p className="mb-2">📍 <strong>{t("contact.location_label")}:</strong> {t("contact.location")}</p>
            <p className="mb-2">📧 <strong>{t("contact.email_label")}:</strong> airhivemx@gmail.com</p>
            <p className="mb-2">📞 <strong>{t("contact.phone_label")}:</strong> +52 81 1607 1269</p>
          </div>
        </motion.div>

        <motion.form
          action="https://formspree.io/f/meogayaj"
          method="POST"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="bg-gray-100 rounded-xl p-8 shadow-lg space-y-6"
        >
          <div>
            <label className="block mb-2 font-medium">{t("contact.form.name")}</label>
            <input type="text" name="name" required className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block mb-2 font-medium">{t("contact.form.email")}</label>
            <input type="email" name="email" required className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block mb-2 font-medium">{t("contact.form.message")}</label>
            <textarea name="message" rows="5" required className="w-full px-4 py-2 border border-gray-300 rounded-md"></textarea>
          </div>
          <button
            type="submit"
            className="bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition"
          >
            {t("contact.form.submit")}
          </button>
        </motion.form>
      </div>
    </div>
  );
};

export default Contact;
