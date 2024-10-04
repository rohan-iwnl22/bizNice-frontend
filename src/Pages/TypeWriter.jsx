import React, { useState, useEffect } from "react";
import { useTrail, a } from "@react-spring/web";
import { useNavigate } from "react-router-dom";

const TypeWriterText = [
  "Welcome to BizNiche",
  "Smart Shopping, Local Connections📈",
];

const Trail = ({ open }) => {
  const items = TypeWriterText;
  const trail = useTrail(items.length, {
    config: { mass: 5, tension: 2000, friction: 200 },
    opacity: open ? 1 : 0,
    x: open ? 0 : 20,
    height: open ? 110 : 0,
    from: { opacity: 0, x: 20, height: 0 },
  });

  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      {trail.map(({ height, ...style }, index) => (
        <a.div
          key={index}
          className="relative w-full h-20 leading-[5rem] text-black text-6xl font-extrabold tracking-tight overflow-hidden text-center"
          style={style}
        >
          <a.div style={{ height }}>{items[index]}</a.div>
        </a.div>
      ))}
    </div>
  );
};

export default function TypeWriter() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(false);
      navigate("/landing"); // Navigate to the landing page after 5 seconds
    }, 2000);
    return () => clearTimeout(timer); // Clear timeout if the component unmounts
  }, [navigate]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <Trail open={open} />
    </div>
  );
}
