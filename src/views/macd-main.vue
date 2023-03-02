<template>
  <v-data-table
    :headers="headers"
    :items="data_table"
    sort-by="calories"
    class="custom_table_class"
    :options.sync="pagination"
    @update:page="updatePage()"
    :footer-props="footerProps"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Macd</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
      </v-toolbar>
    </template>
    <!-- eslint-disable-next-line -->
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize"> Reset </v-btn>
    </template>
    <!-- eslint-disable-next-line -->
    <template v-slot:item.coin_name="{ item }">
      <img
        style="width: 30px; padding-right: 8px; vertical-align: middle"
        :src="getSrc(item.coin_symbol)"
      />
      {{ item.coin_name }}
    </template>
    <!-- eslint-disable-next-line -->
    <template v-slot:item.coin_price="{ item }">
      <div :class="getStatus(item.status, item.id)" class="pa-2">
        ${{ item.coin_price }}
      </div>
    </template>
    <!-- eslint-disable-next-line -->
    <template v-slot:item.percent_change_30d="{ item }">
      <span :class="getColor(item.percent_change_30d)">
        {{ item.percent_change_30d }} %
      </span>
    </template>
    <!-- eslint-disable-next-line -->
    <template v-slot:item.percent_change_ytd="{ item }">
      <span :class="getColor(item.percent_change_ytd)">
        {{ item.percent_change_ytd }} %
      </span>
    </template>
    <!-- eslint-disable-next-line -->
    <template v-slot:item.percent_change_1year="{ item }">
      <span :class="getColor(item.percent_change_1year)">
        {{ item.percent_change_1year }} %
      </span>
    </template>
    <!-- eslint-disable-next-line -->
    <template v-slot:item.rsi_2h="{ item }">
      <span :class="getRsiColor(item.rsi_2h)">
        {{ item.rsi_2h }}
      </span>
    </template>
  </v-data-table>
