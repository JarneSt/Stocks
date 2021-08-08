<template>
<div>
  <h1>STOCKS</h1>
  <input style="text-transform:uppercase; text-align: center" type="text" placeholder="STOCK" maxlength="4" autocapitalize="characters" v-model="stockname" @input="emptyAll">
  <input type="button" value="Search" @click="showStockInfo">


  <div class="p-5 mt-3 border w-50 m-auto border-dark articles" v-if="stockNews.length > 0">
    <h1>{{stockname.toUpperCase()}} <div v-if="stockPrice > 0">(${{stockPrice}})</div></h1>
    <div v-if="allStockData.data.symbol.includes(stockname.toUpperCase())">
      <a v-if="stockNews.length > 0" :href="`https://www.tradingview.com/symbols/NASDAQ-${stockname.toUpperCase()}/`" target="_blank">{{stockname.toUpperCase()}} Chart</a>
    </div>
    <div v-else>
      <a v-if="stockNews.length > 0" :href="`https://www.tradingview.com/symbols/EURONEXT-${stockname.toUpperCase()}/`" target="_blank">{{stockname.toUpperCase()}} Chart</a>
    </div>
  </div>

  <div v-if="stockNews.length > 0" class="p-20 mt-5 mb-5">
    <h1>{{stockname.toUpperCase()}} related articles ({{stockNews.length}})</h1>
    <input type="button" value="Open All Articles" style="font-size: 20px" @click="openAllArticles">
  </div>
  <div class="w-50 m-auto articles">
    <div v-for="article in stockNews" style="border: 1px solid black; padding: 25px">
      <div>
        <h4>{{article.title}}</h4>
        <a :href="article.link" target="_blank">Visit Article</a>
      </div>
    </div>
  </div>
  <img v-if="showLoadingGif === true" src="../assets/loadingGif.gif" height="291" width="441"/>
</div>
</template>

<script>
export default {
  name: "USStocks",
  data(){
    return {
      stockname : "",
      stockPrice : 0,
      allStockData : [],
      stockNews : [],
      showLoadingGif : false
    }
  },
  methods : {
    initcapName(string){
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    emptyAll(){
      this.allStockData = [];
      this.stockNews = [];
      this.showLoadingGif = false;
    },
    async sec(seconds) {
      return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
    },
    async openAllArticles() {
      for (const newsArticle of this.stockNews) {
        await this.sec(0.5);
        window.open(newsArticle.link, "_blank");
      }
    },
    showStockInfo(){
      this.fetchStockData();
    },
    fetchStockData(){
      if (this.stockname !== ""){
        this.showLoadingGif = true;
        this.fetchPrice();
        this.fetchNews();
        this.showLoadingGif = false;
      }
    },
    fetchPrice(){
      fetch(`https://twelve-data1.p.rapidapi.com/price?symbol=${this.stockname}&format=json&outputsize=30`, {
        "method": "GET",
        "headers": {
          "x-rapidapi-key": "b708bf4e38msh61224e33dafa692p110621jsn9d4292b5ae41",
          "x-rapidapi-host": "twelve-data1.p.rapidapi.com"
        }
      })
      .then(async response => {
        let tempObj = await response.json();
        this.stockPrice = parseFloat(tempObj.price).toFixed(2);
      })
      .catch(err => {
        console.error(err);
      });
    },
    fetchNews(){
      fetch(`https://apidojo-yahoo-finance-v1.p.rapidapi.com/auto-complete?q=${this.stockname}&region=US`, {
        "method": "GET",
        "headers": {
          "x-rapidapi-key": "b708bf4e38msh61224e33dafa692p110621jsn9d4292b5ae41",
          "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com"
        }
      })
      .then(async response => {
        this.allStockData = await response.json();
        this.stockNews = this.allStockData.news;
      })
      .catch(err => {
        console.error(err);
      });
    },
  },
  mounted() {

  }
}
</script>

<style scoped>
a {
  text-decoration: none;
}

a {
  font-size: 20px;
}

@media only screen and (max-width: 1000px){

  .articles {
    width: 100% !important;
  }
}
</style>