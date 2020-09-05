import React from 'react';
import {Search} from './Search';
import { ShallowWrapper} from 'enzyme';
import { setupShallow, getElementByTestAttr } from '../../test/utilTest';

describe('Testing component Search', () => {
    let wrapper: ShallowWrapper;
    let mock_OnChange: jest.Mock;
    let mock_OnSearch: jest.Mock;

    beforeEach(() => {
        mock_OnChange = jest.fn();
        mock_OnSearch = jest.fn();
        wrapper = setupShallow({component: Search, props: {value: 'Hobbits', onChangeText: mock_OnChange, onSearch: mock_OnSearch}});
    })

    afterEach(() => {
        jest.clearAllMocks();
    })

    test('Should render correctly', () => {
        expect(getElementByTestAttr(wrapper, 'search-container').find('input').length).toBe(1);
        expect(getElementByTestAttr(wrapper, 'search-container').find('button').length).toBe(1);
    })

    test('Should call correct props when input is changed', () => {
        const input = getElementByTestAttr(wrapper, 'search-container').find('input');
        const mockEvent = {target: {value: 'Hobbits'}}; 
        input.simulate('change', mockEvent);

        expect(mock_OnChange).toHaveBeenCalledWith(mockEvent.target.value)
    })

    test('Should call correct props when search button is pressed', () => {
        const input = getElementByTestAttr(wrapper, 'search-container').find('button');
        input.simulate('click');

        expect(mock_OnSearch).toHaveBeenCalledTimes(1)
    })
})