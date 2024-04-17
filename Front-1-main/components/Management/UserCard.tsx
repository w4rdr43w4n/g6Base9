import Image from 'next/image'
import "../styles/mgmt_components.css";
import { FC } from 'react'

interface Session {
  user?:{
    name?:string,
    email?:string,
    image?:string,
  }
}


const UserCard:FC = (session:Session) =>{
  let userImage = ''
  let username = ''
  if(session.user?.name){
  username = (session.user.name)? session.user.name:''
  userImage = (session.user.image)? session.user.image:''
  }
  return (

    <section className="user-card">
       <Image width={200} height={200} src={userImage} alt={username ?? "Profile Pic"} />
    </section>
  )
}
export default UserCard