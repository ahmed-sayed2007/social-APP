export default function Loader({ fullscreen = false }: { fullscreen?: boolean }) {
  return (
    <div className={`loader-wrapper ${fullscreen ? "fullscreen" : ""}`}>
      <div className="loader" role="status" aria-label="Loading" />
    </div>
  );
}
