if(Cookies.get("cityname")) {
  document.getElementById("userLocation").innerHTML = "in <b>" + Cookies.get("cityname") + "</b>";
} else {
  navigator.geolocation.getCurrentPosition(function(pos) {
    const request = {
      location: {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude
      }
    };
    const geocoder = new google.maps.Geocoder;
    geocoder.geocode(request, function(res, status) {
      if(status === "OK") {
        const city = res[0].address_components.find((obj) => obj.types.includes("locality")).short_name;
        document.getElementById("userLocation").innerHTML = "in <b>" + city + "</b>";
        Cookies.set("cityname", city);
      }
    })
  })
}