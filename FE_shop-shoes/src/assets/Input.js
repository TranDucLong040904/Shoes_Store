import "./Input.scss";

const Input = ({ handleChange, title, value, name }) => {
  return (
    <label className="sidebar-label-container">
      <input onChange={handleChange} type="radio" value={value} name={name} />
      {title}
    </label>
  );
};

export default Input;
