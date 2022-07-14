import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { MdDelete } from "react-icons/md";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});
L.Marker.prototype.options.icon = DefaultIcon;

const OrderModal = (props) => {
  const { isModal, setIsModal, removeExpense, orderModalValue } = props;

  return (
    <>
      {isModal ? (
        <div
          onClick={() => setIsModal(false)}
          className="w-full min-h-screen fixed top-0 left-0 bg-black bg-opacity-50 cursor-not-allowed z-[60]"
        ></div>
      ) : null}
      {isModal ? (
        <div className="fixed md:w-[600px] sm:w-[480px] w-[300px] h-[550px] bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg p-4 z-[61] modal">
          <div className="flex justify-between items-center mb-4">
            <div className="text-xl font-medium text-blue-900">
              Order datails
            </div>
            <MdDelete
              onClick={() => removeExpense(orderModalValue._id)}
              className="text-2xl text-red-600 cursor-pointer mr-2"
            />
          </div>
          <div className="grid grid-cols-2">
            <div className="md:col-span-1 col-span-2 mb-2">
              Amount:{" "}
              <span className="font-medium text-blue-900">
                {orderModalValue.amount} $
              </span>
            </div>
            <div className="md:col-span-1 col-span-2 mb-2">
              Date:{" "}
              <span className="font-medium text-blue-900">
                {orderModalValue.date.substring(0, 10)}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="md:col-span-1 col-span-2 mb-2">
              Municipality Zone:{" "}
              <span className="font-medium text-blue-900">
                {orderModalValue.address.MunicipalityZone}
              </span>
            </div>
            <div className="md:col-span-1 col-span-2 mb-2">
              Neighbourhood:{" "}
              <span className="font-medium text-blue-900">
                {orderModalValue.address.Neighbourhood}
              </span>
            </div>
          </div>
          <div className="w-full mb-2">
            Place:{" "}
            <span className="font-medium text-blue-900">
              {orderModalValue.address.Place}
            </span>
          </div>
          <div className="w-full mb-8">
            Adress:{" "}
            <span className="font-medium text-blue-900">
              {orderModalValue.address.FormattedAddress}
            </span>
          </div>
          <MapContainer
            center={[orderModalValue.geo.lat, orderModalValue.geo.lon]}
            zoom={13}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={[orderModalValue.geo.lat, orderModalValue.geo.lon]}
            >
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      ) : null}
    </>
  );
};

export default OrderModal;
