import SearchModel from "./_components/SearchModel";
import Topbar from "./_components/topbar";
import "leaflet/dist/leaflet.css";

export default function Home() {
  return (
    <>
      <Topbar name={"Parking"} />
      <SearchModel />
    </>
  );
}
