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
    <template v-slot:[`item.icon`]>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        height="24"
        width="24"
        role="img"
        fill="#6e6e6e"
        aria-hidden="true"
      >
        <path
          d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"
        ></path>
      </svg>
    </template>
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
        $ {{ flooNumber(item.coin_price) }}
      </div>
    </template>
    <!-- eslint-disable-next-line -->
    <template v-slot:[`item.macd_hist_5min`]="{ item }">
      <span :class="getColorMACD(item.macd_hist_5min)">
        {{ item.macd_hist_5min }}
      </span>
    </template>
    <template v-slot:[`item.macd_hist_15min`]="{ item }">
      <span :class="getColorMACD(item.macd_hist_15min)">
        {{ item.macd_hist_15min }}
      </span>
    </template>
    <template v-slot:[`item.macd_hist_30min`]="{ item }">
      <span :class="getColorMACD(item.macd_hist_30min)">
        {{ item.macd_hist_30min }}
      </span>
    </template>
    <template v-slot:[`item.macd_hist_1h`]="{ item }">
      <span :class="getColorMACD(item.macd_hist_1h)">
        {{ item.macd_hist_1h }}
      </span>
    </template>
    <template v-slot:[`item.macd_hist_2h`]="{ item }">
      <span :class="getColorMACD(item.macd_hist_2h)">
        {{ item.macd_hist_2h }}
      </span>
    </template>
    <template v-slot:[`item.macd_hist_4h`]="{ item }">
      <span :class="getColorMACD(item.macd_hist_4h)">
        {{ item.macd_hist_4h }}
      </span>
    </template>
    <template v-slot:[`item.macd_hist_24h`]="{ item }">
      <span :class="getColorMACD(item.macd_hist_24h)">
        {{ item.macd_hist_24h }}
      </span>
    </template>

    <template v-slot:[`item.bollinger_bands_5min`]="{ item }">
      <span :class="getColorBB(item.bollinger_bands_5min)">
        {{ item.bollinger_bands_5min }}
      </span>
    </template>
    <template v-slot:[`item.bollinger_bands_15min`]="{ item }">
      <span :class="getColorBB(item.bollinger_bands_15min)">
        {{ item.bollinger_bands_15min }}
      </span>
    </template>

    <!-- eslint-disable-next-line -->
    <template v-slot:item.bollinger_bands_30min="{ item }">
      <span :class="getColorBB(item.bollinger_bands_30min)">
        {{ item.bollinger_bands_30min }}
      </span>
    </template>
    <!-- eslint-disable-next-line -->
    <template v-slot:item.bollinger_bands_1h="{ item }">
      <span :class="getColorBB(item.bollinger_bands_1h)">
        {{ item.bollinger_bands_1h }}
      </span>
    </template>
    <!-- eslint-disable-next-line -->
    <template v-slot:item.bollinger_bands_2h="{ item }">
      <span :class="getColorBB(item.bollinger_bands_2h)">
        {{ item.bollinger_bands_2h }}
      </span>
    </template>
  </v-data-table>
