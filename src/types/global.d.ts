/*
 * @Author: jrucker
 * @Description:
 * @Date: 2021/10/28 22:49:45
 * @LastEditors: jrucker
 * @LastEditTime: 2023/08/11 11:16:15
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



