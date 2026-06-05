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
      default:
        return color;
    }
  };

  // Render cute custom faces / SVG graphics for child themes!
  const renderContent = () => {
    switch (pattern) {
      case "smiley":
        return (
          <svg width="100%" height="100%" viewBox="0 0 40 40" style={{ display: "block" }}>
            <circle cx="20" cy="20" r="18" fill="#ffeb3b" stroke="#f57f17" strokeWidth="1.5" />
            <circle cx="14" cy="15" r="2.5" fill="#3e2723" />
            <circle cx="26" cy="15" r="2.5" fill="#3e2723" />
            <path d="M 12,23 Q 20,32 28,23" fill="none" stroke="#3e2723" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="10" cy="22" r="2" fill="#ff8a80" opacity="0.8" />
            <circle cx="30" cy="22" r="2" fill="#ff8a80" opacity="0.8" />
          </svg>
        );
      case "donut":
        return (
          <svg width="100%" height="100%" viewBox="0 0 40 40" style={{ display: "block" }}>
            <circle cx="20" cy="20" r="18" fill="#e0a96d" stroke="#b07d4f" strokeWidth="1" />
            <path d="M 20,4 A 16,16 0 1,1 4,20 A 16,16 0 0,1 20,4 Z" fill="#ff80ab" />
            <circle cx="20" cy="20" r="6" fill="#ffffff" />
            <rect x="12" y="12" width="1.5" height="4" rx="0.5" fill="#ffff00" transform="rotate(15 12 12)" />
            <rect x="25" y="10" width="1.5" height="4" rx="0.5" fill="#00e676" transform="rotate(-30 25 10)" />
            <rect x="10" y="22" width="1.5" height="4" rx="0.5" fill="#29b6f6" transform="rotate(45 10 22)" />
            <rect x="26" y="24" width="1.5" height="4" rx="0.5" fill="#ffeb3b" transform="rotate(-15 26 24)" />
            <rect x="18" y="28" width="1.5" height="4" rx="0.5" fill="#ffffff" transform="rotate(60 18 28)" />
            <rect x="18" y="9" width="1.5" height="4" rx="0.5" fill="#ffffff" transform="rotate(10 18 9)" />
          </svg>
        );
      case "panda":
        return (
          <svg width="100%" height="100%" viewBox="0 0 40 40" style={{ display: "block", overflow: "visible" }}>
            <circle cx="8" cy="8" r="6" fill="#212121" />
            <circle cx="32" cy="8" r="6" fill="#212121" />
            <circle cx="20" cy="20" r="17" fill="#ffffff" stroke="#e0e0e0" strokeWidth="1" />
            <ellipse cx="13" cy="18" rx="4" ry="5" fill="#212121" transform="rotate(-10 13 18)" />
            <ellipse cx="27" cy="18" rx="4" ry="5" fill="#212121" transform="rotate(10 27 18)" />
            <circle cx="13" cy="17" r="1.5" fill="#ffffff" />
            <circle cx="27" cy="17" r="1.5" fill="#ffffff" />
            <ellipse cx="20" cy="25" rx="3.5" ry="2.5" fill="#f5f5f5" />
            <polygon points="18,24 22,24 20,26.5" fill="#212121" />
            <path d="M 18,27 Q 20,29 22,27" fill="none" stroke="#212121" strokeWidth="1" strokeLinecap="round" />
          </svg>
        );
      case "kitty":
        return (
          <svg width="100%" height="100%" viewBox="0 0 40 40" style={{ display: "block", overflow: "visible" }}>
            <polygon points="5,10 15,2 18,15" fill="#ffb74d" stroke="#f57c00" strokeWidth="1" />
            <polygon points="35,10 25,2 22,15" fill="#ffb74d" stroke="#f57c00" strokeWidth="1" />
            <polygon points="7,9 13,4 15,12" fill="#ff8a80" />
            <polygon points="33,9 27,4 25,12" fill="#ff8a80" />
            <circle cx="20" cy="20" r="16" fill="#ffb74d" stroke="#f57c00" strokeWidth="1" />
            <circle cx="13" cy="17" r="2.5" fill="#3e2723" />
            <circle cx="27" cy="17" r="2.5" fill="#3e2723" />
            <circle cx="14" cy="16" r="0.8" fill="#ffffff" />
            <circle cx="28" cy="16" r="0.8" fill="#ffffff" />
            <polygon points="19,21 21,21 20,22.5" fill="#ff8a80" />
            <path d="M 17,24 Q 20,25.5 20,24 Q 20,25.5 23,24" fill="none" stroke="#3e2723" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="8" y1="21" x2="3" y2="20" stroke="#3e2723" strokeWidth="1" />
            <line x1="8" y1="24" x2="2" y2="25" stroke="#3e2723" strokeWidth="1" />
            <line x1="32" y1="21" x2="37" y2="20" stroke="#3e2723" strokeWidth="1" />
            <line x1="32" y1="24" x2="38" y2="25" stroke="#3e2723" strokeWidth="1" />
          </svg>
        );
      case "frog":
        return (
          <svg width="100%" height="100%" viewBox="0 0 40 40" style={{ display: "block", overflow: "visible" }}>
            <circle cx="11" cy="9" r="6" fill="#4caf50" stroke="#388e3c" strokeWidth="1" />
            <circle cx="11" cy="9" r="4" fill="#ffffff" />
            <circle cx="11" cy="9" r="2" fill="#000000" />
            <circle cx="29" cy="9" r="6" fill="#4caf50" stroke="#388e3c" strokeWidth="1" />
            <circle cx="29" cy="9" r="4" fill="#ffffff" />
            <circle cx="29" cy="9" r="2" fill="#000000" />
            <ellipse cx="20" cy="22" rx="17" ry="14" fill="#4caf50" stroke="#388e3c" strokeWidth="1" />
            <circle cx="10" cy="24" r="2.5" fill="#ff8a80" />
            <circle cx="30" cy="24" r="2.5" fill="#ff8a80" />
            <path d="M 14,23 Q 20,29 26,23" fill="none" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      case "soccer":
        return (
          <svg width="100%" height="100%" viewBox="0 0 40 40" style={{ display: "block" }}>
            <circle cx="20" cy="20" r="18" fill="#ffffff" stroke="#000000" strokeWidth="1.5" />
            <polygon points="20,15 24,18 23,23 17,23 16,18" fill="#000000" />
            <polygon points="20,2 23,7 17,7" fill="#000000" />
            <polygon points="36,13 31,16 33,21" fill="#000000" />
            <polygon points="30,30 25,27 28,33" fill="#000000" />
            <polygon points="10,30 15,27 12,33" fill="#000000" />
            <polygon points="4,13 9,16 7,21" fill="#000000" />
            <line x1="20" y1="15" x2="20" y2="7" stroke="#000000" strokeWidth="1.2" />
            <line x1="24" y1="18" x2="31" y2="16" stroke="#000000" strokeWidth="1.2" />
            <line x1="23" y1="23" x2="25" y2="27" stroke="#000000" strokeWidth="1.2" />
            <line x1="17" y1="23" x2="15" y2="27" stroke="#000000" strokeWidth="1.2" />
            <line x1="16" y1="18" x2="9" y2="16" stroke="#000000" strokeWidth="1.2" />
            <line x1="23" y1="7" x2="31" y2="16" stroke="#000000" strokeWidth="1.2" />
            <line x1="17" y1="7" x2="9" y2="16" stroke="#000000" strokeWidth="1.2" />
            <line x1="33" y1="21" x2="25" y2="27" stroke="#000000" strokeWidth="1.2" />
            <line x1="7" y1="21" x2="15" y2="27" stroke="#000000" strokeWidth="1.2" />
            <line x1="28" y1="33" x2="12" y2="33" stroke="#000000" strokeWidth="1.2" />
          </svg>
        );
      case "cupcake":
        return (
          <svg width="100%" height="100%" viewBox="0 0 40 40" style={{ display: "block", overflow: "visible" }}>
            <polygon points="11,24 29,24 26,36 14,36" fill="#ffb74d" stroke="#e65100" strokeWidth="1" />
            <line x1="16" y1="24" x2="18" y2="36" stroke="#e65100" strokeWidth="1" />
            <line x1="20" y1="24" x2="20" y2="36" stroke="#e65100" strokeWidth="1" />
            <line x1="24" y1="24" x2="22" y2="36" stroke="#e65100" strokeWidth="1" />
            <path d="M 9,24 Q 7,16 15,16 Q 20,13 25,16 Q 33,16 31,24 Z" fill="#f3e5f5" stroke="#ba68c8" strokeWidth="1" />
            <circle cx="15" cy="20" r="1.5" fill="#ff4081" />
            <circle cx="25" cy="20" r="1.5" fill="#29b6f6" />
            <circle cx="20" cy="17" r="1.5" fill="#ffeb3b" />
            <circle cx="20" cy="11" r="3.5" fill="#d50000" />
            <path d="M 20,11 Q 23,6 27,8" fill="none" stroke="#d50000" strokeWidth="1" />
          </svg>
        );
      case "star":
        return (
          <svg width="100%" height="100%" viewBox="0 0 40 40" style={{ display: "block" }}>
            <polygon 
              points="20,3 24.7,12.8 35.3,14.3 27.7,21.8 29.5,32.3 20,27.3 10.5,32.3 12.3,21.8 4.7,14.3 15.3,12.8" 
              fill={color} 
              stroke={secondaryColor || "#ffffff"} 
              strokeWidth="2" 
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const hasSvgPattern = ["smiley", "donut", "panda", "kitty", "frog", "soccer", "cupcake", "star"].includes(pattern);

  return (
    <div
      className={`ball ${glow ? "glow" : ""}`}
      style={{
        width: size,
        height: size,
        background: hasSvgPattern ? "transparent" : getBackground(),
        backgroundSize: pattern === "checks" ? "20px 20px" : "auto",
        boxShadow: glow && !hasSvgPattern ? `0 0 15px ${color}, 0 0 30px ${color}88` : "none",
        border: border !== "none" && !hasSvgPattern ? `2px solid ${border}` : "none",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "visible",
        position: "relative"
      }}
    >
      {renderContent()}
      
      {!hasSvgPattern && (
        <div className="ball-gloss"></div>
      )}
    </div>
  );
}