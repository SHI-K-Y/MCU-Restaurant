document.addEventListener("DOMContentLoaded", () => {
  // 存儲餐廳資料的陣列
  let restaurants = [];

  // 從CSV檔案讀取資料
  async function loadRestaurants() {
    try {
      const response = await fetch("./assets/data/data.csv");
      const data = await response.text();

      // 解析CSV資料
      const rows = data.split("\n").filter((row) => row.trim() && !row.startsWith("//"));
      const headers = rows[0].split(",");

      // 將資料轉換成陣列物件
      restaurants = rows.slice(1).map((row) => {
        const values = row.split(",");
        const restaurant = {};
        headers.forEach((header, index) => {
          restaurant[header.trim()] = values[index]?.trim() || "";
        });
        return restaurant;
      });

      // 填充下拉選單
      populateDropdowns();

      console.log("載入餐廳資料:", restaurants);
    } catch (error) {
      console.error("載入餐廳資料失敗:", error);
    }
  }

  // 填充下拉選單
  function populateDropdowns() {
    const categorySelect = document.getElementById("category");
    const locationSelect = document.getElementById("location");

    // 獲取所有不重複的分類
    const categories = [...new Set(restaurants.map((r) => r.Gener))].filter(Boolean);

    // 獲取所有不重複的位置
    const locations = [...new Set(restaurants.map((r) => r.Location))].filter(Boolean);

    // 清空現有選項，保留「請選擇」選項
    categorySelect.innerHTML = '<option value="default" class="options">請選擇</option>';
    locationSelect.innerHTML = '<option value="default" class="options">請選擇</option>';

    // 添加「隨機」選項
    const randomOptionCategory = document.createElement("option");
    randomOptionCategory.value = "random";
    randomOptionCategory.textContent = "隨機";
    categorySelect.appendChild(randomOptionCategory);

    const randomOptionLocation = document.createElement("option");
    randomOptionLocation.value = "random";
    randomOptionLocation.textContent = "隨機";
    locationSelect.appendChild(randomOptionLocation);

    // 填充分類下拉選單
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categorySelect.appendChild(option);
    });

    // 填充位置下拉選單
    locations.forEach((location) => {
      const option = document.createElement("option");
      option.value = location;
      option.textContent = location;
      locationSelect.appendChild(option);
    });
  }

  // 隨機選擇餐廳
  function selectRandomRestaurant(category, location) {
    // 根據選擇的條件篩選餐廳
    let filteredRestaurants = [...restaurants];

    // 如果類別不是「隨機」或「請選擇」，則篩選符合該類別的餐廳
    if (category !== "random" && category !== "default") {
      filteredRestaurants = filteredRestaurants.filter((r) => r.Gener === category);
    }

    // 如果位置不是「隨機」或「請選擇」，則篩選符合該位置的餐廳
    if (location !== "random" && location !== "default") {
      filteredRestaurants = filteredRestaurants.filter((r) => r.Location === location);
    }

    // 如果沒有符合條件的餐廳
    if (filteredRestaurants.length === 0) {
      return null;
    }

    // 隨機選擇一家餐廳
    const randomIndex = Math.floor(Math.random() * filteredRestaurants.length);
    return filteredRestaurants[randomIndex];
  }

  // 處理表單提交事件
  document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();

    const categorySelect = document.getElementById("category");
    const locationSelect = document.getElementById("location");

    const category = categorySelect.value;
    const location = locationSelect.value;

    // 選擇隨機餐廳
    const selectedRestaurant = selectRandomRestaurant(category, location);

    // 顯示結果
    showResult(selectedRestaurant);
  });

  // 顯示結果
  function showResult(restaurant) {
    // 檢查是否已有結果容器，如果有則移除
    let resultContainer = document.querySelector(".result-container");
    if (resultContainer) {
      resultContainer.remove();
    }

    // 創建結果容器
    resultContainer = document.createElement("div");
    resultContainer.className = "result-container";

    if (restaurant) {
      // 創建結果卡片
      const resultCard = document.createElement("div");
      resultCard.className = "result-card";
      // 添加動畫屬性
      resultCard.setAttribute("data-aos", "flip-up");
      resultCard.setAttribute("data-aos-duration", "800");

      // 添加餐廳資訊
      resultCard.innerHTML = `
        <h3>${restaurant.Restaurant}</h3>
        <p>類別: ${restaurant.Gener}</p>
        <p>位置: ${restaurant.Location}</p>
        <p>價格: ${"$".repeat(parseInt(restaurant.Price) || 1)}</p>
        ${restaurant["Google Map"] ? `<a href="${restaurant["Google Map"]}" target="_blank" class="map-link">在 Google Map 中檢視</a>` : ""}
      `;

      resultContainer.appendChild(resultCard);
    } else {
      // 沒有符合條件的餐廳
      const noResult = document.createElement("div");
      noResult.className = "no-result";
      // 添加動畫屬性
      noResult.setAttribute("data-aos", "flip-up");
      noResult.setAttribute("data-aos-duration", "800");

      noResult.innerHTML = `<p>沒有符合條件的餐廳</p>`;
      resultContainer.appendChild(noResult);
    }

    // 添加到主容器中
    document.querySelector(".main").appendChild(resultContainer);

    // 重新初始化 AOS 以應用新添加元素的動畫
    AOS.refresh();
  }

  // 載入資料
  loadRestaurants();
});
AOS.init({
  duration: 800,
  once: true,
  offset: 100,
});
