import { fitUtilConfig } from '@/constant/layout'

/**
 * 使用参考
 * const { px2ChartSize, px2font, px2vw, px2vh } = inject<IFitUtil>('fitUtil')!
 */
type IFitUtilConfig = {
  width: number
  height: number
}

const config: IFitUtilConfig = fitUtilConfig

/**
 * px转vw
 * @param px - 像素值
 * @param defaultWidth - 默认宽度
 * @returns 转换后的 vw 值
 */
export const px2vw = (px: number, defaultWidth: number = config.width): string => {
  return (px * 100.0) / defaultWidth + 'vw'
}

/**
 * px转vh
 * @param px - 像素值
 * @param defaultHeight - 默认高度
 * @returns 转换后的 vh 值
 */
export const px2vh = (px: number, defaultHeight: number = config.height): string => {
  return (px * 100.0) / defaultHeight + 'vh'
}

/**
 * px转font
 * @param px - 像素值
 * @param defaultWidth - 默认宽度
 * @returns 转换后的 font 大小
 */
export const px2font = (px: number, defaultWidth: number = config.width): string => {
  return (px * 100.0) / defaultWidth + 'vw'
}

/**
 * 图表字体、间距自适应
 * @param px - 像素值
 * @param defaultWidth - 默认宽度
 * @returns 转换后的尺寸
 */
export const px2ChartSize = (px: number, defaultWidth: number = config.width): number => {
  const clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
  if (!clientWidth) return px
  const scale = clientWidth / defaultWidth
  return Number((px * scale).toFixed(3))
}

export default {
  px2vw,
  px2vh,
  px2font,
  px2ChartSize
}
