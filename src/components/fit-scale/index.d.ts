/**
 * 使用方法
 * fitScale.init({
 *   dh: 1920,
 *   dw: 5540,
 *   el: '#app',
 *   resize: true
 * })
 */

export interface IgnoreOption {
  el: string;
  width?: string;
  height?: string;
  scale?: number;
  fontSize?: number;
}

export interface AutoScaleOption {
  el?: string;
  dw?: number;
  dh?: number;
  resize?: boolean;
  ignore?: (IgnoreOption | string)[];
  transition?: number;
  delay?: number;
  limit?: number;
}

declare interface fitScale {
  /**
   * 参数列表
   * @param options
   * el：渲染的元素，默认body
   * dw：设计稿的宽度，默认1920
   * dh：设计稿的高度，默认1080
   * resize：是否监听resize事件，默认true
   * ignore：忽略缩放的元素
   * transition：过渡时间，默认0
   * delay：延迟，默认0
   */
  init(options?: AutoScaleOption | String): void;
  /**
   * @param id
   * 关闭缩放影响
   *
   */
  off(id?: string): void;
  /**
   * 检查是否正在运行
   */
  isFitScaleRunning: boolean;
}

declare const fitScale: fitScale;

/**
 * @param {string} el - 待处理的元素选择器
 * @param {boolean} isKeepRatio - 是否保持纵横比（可选，默认为true，false时将充满父元素）
 * @param {number|undefined} level - 缩放等级，用于手动调整缩放程度(可选，默认为 1)
 */
declare function elRectification(el: string, isKeepRatio?: boolean, level?: number): void;

export default fitScale;

export { elRectification };
