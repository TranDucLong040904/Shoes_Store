import "./Checkbox.scss";

const Checkbox = ({ handleChange, title, value, name }) => {
  return (
    <label className="checkbox-size">
      <input
        onChange={handleChange}
        type="checkbox"
        value={value}
        name={name}
      />
      {title}
    </label>
  );
};

export default Checkbox;
