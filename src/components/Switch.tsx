import React from "react";

type Props = {
  isOn: boolean;
  handleToggle: () => void;
  onColor?: string;
};

export default function Switch({ isOn, handleToggle, onColor }: Props) {
  return (
    <>
      <input
        checked={isOn}
        onChange={handleToggle}
        className="react-switch-checkbox"
        id={`react-switch-new`}
        type="checkbox"
      />
      <label
        style={{ background: isOn ? (onColor || "#06D6A0") : "#EAEAEA"}}
        className="react-switch-label"
        htmlFor={`react-switch-new`}
      >
        <span className={`react-switch-button`} />
      </label>
    </>
  );
}
