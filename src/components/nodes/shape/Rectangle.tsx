import React, { HTMLAttributes } from "react";

const Rectangle: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  onClick,
  children,
  style,
}) => {
  return (
    <div
      onClick={onClick}
      className="h-full w-full flex flex-col justify-center items-center min-w-[180px] min-h-[180px] box-border p-2 shadow-[0px_9px_26px_-3px_rgba(0,0,0,0.52)]"
      style={style}
    >
      {children}
    </div>
  );
};

export default Rectangle;
