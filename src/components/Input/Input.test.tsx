import React from 'react';
import { shallow, mount } from 'enzyme';

import { findByTestAttr } from '../../helpers/testUtils';
import Input, { InputProps } from './Input';
import { AccountType } from '../../enums';

const defaultProps: InputProps = {
  account: {
    currencyCode: 'EUR',
    balance: 555.25,
    currencySymbol: '€',
    transactions: [],
  },
  amount: 0,
  accountType: AccountType.Current,
  setWalletAccountType: jest.fn(),
  setIsWalletOpened: jest.fn(),
  convert: jest.fn(),
};

const setup = (props: any = {}) => {
  return shallow(<Input {...defaultProps} {...props} />);
};

describe('Component: Input', () => {
  let wrapper: any;
  describe('has account(s) and amount is 0', () => {
    beforeEach(() => {
      wrapper = setup();
    });
    test('shows current balance', () => {
      const currentBalance = findByTestAttr(wrapper, 'current-balance');
      expect(currentBalance.text()).toBe('555.25 €');
    });
  });

  describe('has account(s) and amount is > 0', () => {
    beforeEach(() => {
      wrapper = setup({ amount: 100 });
    });

    test('shows full balance', () => {
      const balance = findByTestAttr(wrapper, 'balance');
      expect(balance.text()).toBe('Balance: 555.25 € → 455.25 €');
    });

    test('shows current balance with class line-through', () => {
      const currentBalance = findByTestAttr(wrapper, 'current-balance');
      expect(currentBalance.hasClass('line-through')).toBe(true);
    });
  });

  describe('has account(s) and amount is 0', () => {
    beforeEach(() => {
      wrapper = setup({ amount: 0 });
    });

    test('does not show next balance', () => {
      const nextBalance = findByTestAttr(wrapper, 'next-balance');
      expect(nextBalance.exists()).toBe(false);
    });
  });
});
