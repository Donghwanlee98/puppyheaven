import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Map = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    const loadScript = () => {
      if (window.kakao && window.kakao.maps) {
        setScriptLoaded(true);
        const container = document.getElementById("map");
        const options = {
          center: new window.kakao.maps.LatLng(37.5832206, 127.0103893),
          level: 3,
        };
        const map = new window.kakao.maps.Map(container, options);
        setMap(map);
        setMarker(null);
      } else {
        setTimeout(loadScript, 100);
      }
    };

    const script = document.createElement("script");
    script.async = true;
    script.defer = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=d83083b50f9507f8339837fca3e0149f&libraries=services,clusterer,drawing&autoload=false`;
    script.onload = loadScript;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const searchAddress = () => {
    if (!map || !address) return;
  
    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(address, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const coordinates = new window.kakao.maps.LatLng(result[0].y, result[0].x);
  
        if (map) {
          map.setCenter(coordinates);
          
          // 이전 마커를 삭제합니다.
          if (marker) {
            marker.setMap(null);
          }
  
          // 새로운 마커를 추가하고 상태를 업데이트합니다.
          const newMarker = new window.kakao.maps.Marker({ position: coordinates });
          newMarker.setMap(map);
          setMarker(newMarker);
  
          console.log("검색된 좌표: ", coordinates);
        } else {
          alert("지도를 로드할 수 없습니다. 다시 시도해 주세요.");
        }
      } else {
        alert("검색 결과를 찾을 수 없습니다. 다른 주소를 입력해 주세요.");
      }
    });
  };
  let e = [1, 2, 3];
  let result = e.map(function(num) {
    return num * 2;
  }); 
  function handleAddressChange(e) {
    setAddress(e.target.value);
  }


  const handleAddressSearch = (e) => {
    e.preventDefault();
  
    console.log("입력한 주소: ", address);
  
    const searchWithDelay = () => {
      if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
        searchAddress();
      } else {
        setTimeout(searchWithDelay, 1000);
      }
    };
  
    searchWithDelay();
  };

  return (
    <div className="Map">
      <div className="Logo">
        <img
          src="shortlogo.png"
          alt="로고 이미지"
          className="logo-image"
        ></img>
      </div>

      <div className="search_wrapper">
        <div className="btn-group-md" role="group">
          <input
            type="radio"
            className="btn-check"
            id="mainbtn"
            autoComplete="off"
          />
          <label
            className="btn btn-outline-dark"
            htmlFor="mainbtn"
            onClick={() => navigate("/main")}
          >
            Main
          </label>
          <input
            type="radio"
            className="btn-check"
            id="btn1"
            name="options"
            autoComplete="off"
            defaultChecked
          />
          <label className="btn btn-outline-dark" htmlFor="btn1">
            동물병원
          </label>
          <input
            type="radio"
            className="btn-check"
            id="btn2"
            name="options"
            autoComplete="off"
          />
          <label className="btn btn-outline-dark" htmlFor="btn2">
            산책로
          </label>
        </div>

        <div className="search_bar">
          <form onSubmit={handleAddressSearch}>
            <input
              type="text"
              value={address}
              onChange={handleAddressChange}
              autoComplete="off"
              className="searchBar"
              placeholder="주소 검색"
            />
            <button type="submit" className="searchBtn">검색</button>
          </form>
        </div>

        <div className="search_results">
          <div></div>
        </div>
      </div>

      <div className="map_wrapper">
        <div
          id="map"
          style={{ width: "92%", height: "90%", marginLeft: "60px", marginTop: "45px" }}
        />
      </div>
    </div>
  );
};

export default Map;