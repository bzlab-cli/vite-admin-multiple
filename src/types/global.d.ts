/*
 * @Author: jrucker
 * @Description:
 * @Date: 2024/10/28 22:49:45
 * @LastEditors: jrucker
 * @LastEditTime: 2024/07/05 11:51:19
 */

declare interface IResponseModel<T> {
  retCode: number
  retMsg: string
  data?: T
}
declare interface IObjModel {
  [propName: string]: any
}

declare type Recordable<T = any> = Record<string, T>
declare const bz: any

declare namespace Menu {
	interface MenuOptions {
		path: string;
		component?: string | (() => Promise<any>);
		name: string;
		redirect?: string;
		meta: MetaProps;
		children?: MenuOptions[];
	}
	interface MetaProps {
    title: string;
		icon: string;
		hidden: boolean;
		cache: boolean;
	}
}

declare interface IFitUtil {
  px2vw: (px: number, defaultWidth?: number) => string
  px2vh: (px: number, defaultHeight?: number) => string
  px2font: (px: number, defaultWidth?: number) => string
  px2ChartSize: (px: number, defaultWidth?: number) => number
}

declare const __APP_INFO__: any
declare const __SCSS_VARS__: any


