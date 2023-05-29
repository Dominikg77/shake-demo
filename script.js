
// https://stackoverflow.com/questions/56514116/how-do-i-get-deviceorientationevent-and-devicemotionevent-to-work-on-safari

var shakeThreshold = 25;

function init() {
  checkDevice();
  checkProtocol();
  const permissionStatus = localStorage.getItem("permissionStatus");
  permission(permissionStatus);
  addRequestListener(permissionStatus);
  addDeleteStorageListener();
}

function checkDevice() {
  if (/iPhone|iPod/i.test(navigator.userAgent)) {
    document.getElementById("request").style.display = "block";
    document.getElementById("infoDevice").innerHTML = "iPhonenutzer";
  } else {
    document.getElementById("request").style.display = "none";
    document.getElementById("infoDevice").innerHTML = "nicht IPhonenutzer";
    localStorage.setItem("permissionStatus", "granted");
  }
}

function checkProtocol() {
  var debug = false;

  if (debug == false) {
    if (location.protocol !== "https:") {
      location.href = "https:" + window.location.href.substring(window.location.protocol.length);
    }
  } else {
    if (location.protocol !== "http:") {
      location.href = "http:" + window.location.href.substring(window.location.protocol.length);
    }
  }
}

function permission(permissionStatus) {
  if (permissionStatus === "granted") {
    startShakeDetection();
  } else if (typeof DeviceMotionEvent !== "undefined" && typeof DeviceMotionEvent.requestPermission === "function") {
    DeviceMotionEvent.requestPermission()
      .then(response => {
        if (response === "granted") {
          localStorage.setItem("permissionStatus", "granted");
          startShakeDetection();
        }
      })
      .catch(console.error);
  } else {
    alert("DeviceMotionEvent wird nicht unterstützt.");
  }
}

function startShakeDetection() {
  document.getElementById("request").style.display = "none";
  window.addEventListener("devicemotion", e => {
    const acceleration = e.accelerationIncludingGravity;
    const { x, y, z } = acceleration;
    const accelerationMagnitude = Math.sqrt(x * x + y * y + z * z);

    if (accelerationMagnitude > shakeThreshold) {
      // Wenn Shaker funktioniert
      document.getElementById("infoShakerWorks").innerHTML = "Shaker funktioniert";
    }
  });
}

function addRequestListener(permissionStatus) {
  const btn = document.getElementById("request");
  btn.addEventListener("click", () => {
    permission(permissionStatus);
  });
}

// function addDeleteStorageListener() {
//   const deleteStorageBtn = document.getElementById("delete-storage");
//   deleteStorageBtn.addEventListener("click", deleteStorage);
// }

// function deleteStorage() {
//   localStorage.removeItem("permissionStatus");
//   alert("Berechtigung zurückgesetzt. Bitte klicken Sie erneut auf 'Berechtigung anfordern'.");
// }

