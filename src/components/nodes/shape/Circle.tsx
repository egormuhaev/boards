import React, { HTMLAttributes } from "react";

const Circle: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  onClick,
  children,
  className,
  style,
}) => {
  return (
    <div onClick={onClick} className={className} style={style}>
      {children}
    </div>
  );
};

export default Circle;
