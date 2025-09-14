import { useParams } from "react-router-dom";

function Ratings() {
  const { storeId } = useParams();
  return <h2>Ratings for Store {storeId}</h2>;
}
export default Ratings;
