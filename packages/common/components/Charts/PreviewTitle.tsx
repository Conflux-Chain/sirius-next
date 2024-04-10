import { useTranslation } from 'react-i18next';
import { useI18n } from '../../store';
import { Link } from '../Link'
interface headerType { title: { text: string }, subtitle: { text: string }, breadcrumb: { name: string, path: string }[] }
const Title = ({ header }: { header: headerType } ) => {
    const { t } = useTranslation();
    const { translations } = useI18n()
    
    return (
        <div className='flex items-start justify-between pt-4 pr-5 pb-0 pl-5'>
            <div>
                <div className="text-[16px] text-[#26244B] ">
                    {header.title.text}
                </div>
                <div className="text-[14px] text-[#74798C]">
                    {header.subtitle.text} 
                </div>
            </div>
            <Link className="shrink-0" href={header?.breadcrumb?.[1]?.path || '/'}>
                {t(translations.highcharts.preview.viewDetail)}
            </Link>

         </div>
    );
};
  
export default Title;