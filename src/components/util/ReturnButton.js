import returnArrow from "../../assets/returnArrow.png";
import "../../styles/index.css";

const ReturnButton = () => {
  return (
    <a href="/">
      <img src={returnArrow} alt="returnArrow" className={"returnArrow"} />
    </a>
  );
};

export default ReturnButton;
