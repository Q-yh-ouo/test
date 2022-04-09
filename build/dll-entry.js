const entry = {
    vue: [
        'vue/dist/vue.esm.js', 
        'vue-router', 
        'vuex',
        'axios'
    ],
    element: [
        'element-ui'
    ],
    charts: [
        'echarts',
        'v-charts'
    ],
    commonPlugin: [            
        'xlsx'
    ],
    grid: [
        'ag-grid-community',
        'ag-grid-enterprise',
        'ag-grid-vue'
    ]
};

module.exports = entry;