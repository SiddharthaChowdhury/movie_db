import { ShallowWrapper, shallow, ReactWrapper, mount } from "enzyme";
import React from "react";

export interface ISetupConf {
	component: any;
	props: any;
}
export const setupShallow = (config: ISetupConf):ShallowWrapper => {
	const {component: Component, props} = config;

	const wrapper = shallow(
		<Component {...props} />
	);
	return wrapper;
}

export const setupMount = (config: ISetupConf):ReactWrapper => {
	const {component: Component, props = {}} = config;

	const wrapper = mount(
		<Component {...props} />
	);
	return wrapper;
}

export const getElementByTestAttr = (wrapper: any, val: string) => {
  	return wrapper.find(`[data-test='${val}']`);
}