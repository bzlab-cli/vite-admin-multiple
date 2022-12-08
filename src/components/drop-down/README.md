### 使用方法

```
const searchColumns = [{
    label: '商户',
    prop: 'merchantsName',
    search: {
      el: 'dropdown',
      props: {
        request: requestCommercial,
        placeholder: '请选择商户'
      },
      event: {
        response: responseCommercial
      }
    }
 }]
let requestCommercial = reactive({
  url: 'merchantsInfo/getMerchantsSelect2',
  params: { limitCnt: 10, projectId: 26 },
  methods: 'get',
  key: 'value',
  requestKey: 'deptName'
})
function responseCommercial(item) {
  if (item) {
    bzTableRef.value.searchParams.merchantsId = item.item.key
    bzTableRef.value.searchParams.merchantsName = item.item.value
  } else {
    bzTableRef.value.searchParams.merchantsId = null
    bzTableRef.value.searchParams.merchantsName = null
  }
}
```