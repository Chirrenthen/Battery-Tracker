const batteryIcon = document.getElementById("battery-icon");
const batteryFill = document.getElementById("battery-fill");
const chargeLevel = document.getElementById("charge-level");
const chargingStatus = document.getElementById("charging-status");
const chargingTime = document.getElementById("charging-time");
const toast = document.getElementById("toast");

// Chart Initialization
const batteryChart = document.getElementById("battery-chart").getContext("2d");
const batteryData = [];
const chart = new Chart(batteryChart, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Battery Level (%)",
        data: batteryData,
        borderColor: "#246aed",
        borderWidth: 2,
      },
    ],
  },
});

function showToast(message) {
  toast.textContent = message;
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}

navigator.getBattery().then((battery) => {
  function updateBatteryUI() {
    const level = Math.round(battery.level * 100);

    // Update battery fill and color
    batteryFill.style.width = `${level}%`;
    batteryFill.style.backgroundColor =
      level > 50 ? "green" : level > 20 ? "yellow" : "red";

    chargeLevel.textContent = `Battery Level: ${level}%`;
    chargingStatus.textContent = battery.charging
      ? "Charging 🔌"
      : "Not Charging";

    // Notifications
    if (level === 100 && battery.charging) showToast("Battery Fully Charged ⚡");
    if (level < 20 && !battery.charging) showToast("Low Battery! Please Charge!");

    // Time remaining
    if (battery.charging) {
      chargingTime.textContent = `Charging Time Remaining: ${
        Math.round(battery.chargingTime / 60) || "Calculating..."
      } minutes`;
    } else {
      chargingTime.textContent = `Discharging Time Remaining: ${
        Math.round(battery.dischargingTime / 60) || "Calculating..."
      } minutes`;
    }

    // Chart updates
    const currentTime = new Date().toLocaleTimeString();
    if (batteryData.length > 20) {
      batteryData.shift();
      chart.data.labels.shift();
    }
    batteryData.push(level);
    chart.data.labels.push(currentTime);
    chart.update();
  }

  updateBatteryUI();

  battery.addEventListener("levelchange", updateBatteryUI);
  battery.addEventListener("chargingchange", updateBatteryUI);
});

// Theme Switcher
const themeSwitcher = document.querySelector(".theme-switcher");
const themeDark = document.getElementById("theme-dark");

themeSwitcher.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  document.body.classList.toggle("neon-mode");
});