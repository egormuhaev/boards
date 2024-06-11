import React, { HTMLAttributes } from "react";

const Circle: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  onClick,
  children,
  style,
}) => {
  return (
    <div
      onClick={onClick}
      className="h-full aspect-square flex flex-col justify-center items-center rounded-full min-w-[80px] min-h-[80px] box-border p-2"
      style={style}
    >
      {children}
    </div>
  );
};

export default Circle;
