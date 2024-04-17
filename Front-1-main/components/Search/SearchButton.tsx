import {FC} from 'react';
import '../styles/srch_components.css'

interface props{
  label:string,
  onClick:(e:unknown)=>void;
}

const SearchButton:FC<props> = ({ label, onClick }) => {
  return (
    <button className='search-button' value={label} onClick={onClick}>{label}</button>
  );
}
  
export default SearchButton;
