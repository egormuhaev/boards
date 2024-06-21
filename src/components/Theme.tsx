import { $boardPlayground, changeTheme } from "@/flow/store/playground.slice";
import { useUnit } from "effector-react";
import { Panel } from "reactflow";

const Theme = () => {
  const { theme } = useUnit($boardPlayground);

  const optionClassName = `${
    theme === "dark" ? "text-white bg-[#1e293b]" : "text-[#1e293b] bg-white"
  }`;

  return (
    <Panel position="top-right" className="w-28 h-10 p-0 bg-transparent">
      <select
        value={theme}
        onChange={(e) => changeTheme(e.target.value)}
        className={`w-full h-full border-[1px] rounded-sm border-solid ${
          theme === "dark"
            ? "text-white bg-[#1e293b] border-white"
            : "text-[#1e293b] bg-white border-[#1e293b]"
        } outline-none`}
      >
        <option className={optionClassName} value="light">
          light
        </option>
        <option className={optionClassName} value="dark">
          dark
        </option>
      </select>
    </Panel>
  );
};

export default Theme;
