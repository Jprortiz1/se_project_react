import "./ToggleSwitch.css";
import { useContext } from "react";
import CurrentTemperatureUnitContext from "../../contexts/CurrentTemperatureUnitContext";

const ToggleSwitch = () => {
  const { currentTemperatureUnit, handleToggleSwitchChange } = useContext(
    CurrentTemperatureUnitContext
  );
  return (
    <>
      <input
        checked={currentTemperatureUnit === "C"}
        onChange={handleToggleSwitchChange}
        className="react-switch-checkbox"
        id={`react-switch-new`}
        type="checkbox"
      />
      <label className="react-switch-label" htmlFor={`react-switch-new`}>
        <span className={`react-switch-button`}>{currentTemperatureUnit}</span>
        <span className="c">C</span>
        <span className="f">F</span>
      </label>
    </>
  );
};

export default ToggleSwitch;
