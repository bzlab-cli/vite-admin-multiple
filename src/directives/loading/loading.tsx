import { defineComponent, ref } from 'vue'
import style from './loading.module.scss'

const Loading = defineComponent({
  name: 'loading',
  setup: (props, { expose }) => {
    const title = ref<string>('正在加载...')
    const setTitle = (val: string) => {
      title.value = val
    }
    expose({ setTitle })
    return () => (
      <div class={style.loading}>
        <div class={style['loading-content']}>
          <span class={style.dot}>
            <i></i>
            <i></i>
            <i></i>
            <i></i>
          </span>
          {/* <p class={style.desc}>{unref(title)}</p> */}
        </div>
      </div>
    )
  }
})
export default Loading