</template>
<script>
import { getData } from "@/views/api";
export default {
  data: () => ({
    headers: [
      {
        text: "#",
        align: "start",
        sortable: false,
        value: "rank",
      },
      { text: "Name", width: "200px", value: "coin_name", align: "start" },
      { text: "PRICE", value: "coin_price", align: "end" },
      { text: "SCORE", value: "percent_change_30d", align: "end" },
      { text: "TREND MEAN", value: "percent_change_ytd", align: "end" },
      { text: "TREND SPOT", value: "percent_change_1year", align: "end" },
      { text: "TREND SHORT", value: "rsi_2h", align: "end" },
      { text: "TREND MEDIUM", value: "macd_hist_2h", align: "end" },
      { text: "TREND CRITIAL", value: "atr_2h", align: "end" },
      {
        text: "TREND LONGGEST",
        value: "bollinger_bands_lower_2h",
        align: "end",
      },
      { text: "BASELINE", value: "ma_1h_12", align: "end" },
      { text: "SAFETY", value: "ema_1h_12", align: "end" },
    ],
    pagination: {
      page: 1,
      perpage: 25,
    },
    data_table: [],
    connection: null,
    loading: true,
    footerProps: {
      showFirstLastPage: true,
      // disableItemsPerPage: true,
      showCurrentPage: true,
      itemsPerPageOptions: [25, 35, 50, -1],
    },
  }),
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  created() {
    this.initialize();
  },
  mounted() {
    this.connection = new WebSocket("wss://ws.coincap.io/prices?assets=ALL");
    this.connection.onmessage = this.onSocketMessage;
  },
  methods: {
    async initialize() {
      this.loading = true;
      const coin_data = await getData();
      this.data_table = coin_data.map((x) => ({
        rank: x.rank,
        coin_symbol: x.coin_symbol,
        coin_name: x.coin_name,
        coin_price: this.getRealValue(x.coin_price),
        percent_change_30d: this.getRealValue(x.percent_change_30d),
        percent_change_ytd: this.getRealValue(x.percent_change_ytd),
        percent_change_1year: this.getRealValue(x.percent_change_1year),
        rsi_2h: x.rsi_2h,
        macd_hist_2h: x.macd_hist_2h,
        atr_2h: x.atr_2h,
        bollinger_bands_lower_2h: x.bollinger_bands_lower_2h,
        ma_1h_12: x.ma_1h_12,
        ema_1h_12: x.ema_1h_12,
      }));

      this.loading = false;
    },
    getRealValue(value) {
      if (Math.abs(value) > 1) {
        return Math.round(value * 100) / 100;
      } else if (value == 0) {
        return 0;
      } else {
        const pos = Math.floor(Math.log10(Math.abs(value))) * -1 + 1;
        return Math.floor(value * Math.pow(10, pos)) / Math.pow(10, pos);
      }
    },
    async onSocketMessage(event) {
      if (this.data_table && event.data) {
        const prices = JSON.parse(event.data);
        this.data_table.forEach((x) => {
          if (x && prices[x.coin_name.toLowerCase()]) {
            x.coin_price = this.getRealValue(prices[x.coin_name.toLowerCase()]);
            x.status = true;
          } else {
            x.status = false;
          }
        });
      }
    },
    getStatus(status, id) {
      const idx = this.data_table.findIndex((item) => item.id == id);
      if (idx > -1) {
        if (status == true) {
          // this.data_table[idx].status = false;
          return "changed";
        }
      }
      return "normal";
    },
    getColor(color_val) {
      if (Number(color_val) >= 0) {
        return "color-green";
      } else {
        return "color-red";
      }
    },
    getRsiColor(color_val) {
      if (Number(color_val) > 70) {
        return "color-green";
      } else if (Number(color_val) < 30) {
        return "color-red";
      } else {
        return "color-orange";
      }
    },
    getSrc(src) {
      return (
        "https://quantifycrypto.s3-us-west-2.amazonaws.com/pictures/crypto-img/32/icon/" +
        src.toLowerCase() +
        ".png"
      );
    },
    async updatePage() {
      if (this.loading) return;
      this.loading = true;

      for (
        let i = (this.pagination.page - 1) * 10;
        i < Math.min(this.pagination.page * 10, this.data_table.length);
        i++
      ) {
        let formdata = new FormData();
        formdata.append("symbol", this.data_table[i].coin_symbol);
        let detailRequest = {
          method: "POST",
          body: formdata,
          redirect: "follow",
        };
        if (this.data_table[i].percent_change_30d == undefined) {
          await fetch(
            "https://pro.coingen.net/api/quantifycrypto-coin",
            detailRequest
          )
            .then((response) => response.json())
            .then((result) => {
              if (result) {
                this.data_table[i].coin_price = this.getRealValue(
                  result.coin_price
                );
                this.data_table[i].percent_change_30d = this.getRealValue(
                  result.percent_change_30d
                );
                this.data_table[i].percent_change_ytd = this.getRealValue(
                  result.percent_change_ytd
                );
                this.data_table[i].percent_change_1year = this.getRealValue(
                  result.percent_change_1year
                );
                this.data_table[i].rsi_2h = result.rsi_2h;
                this.data_table[i].macd_hist_2h = result.macd_hist_2h;
                this.data_table[i].atr_2h = result.atr_2h;
                this.data_table[i].bollinger_bands_lower_2h =
                  result.bollinger_bands_lower_2h;
                this.data_table[i].ma_1h_12 = result.ma_1h_12;
                this.data_table[i].ema_1h_12 = result.ema_1h_12;
              }
            })
            .catch((error) => console.log("error", error));
        }
      }
      this.loading = false;
    },
  },
};
</script>
<style>
@keyframes price-change {
  from {
    background-color: #4caf50;
  }
  to {
    background-color: black;
  }
}
.changed {
  animation-name: price-change;
  animation-duration: 2s;
}
.normal {
  color: white;
}
.color-red {
  color: #f44336;
}
.color-green {
  color: #4caf50;
}
.color-orange {
  color: #ff9800;
}
 .custom_table_class thead th {
  text-align: center;
}
/*
.custom_table_class thead th:first-child {
  border-radius: 6px 0 0 0;
}
.custom_table_class thead th:lsat-child {
  border-radius: 0 6px 0 0;
} */
/* .custom_table_class thead th ::after {
  content: "|";
  color: grey;
  margin-left: 50px;
} */
</style>
