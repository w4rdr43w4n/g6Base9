import '../styles/srch_components.css'
import {FC} from 'react'

interface props{
  value:string,
  onChange:(e:unknown) => void,
}

const SearchBar:FC<props> = ({value,onChange}) => {
  return (
    <input type="text" className='search-box' placeholder='Search...' value={value} onChange={onChange} />
  );
}



export default SearchBar;
