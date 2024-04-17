import {FC} from 'react';
import '../styles/srch_components.css'


interface props{
  value:string
}

const Result:FC<props> = ({value}) => {
  const item = JSON.parse(value)
  
  return (
    <div className='result'>
      <h4>Title:{item.title}</h4>
      <h4>Author:{item.author}</h4>
      <h4>Published:{item.published}</h4>
      {(item['pdf_url'] !=='') && (
        <h4>PDF:<a href={item.pdf_url}>Download</a></h4>
      )}
    </div>
  );
};

export default Result;
