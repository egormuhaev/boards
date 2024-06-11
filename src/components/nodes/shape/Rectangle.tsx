import React, { HTMLAttributes } from "react";

const Rectangle: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  onClick,
  children,
  style,
}) => {
  return (
    <div
      onClick={onClick}
      className="h-full w-full flex flex-col justify-center items-center rounded-md min-w-[160px] min-h-[80px] box-border p-2"
      style={style}
    >
      {children}
    </div>
  );
};

export default Rectangle;
