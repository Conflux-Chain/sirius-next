import React from 'react';
import { useTranslation } from 'react-i18next';
import { getDuration } from '../../utils';
import { Text } from '../Text';
import { getTranslations } from '../../store';

interface AgeProps {
  from: number;
  to?: number;
  retainDurations?: 1 | 2 | 3 | 4;
}
export const Age = React.memo(({ from, to, retainDurations = 2 }: AgeProps) => {
  const translations = getTranslations();
  const { t } = useTranslation();
  const duration = getDuration(from, to);
  const str = [
    translations.general.countdown.day,
    translations.general.countdown.hour,
    translations.general.countdown.minute,
    translations.general.countdown.second,
  ];

  const label = duration.reduce(
    (acc, cur, index) => {
      // default max to retain 2 duration, and min to retain 1 duration
      if (Number(acc[1]) < retainDurations && (cur > 0 || index === 3)) {
        const next = t(str[index] || '', { count: cur });
        acc[0] = acc[0] ? `${acc[0]} ${next}` : `${next}`;
        acc[1] = Number(acc[1]) + 1;
      }
      return acc;
    },
    ['', 0],
  );

  const fullLabel = duration.reduce(
    (acc, cur, index) => {
      if (Number(acc[1]) < 4 && (cur > 0 || index === 3)) {
        const next = t(str[index] || '', { count: cur });
        acc[0] = acc[0] ? `${acc[0]} ${next}` : `${next}`;
        acc[1] = Number(acc[1]) + 1;
      }
      return acc;
    },
    ['', 0],
  );

  return (
    <Text
      tag="span"
      hoverValue={`${fullLabel[0]} ${t(translations.general.countdown.ago)}`}
    >
      {label[0]} {t(translations.general.countdown.ago)}
    </Text>
  );
});
