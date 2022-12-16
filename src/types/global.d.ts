/*
 * @Author: jrucker
 * @Description:
 * @Date: 2021/10/28 22:49:45
 * @LastEditors: jrucker
 * @LastEditTime: 2022/12/15 16:03:41
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

