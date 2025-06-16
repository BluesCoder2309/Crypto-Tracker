document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const coinId = urlParams.get("id");
  const apiKey = "CG-mDVVqLm5xBDjvcVq523LnAmB";
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "x-cg-demo-api-key": apiKey,
    },
  };

  const coinContainer = document.getElementById("coin-container");
  const coinImage = document.getElementById("coin-image");
  const coinName = document.getElementById("coin-name");
  const coinDescription = document.getElementById("coin-description");
  const coinRank = document.getElementById("coin-rank");
  const coinPrice = document.getElementById("coin-price");
  const coinMarketCap = document.getElementById("coin-market-cap");
  const removeFromFavBtn = document.getElementById("remove-from-fav-btn");

  async function fetchcoinData() {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}`,
        options
      );
      const data = await response.json();
      displayCoinData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  function displayCoinData(coin) {
    if (!coin || !coin.market_data || !coin.image) {
      coinContainer.innerHTML =
        '<p style="color: red;">Invalid coin data received!</p>';
      return;
    }

    console.log(coin);

    coinImage.src = coin.image.large;
    coinImage.alt = coin.name;
    coinName.textContent = coin.name;
    coinDescription.innerHTML = coin.description.en;
    coinRank.textContent = coin.market_cap_rank || "N/A";
    coinPrice.textContent = coin.market_data.current_price.usd;
    coinMarketCap.textContent = coin.market_data.market_cap.usd;

    updateFavoriteButton();
  }

  const getFavorites = () =>
    JSON.parse(localStorage.getItem("favorites")) || [];

  const toggleFavorite = (coinId) => {
    let favorites = getFavorites();
    if (favorites.includes(coinId)) {
      favorites = favorites.filter((id) => id !== coinId);
    } else {
      favorites.push(coinId);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    updateFavoriteButton();
  };

  const updateFavoriteButton = () => {
    const favorites = getFavorites();
    removeFromFavBtn.textContent = favorites.includes(coinId)
      ? "Remove from favorites"
      : "Add to favorites";
  };

  removeFromFavBtn.addEventListener("click", toggleFavorite);

  await fetchcoinData();

  // Chart Code
  const ctx = document.getElementById("coinChart").getContext("2d");
  let coinChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Price (USD)",
          data: [],
          borderColor: "#EEBC1D",
          backgroundColor: "rgba(238,188,29,0.2)",
          fill: true,
          borderWidth: 2,
          pointRadius: 3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { display: false },
          title: { display: true, text: "Date" },
        },
        y: {
          beginAtZero: false,
          title: { display: true, text: "Price (USD)" },
          ticks: {
            callback: function (value) {
              return `$${value}`;
            },
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              return `$${context.parsed.y}`;
            },
          },
        },
      },
    },
  });

  async function fetchChartData(days) {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
      );
      const data = await response.json();
      updateChart(data.price);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  function updateChart(prices) {
    const label = prices.map((price) => {
      let data = new Date(price[0]);
      return data.toLocalString();
    });

    const data = prices.map((price) => price[1]);

    coinChart.data.label = labels;
    coinChart.data.datasets[0].data = data;
    coinChart.update();
  }

  const buttons = document.querySelectorAll(".button-container button");
  buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
      buttons.forEach((btn) => btn.classList.remove("active"));
      event.target.classList.add("active");
      const days =
        event.target.id === "24h" ? 1 : event.target.id === "30d" ? 30 : 90;
      fetchChartData(days);
    });
  });


document.getElementById('24h').click();

});