</template>
<script>
import {
  getData,
  getStatus,
  getColor,
  getRsiColor,
  getSrc,
  getMACD,
  getColorMACD,
  getBB,
  getColorBB,
  flooNumber,
} from "@/views/function";
export default {
  data: () => ({
    getStatus,
    getColor,
    getRsiColor,
    getSrc,
    getMACD,
    getColorMACD,
    getBB,
    getColorBB,
    flooNumber,
    headers: [
      {
        text: "",
        align: "start",
        sortable: false,
        value: "icon",
      },
      {
        text: "1-500",
        align: "start",
        sortable: false,
        value: "rank",
      },
      { text: "NAME", width: "250px", value: "coin_name", align: "start" },
      { text: "PRICE", value: "coin_price", align: "end" },
      { text: "MACD5M", value: "macd_hist_5min", align: "end" },
      { text: "MACD15M", value: "macd_hist_15min", align: "end" },
      { text: "MACD30M", value: "macd_hist_30min", align: "end" },
      { text: "MACD1H", value: "macd_hist_1h", align: "end" },
      { text: "MACD2H", value: "macd_hist_2h", align: "end" },
      { text: "MACD4H", value: "macd_hist_4h", align: "end" },
      { text: "MACD24H", value: "macd_hist_24h", align: "end" },

      {
        text: "BB5M",
        value: "bollinger_bands_5min",
        align: "end",
      },
      { text: "BB15M", value: "bollinger_bands_15min", align: "end" },
      { text: "BB30M", value: "bollinger_bands_30min", align: "end" },
      { text: "BB1H", value: "bollinger_bands_1h", align: "end" },
      { text: "BB2H", value: "bollinger_bands_2h", align: "end" },
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
      showCurrentPage: true,
      itemsPerPageOptions: [25, 35, 50, -1],
    },
  }),
  created() {
    this.initialize();
  },
  mounted() {
    // this.connection = new WebSocket("wss://ws.coincap.io/prices?assets=ALL");
    // this.connection.onmessage = this.onSocketMessage;
  },
  methods: {
    async initialize() {
      this.loading = true;
      const coin_data = await getData();
      this.data_table = coin_data.map((x) => ({
        rank: x.rank,
        coin_symbol: x.coin_symbol,
        coin_name: x.coin_name,
        coin_price: x.coin_price,
        macd_hist_5min: this.getMACD(x.macd_hist_5min),
        macd_hist_15min: this.getMACD(x.macd_hist_15min),
        macd_hist_30min: this.getMACD(x.macd_hist_30min),
        macd_hist_1h: this.getMACD(x.macd_hist_1h),
        macd_hist_2h: this.getMACD(x.macd_hist_2h),
        macd_hist_4h: this.getMACD(x.macd_hist_4h),
        macd_hist_24h: this.getMACD(x.macd_hist_24h),
        // BB
        bollinger_bands_5min: getBB(
          x.coin_price,
          x.bollinger_bands_upper_5min,
          x.bollinger_bands_lower_5min
        ),
        bollinger_bands_15min: getBB(
          x.coin_price,
          x.bollinger_bands_upper_15min,
          x.bollinger_bands_lower_15min
        ),
        bollinger_bands_30min: getBB(
          x.coin_price,
          x.bollinger_bands_upper_30min,
          x.bollinger_bands_lower_30min
        ),
        bollinger_bands_1h: getBB(
          x.coin_price,
          x.bollinger_bands_upper_1h,
          x.bollinger_bands_lower_1h
        ),
        bollinger_bands_2h: getBB(
          x.coin_price,
          x.bollinger_bands_upper_2h,
          x.bollinger_bands_lower_2h
        ),
      }));

      this.loading = false;
      setTimeout(() => this.initialize(), 5 * 60 * 1000);
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
    // async onSocketMessage(event) {
    // if (this.data_table && event.data) {
    //   const prices = JSON.parse(event.data);
    //   this.data_table.forEach((x) => {
    //     if (x && prices[x.coin_name.toLowerCase()]) {
    //       x.coin_price = this.getRealValue(prices[x.coin_name.toLowerCase()]);
    //       x.status = true;
    //     } else {
    //       x.status = false;
    //     }
    //   });
    // }
    // },
    async updatePage() {
      // if (this.loading) return;
      // this.loading = true;
      // let [step, ranger] = [
      //   (this.pagination.page - 1) * 10,
      //   Math.min(this.pagination.page * 10, this.data_table.length),
      // ];
      // for (let i = step; i < ranger; i++) {
      //   let formdata = new FormData();
      //   formdata.append("symbol", this.data_table[i].coin_symbol);
      //   let detailRequest = {
      //     method: "POST",
      //     body: formdata,
      //     redirect: "follow",
      //   };
      //   if (this.data_table[i].percent_change_30d == undefined) {
      //     await fetch(
      //       "https://pro.coingen.net/api/quantifycrypto-coin",
      //       detailRequest
      //     )
      //       .then((response) => response.json())
      //       .then((result) => {
      //         if (result) {
      //           this.data_table[i].coin_price = this.getRealValue(
      //             result.coin_price
      //           );
      //           this.data_table[i].percent_change_30d = this.getRealValue(
      //             result.percent_change_30d
      //           );
      //           this.data_table[i].percent_change_ytd = this.getRealValue(
      //             result.percent_change_ytd
      //           );
      //           this.data_table[i].percent_change_1year = this.getRealValue(
      //             result.percent_change_1year
      //           );
      //           this.data_table[i].rsi_2h = result.rsi_2h;
      //           this.data_table[i].macd_hist_2h = result.macd_hist_2h;
      //           this.data_table[i].atr_2h = result.atr_2h;
      //           this.data_table[i].bollinger_bands_lower_2h =
      //             result.bollinger_bands_lower_2h;
      //           this.data_table[i].ma_1h_12 = result.ma_1h_12;
      //           this.data_table[i].ema_1h_12 = result.ema_1h_12;
      //         }
      //       })
      //       .catch((error) => console.log("error", error));
      //   }
      // }
      // this.loading = false;
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

/* .custom_table_class thead {
  white-space: pre-line !important;
  line-height: 1.5em;
  max-height: 3em;
  overflow: hidden;
  width: 100%;
  text-overflow: ellipsis;
  text-align: right;
  font-size: 20px !important;
} */
</style>
