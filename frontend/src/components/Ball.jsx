import "../styles/ball.css";

export default function Ball({ 
  color = "#6366f1", 
  size = 40, 
  glow = false, 
  border = "none",
  pattern = "none",
  secondaryColor = "#ffffff" 
}) {
  const getBackground = () => {
    switch (pattern) {
      case "stripes":
        return `repeating-linear-gradient(45deg, ${color}, ${color} 10px, ${secondaryColor} 10px, ${secondaryColor} 20px)`;
      case "checks":
        return `conic-gradient(${color} 90deg, ${secondaryColor} 90deg 180deg, ${color} 180deg 270deg, ${secondaryColor} 270deg)`;
      case "gradient":
        return `radial-gradient(circle at 30% 30%, ${secondaryColor}, ${color})`;
      case "rings":
        return `repeating-radial-gradient(circle, ${color}, ${color} 5px, ${secondaryColor} 5px, ${secondaryColor} 10px)`;
      case "star":
        return `conic-gradient(from 0deg, ${color}, ${secondaryColor} 45deg, ${color} 90deg, ${secondaryColor} 135deg, ${color} 180deg, ${secondaryColor} 225deg, ${color} 270deg, ${secondaryColor} 315deg, ${color})`;
      default:
        return color;
    }
  };

  return (
    <div
      className="ball"
      style={{
        width: size,
        height: size,
        background: getBackground(),
        backgroundSize: pattern === "checks" ? "20px 20px" : "auto",
        boxShadow: glow ? `0 0 15px ${color}, 0 0 30px ${color}88` : "none",
        border: border !== "none" ? `2px solid ${border}` : "none",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden"
      }}
    ></div>
  );
}