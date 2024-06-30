import "./styles.css";
import ZoomableImage from "./ZoomableImage";

export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <ZoomableImage
        src="https://cdn.wallpapersafari.com/82/57/3EroTL.jpg"
        alt="image"
      />
    </div>
  );
}
