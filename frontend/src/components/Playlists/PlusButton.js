import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const PlusButton = () => {

  return (
    <button className="plus-button">
      <FontAwesomeIcon icon={faPlus} />
    </button>
  );
};

export default PlusButton;
