import "./Loading.css";
const Loading = () => {
  return (
    <div
      className="container h-100 w-100 d-flex justify-content-center align-items-center"
      style={{ border: 0 }}
    >
      <section className="loading-section">
        <span className="loader-19"></span>
      </section>
    </div>
  );
};
export default Loading;
