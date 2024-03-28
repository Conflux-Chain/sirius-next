interface headerType { title: { text: string }, subtitle: { text: string } } 
const Title = ({ header }: { header: headerType } ) => {
    return (
        <div className='relative'>
        <div className="text-[1.7143rem] text-[#1a1a1a] font-medium leading-[2.2857rem] mb-[1.1429rem] mt-[2.2857rem]">
            {header.title.text}
            <div className="text-[1rem] text-[#74798c] leading-[1.2857rem] mt-[0.8571rem]">
                {header.subtitle.text} 
            </div>
        </div>
    </div>
    );
};
  
export default Title;