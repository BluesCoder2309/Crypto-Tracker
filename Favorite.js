// API Request Options

const options = {
   method: "GET",
   headers: {
      accept: "application/json",
      "x-cg-demo-api-key": "CG-mDVVqLm5xBDjvcVq523LnAmB",
   },
};

const getFavorites = () => JSON.parse(localStorage.getItem("favorites")) || [];

// Save the updated favorite list to local storage
const saveFavorites = (favorites) => {
   localStorage.setItem("favorites", JSON.stringify(favorites));
};

//  Toggle for favorite status
const toggleFavorite = (coinId) => {
   let favorites = getFavorites();
   if (favorites.includes(coinId)) {
      favorites = favorites.filter((id) => id !== coinId);
   } else {
      favorites.push(coinId);
   }

   saveFavorites(favorites);
   fetchFavoriteCoins(); //Re-fetch the list after updating the favorites
};

// fetches and displays the favorite coins

const fetchFavoriteCoins = async () => {
   const favorites = getFavorites();
   const tableBody = document.querySelector("#favorite-table tbody");
   const noFavoriteMessage = document.getElementById("no-favorite");

   if (favorites.length === 0) {
      tableBody.innerHTML = "";
      noFavoriteMessage.style.display = "block";
      return;
   } else {
      noFavoriteMessage.style.display = "none";
   }

   try {
      const response = await fetch(
         `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${favorites.join(
            ","
         )}&order=market_cap_desc&per_page=100&page=1&sparkline=false`
      );
      if (!response.ok) throw new Error("API request failed!");

      const data = await response.json();
      if (!data || data.length === 0) {
         tableBody.innerHTML = `<tr><td colspan='7'>No data available. </td></tr>`;
         return;
      }

      renderFavorites(data);
   } catch (err) {
      console.error("Error fetching favorite coins.", err);
      tableBody.innerHTML = `<tr><td colspan='7'>Failed to load data. </td></tr>`;
   }
};

const renderFavorites = (coins) => {
   const tableBody = document.querySelector("#favorite-table tbody");
   tableBody.innerHTML = "";

   coins.forEach((coin, index) => {
      const row = document.createElement("tr");
      row.classList.add("coin-row");
      row.dataset.coinId = coin.id;

      row.innerHTML = `
     <td>${index + 1}</td>
     <td><img src='${coin.image}' alt='${coin.name}' width='24' height='24' /></td>
     <td>${coin.name} </td>
     <td>${coin.current_price.toLocaleString()} </td>
     <td>${coin.total_volume.toLocaleString()} </td>
     <td>${coin.market_cap.toLocaleString()} </td>
     <td>
 <i class="fa-solid fa-trash remove-icon" data-id='${coin.id}' style='cursor: pointer; color: red;'></i>
 </td>
    `;

      tableBody.appendChild(row);
   });

   //Remove favorite coin

   document.querySelectorAll(".remove-icon").forEach((icon) => {
      icon.addEventListener("click", (event) => {
         event.stopPropagation();
         toggleFavorite(event.target.dataset.id);
      });

      //redirect to the coin details page on rowclick TODO
   });
};

document.addEventListener("DOMContentLoaded", fetchFavoriteCoins);
