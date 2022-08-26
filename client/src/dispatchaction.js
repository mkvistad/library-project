import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { receiveColors } from "./redux/colors";

import "./styles.css";

export default function App() {
  const dispatch = useDispatch();

  const = useSelector((state) => {
    return state.colors.allColors;
  });

  console.log('App', colors);

  useEffect(() => {
    fetch("https://reqres.in/api/colors?per_page=12")
      .then((response) => response.json())
      .then((data) => {
        dispatch(receiveColors(data.data));
      });
  }, [dispatch]);

  return (
    <div className="app">{colors.length}</div>
  );
}