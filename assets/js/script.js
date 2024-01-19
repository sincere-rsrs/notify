document.querySelectorAll('.custom-checkbox').forEach(function(label) {
    label.addEventListener('click', function() {
        const checkbox = this.querySelector('.custom-checkbox-input');
        const svg = this.querySelector('.custom-checkbox-svg');
        const checkboxId = checkbox.id; // 獲取 checkbox 的 ID
        if (checkbox.checked) {
            // 設置選中時的 SVG 樣式
            svg.querySelector('.st1').style.fill = "#CCB38C";
        } else {
            // 設置未選中時的 SVG 樣式
            svg.querySelector('.st1').style.fill = "#FFFFFF";
        }
    });
});

document.getElementById('cancelReport').addEventListener('click', function() {
  resetForm();
});

function resetForm() {
  // 清除所有 checkbox 的選中狀態
  var checkboxes = document.querySelectorAll('.custom-checkbox-input');
  checkboxes.forEach(function(checkbox) {
    checkbox.checked = false;
  });

  // 重置所有 SVG 的顏色
  var svgs = document.querySelectorAll('.custom-checkbox-svg');
  svgs.forEach(function(svg) {
    svg.querySelectorAll('.st1, .st5').forEach(function(path) {
      path.style.fill = "#FFFFFF"; // 將所有相關 SVG 路徑設置為白色
    });
  });
}

document.getElementById('submitReport').addEventListener('click', function() {
  var date = new Date().toLocaleDateString('zh-TW', { timeZone: 'Asia/Taipei' });
  var time = new Date().toLocaleTimeString('zh-TW', { timeZone: 'Asia/Taipei', hour12: false });
  var terminal = getParameterByName('terminal');
  var area = getParameterByName('area');
  var place = getParameterByName('place');
  var key = getParameterByName('key');   
  var selectedCheckboxes = getSelectedCheckboxes();

  if (!selectedCheckboxes) {
      alert("請選擇需通報事項");
      return;
  }

  var dataToSend = {
      "date": date,
      "time": time,
      "terminal": terminal,
      "area" : area,
      "place": place,
      "key": key,
      "selectedCheckboxes": selectedCheckboxes
  };

  this.disabled = true;
  setTimeout(() => this.disabled = false, 5000);

  fetch('https://script.google.com/macros/s/AKfycbyEi-2zpVGku_VOPeDEApg3JaHDbrKd3zERjgu3ipbcd2bHFc_McfFxGuA43T4NkIgX/exec', {
      method: 'POST',
      headers: {
          "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams(dataToSend)
    })
    .then(response => response.json())
    .then(data => console.log("Response from server:", data))
    .catch(error => console.error('Error:', error));

    resetForm();
});

function getSelectedCheckboxes() {
  var checkboxes = document.querySelectorAll('.custom-checkbox-input:checked');
  return Array.from(checkboxes).map(cb => cb.value).join('、');
}

// Function to extract URL parameter (implement this)
function getParameterByName(name) {
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(window.location.href);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
