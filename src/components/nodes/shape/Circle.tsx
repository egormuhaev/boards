import React, { HTMLAttributes } from "react";

const Circle: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  onClick,
  children,
  style,
}) => {
  return (
    <div
      onClick={onClick}
      className="aspect-square flex flex-col justify-center items-center rounded-full min-w-[180px] min-h-[180px] box-border p-2"
      style={style}
    >
      {children}
    </div>
  );
};

export default Circle;
