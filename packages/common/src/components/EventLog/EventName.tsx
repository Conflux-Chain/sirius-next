import { useTranslation } from 'react-i18next';
import { useI18n } from 'src/store';

export const EventName = ({
  name,
  args,
}: {
  name: string;
  args: {
    indexed?: false | number;
    type?: string;
    argName?: string;
  }[];
}) => {
  const { t } = useTranslation();
  const { translations } = useI18n();
  if (!name) return t(translations.transaction.logs.unknownEvent);
  return (
    <div>
      <span className="fn-name">{name}</span>
      <span className="m-[0.1rem] ml-[0.3571rem]">(</span>
      {args.map((a, index) => {
        let topic_index = a.indexed ? (
          <span className="mr-[0.3571rem]">{`index_topic_${a.indexed} `}</span>
        ) : null;
        let type = (
          <span className="text-[#d96349] mr-[0.3571rem]">{a.type} </span>
        );
        let arg = <span className="text-[#e79d35]">{a.argName}</span>;
        let comma =
          index !== args.length - 1 ? (
            <span className="mr-[0.3571rem]">, </span>
          ) : null;
        return (
          <span key={index}>
            {topic_index}
            {type}
            {arg}
            {comma}
          </span>
        );
      })}
      <span className="m-[0.1rem] mr-[0.3571rem]">)</span>
    </div>
  );
};
