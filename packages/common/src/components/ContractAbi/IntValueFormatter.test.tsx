import { render, within } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { IntValueFormatter } from './IntValueFormatter';

vi.mock('../DecimalsSelect', () => ({
  DecimalsSelect: () => null,
}));

describe('IntValueFormatter', () => {
  test.each([0, 0n])('formats zero value %s', value => {
    const { container, unmount } = render(<IntValueFormatter value={value} />);

    expect(within(container).getByText('0')).toBeTruthy();
    unmount();
  });
});
