/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}", "../shared/**/*.js"],
  theme: {
    extend: {
      colors: {
        brand: {
          ink: "#0f172a",
          teal: "#0f766e",
          coral: "#f97316",
          cream: "#fffaf0",
          mist: "#e0f2fe"
        }
      },
      boxShadow: {
        card: "0 20px 60px rgba(15, 23, 42, 0.12)"
      },
      backgroundImage: {
        mesh: "radial-gradient(circle at top right, rgba(15,118,110,0.18), transparent 35%), radial-gradient(circle at left center, rgba(249,115,22,0.16), transparent 30%), linear-gradient(135deg, #fffaf0 0%, #f8fafc 100%)"
      },
      fontFamily: {
        display: ["Poppins", "ui-sans-serif", "system-ui"],
        body: ["Manrope", "ui-sans-serif", "system-ui"]
      }
    }
  },
  plugins: []
};