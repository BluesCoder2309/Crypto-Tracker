// API Request Options

const options = {
   method: "GET",
   headers: {
      accept: "application/json",
      "x-cg-demo-api-key": "CG-mDVVqLm5xBDjvcVq523LnAmB",
   },
};

// State Variables
let coins = [];
let currentPage = 1;

const fetchCoins = async (page = 1) => {
   try {
      const response = await fetch(
         `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=25&page=${page}`, options);
      coins = await response.json();
   } catch (err) {
      console.error(err);
   }
   return coins;
};

const getFavorites = () => JSON.parse(localStorage.getItem("favorites")) || [];

//Class 1 functionality
//  Render a single coin row (with favorite star icon)
const renderCoinRow = (coin, index, start, favorites) => {
   const isFavorite = favorites.includes(coin.id);
   const row = document.createElement("tr");
   row.innerHTML = `<td>${start + index}</td>
 <td><img src='${coin.image}' alt='${coin.name}' width='24' height='24' /></td>
 <td>${coin.name} </td>
 <td>${coin.current_price.toLocalString} </td>
 <td>${coin.total_volume.toLocalString} </td>
 <td>${coin.market_cap.toLocalString} </td>
 <td>
 <i class="fa-solid fa-star favorite-star ${isFavorite ? 'favorite' : ''}" data-id='${coin.id}'></i>
 </td>
 `;
 return row;
};

//Class 2 functionality

const renderCoins = (coinToDisplay,page,itemPerPage) => {
    const start = (page - 1) * itemPerPage + 1;
    const favorite = getFavorites();

    const tableBody = document.querySelector('#crypto-table tbody');

if (!tableBody){
    console.error('Table body element not found');
    return;
}

tableBody.innerHTML = '';
coinToDisplay.forEach((coin,index) => {
    const row = renderCoinRow(coin, index, start, favorite);
    tableBody.appendChild(row);
});
}

const initializePage = async () => {
    coins = await fetchCoins(currentPage);

    if(coins.length === 0 ){
        console.error('No Coins Data Fetched!');
        return;
    }

    renderCoins(coins, currentPage, 25);
}


document.addEventListener('DOMContentLoaded',initializePage);
