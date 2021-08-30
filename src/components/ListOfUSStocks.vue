<template>
  <div class="filter p-4">
    <div class="mb-4">
      <h3>Search on name</h3>
      <input class="form-control w-50 m-auto" v-model="searchedName">
    </div>
    <div class="mt-3">
      <h3>Select a type</h3>
      <select class="form-select w-50 m-auto" v-model="selectedType">
        <option v-for="type in allTypes">{{type}}</option>
      </select>
    </div>
  </div>
<div v-if="allStockData.length > 0" >
  <h1 class="p-4">All Stocks ({{ filteredStocks.length }})</h1>
  <div class="d-flex flex-wrap">
    <ul class="text-decoration-none list-unstyled w-50"
        v-for="stock in filteredStocks" v-if="filteredStocks.length > 0 && selectedType === ''">
      <div class="col border p-3">
        <div>
          <h4>{{ stock.symbol }}</h4>
          <h4>({{ stock.name }})</h4>
        </div>
        <div class="mt-4">
          <h2>Type</h2>
          <h4>{{ stock.type }}</h4>
        </div>
        <a :href="`https://www.tradingview.com/symbols/NASDAQ-${stock.symbol.toUpperCase()}/`" target="_blank">{{stock.symbol.toUpperCase()}} Chart</a>

      </div>
    </ul>

    <ul class="text-decoration-none list-unstyled w-50"
        v-for="stock in filteredStockByType" v-if="filteredStockByType.length > 0 && selectedType !== ''">
      <div class="col border p-3">
        <div>
          <h4>{{ stock.symbol }}</h4>
          <h4>({{ stock.name }})</h4>
        </div>
        <div class="mt-4">
          <h2>Type</h2>
          <h4>{{ stock.type }}</h4>
        </div>
        <a :href="`https://www.tradingview.com/symbols/NASDAQ-${stock.symbol.toUpperCase()}/`" target="_blank">{{stock.symbol.toUpperCase()}} Chart</a>

      </div>
    </ul>
  </div>
</div>
  <img v-if="showLoadingScreen === true" src="../assets/loadingGif.gif" height="291" width="441"/>
</template>

<script>
export default {
  name: "ListOfUSStocks",
  data(){
    return {
      allStockData : [],
      allTypes : [],
      loadedIn : 0,
      showLoadingScreen : true,
      searchedName : "",
      allStockNames : [],
      selectedType : ""
    }
  },
  computed : {
    filteredStocks() {
      this.selectedType = "";
      this.showLoadingScreen = true;
      if (!this.searchedName){
        return this.allStockData;
      }
      else {
        this.showLoadingScreen = false;
        return this.allStockData.filter(stockArr =>
            (stockArr.name.toLowerCase()).includes(this.searchedName.toLowerCase())
        );
      }
    },
    filteredStockByType() {
      this.searchedName = "";
      if (!this.selectedType) {
        return this.allStockData;
      } else {
        return this.allStockData.filter(stockArr =>
            (stockArr.type.toLowerCase()).includes(this.selectedType.toLowerCase())
        );
      }
    }
  },
  mounted() {
      fetch("https://twelve-data1.p.rapidapi.com/stocks?exchange=NASDAQ&format=json", {
        "method": "GET",
        "headers": {
          "x-rapidapi-key": "b708bf4e38msh61224e33dafa692p110621jsn9d4292b5ae41",
          "x-rapidapi-host": "twelve-data1.p.rapidapi.com"
        }
      })
      .then(async response => {
        this.allStockData = await response.json();

        const seen = new Set();
        this.allStockData = this.allStockData.data.filter(el => {
          const duplicate = seen.has(el.symbol);
          seen.add(el.symbol);
          return !duplicate;
        });


        //Push all the types to a temp array
        let tempArray = [];
        for(let stock of this.allStockData){
          tempArray.push(stock.type);
        }


        //Get the unique types out of the temp array
        this.allTypes = tempArray.filter(el => {
          const duplicate = seen.has(el);
          seen.add(el);
          return !duplicate;
        });


        //Put all names into seperate Array
        tempArray = [];
        for(let stock of this.allStockData){
          tempArray.push(stock.name);
        }
        this.allStockNames = tempArray;

        this.showLoadingScreen = false;
      })
      .catch(err => {
        console.error(err);
      });
    }
}
</script>

<style scoped>
select{
  text-align-last:center;
  padding: 10px;
}
option {
  text-align: center;
}

a {
  font-size: 20px;
  color: blue;
}

a:hover {
  color: black;
}
</style>