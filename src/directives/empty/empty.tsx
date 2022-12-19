import { defineComponent, ref, unref } from 'vue'
import { ElEmpty } from 'element-plus'
import style from './empty.module.scss'

const Empty = defineComponent({
  name: 'empty',
  setup: (props, { expose }) => {
    const title = ref<string>('暂无数据')
    const size = ref<number>(100)
    const setTitle = (val: string) => {
      title.value = val
    }
    expose({ setTitle })
    return () => (
      <div class={style['no-result']}>
        <ElEmpty image-size={unref(size)} description={unref(title)} />
      </div>
    )
  }
})

export default Empty
