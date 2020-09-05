import React from 'react';
import App from './App';
import { ShallowWrapper, shallow, ReactWrapper, mount } from 'enzyme';
import { utilApp, TypeActionApp, IdAppView } from './utilApp';

export interface ISetupConf {
	component: any;
	props: any;
}
export const setupShallow = (config: any):ShallowWrapper => {
	const {component: Component, props = {}} = config;

	const wrapper = shallow(
		<Component {...props} />
	);
	return wrapper;
}

	export const setupMount = (config: any):ReactWrapper => {
	const {component: Component, props = {}} = config;

	const wrapper = mount(
		<Component {...props} />
	);
	return wrapper;
}

export const getElementByTestAttr = (wrapper: any, val: string) => {
  	return wrapper.find(`[data-test='${val}']`);
}

describe('App component test', () => {
	let wrapper: ShallowWrapper;

	beforeEach(() => {
		wrapper = setupShallow({component: App});
	})

  	test('Should load component successfully', () => {
		const appContainer = getElementByTestAttr(wrapper, 'app-container')
		expect(appContainer.length).toBe(1);
	})

	test('Should load top nav with 2 buttons', () => {
		const appNav = getElementByTestAttr(wrapper, 'app-nav')
		expect(appNav.length).toBe(1);
		expect(appNav.find('button').length).toBe(2);
	})

	test('Search button should be active', () => {
		const appNav = getElementByTestAttr(wrapper, 'app-nav')
		expect(appNav.find('button.active').text()).toBe('Search');
	});
});

describe('App state test using useReducer', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	test('Should change current view on nav buttons click', () => {
		const mock_Dispatch = jest.fn();
		React.useReducer = jest.fn(() => [utilApp.initialState, mock_Dispatch]);

		const wrapper = setupMount({component: App});
		const appFavBtn = getElementByTestAttr(wrapper, 'app-fav-btn');
		const appSearchBtn = getElementByTestAttr(wrapper, 'app-search-btn');

		expect(appFavBtn.length).toBe(1);
		appFavBtn.simulate('click');
		expect(mock_Dispatch).toHaveBeenCalledWith({type: TypeActionApp.SetView, payload: IdAppView.Favourite});

		expect(appSearchBtn.length).toBe(1);
		appSearchBtn.simulate('click');
		expect(mock_Dispatch).toHaveBeenCalledWith({type: TypeActionApp.SetView, payload: IdAppView.Search});
	});
});

describe('App movie search test', () => {
	beforeEach(function () {
	})
	afterEach(() => {
		jest.clearAllMocks();
	})

	test('Should change state on input change', () => {
		const mock_Dispatch = jest.fn();
		React.useReducer = jest.fn(() => [utilApp.initialState, mock_Dispatch]);

		const wrapper = setupMount({component: App});
		const searchInput = getElementByTestAttr(wrapper, 'search-container').find('input');
		const mockEvent = {target: {value: 'Hobbits'}};

		searchInput.simulate('change', mockEvent);

		expect(mock_Dispatch).toHaveBeenCalledWith({payload: "Hobbits", type: TypeActionApp.SetSearch});
	})

	test('Should trigger no API request on search with keyword empty', () => {
		let promise = Promise.resolve()
		const mock_Dispatch = jest.fn();
		React.useReducer = jest.fn(() => [utilApp.initialState, mock_Dispatch]);

		const wrapper = setupMount({component: App});
		const searchBtn = getElementByTestAttr(wrapper, 'search-container').find('button');

		expect(searchBtn.length).toBe(1);

		const mock_getMovies = jest.fn(() => promise);
		utilApp.appGetMovies = mock_getMovies;

		searchBtn.simulate('click')

		expect(mock_getMovies).toHaveBeenCalledTimes(0); // because empty keyword
		expect(mock_Dispatch).toHaveBeenCalledWith({type: TypeActionApp.SetView, payload: IdAppView.Search})
	});

	test('Should trigger API request on search with keyword', () => {
		// let promise = Promise.resolve()
		const mock_Dispatch = jest.fn();
		React.useReducer = jest.fn(() => [{...utilApp.initialState, searchKey: 'Hobbits'}, mock_Dispatch]); // Adding search key

		const wrapper = setupMount({component: App});
		const searchBtn = getElementByTestAttr(wrapper, 'search-container').find('button');

		expect(searchBtn.length).toBe(1);

		const mock_getMovies = jest.fn();
		utilApp.appGetMovies = mock_getMovies;

		searchBtn.simulate('click')

		expect(mock_getMovies).toHaveBeenCalledTimes(1); // because NON_Empty keyword
		expect(mock_getMovies).toHaveBeenCalledWith('Hobbits', utilApp.initialState.total, mock_Dispatch);
	});
})