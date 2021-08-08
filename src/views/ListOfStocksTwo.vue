<template>
<div>
  <ListOfEUStocks/>
</div>
</template>

<script>
import EUStocks from "../components/EUStocks";
import ListOfEUStocks from "../components/ListOfEUStocks";
export default {
  name: "ListOfStocksTwo",
  components: {ListOfEUStocks, EUStocks}
}
</script>

<style scoped>

</style>