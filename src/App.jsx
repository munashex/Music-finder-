import React, {useEffect} from "react"
import { Container, InputGroup, FormControl, Button, Row, Col, Card } from "react-bootstrap"
import './App.css'


const App = () => {

  const CLIENT_ID = "d40282a24a3c4fe09b7d47568c04c651" 
  const CLIENT_SECRET = "6046124f71ae4205891b00ffc8919c09"  

  const [accessToken, setAccessToken] = React.useState('')
  const [searchInput, setSearchInput] = React.useState('')
  const [album, setAlbum] = React.useState([]) 
  console.log(album)

 useEffect(() => {
  var authParameters = {
    method: "POST", 
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }, 
    body: 'grant_type=client_credentials&client_id='+ CLIENT_ID + '&client_secret='+ CLIENT_SECRET
  }
 
  fetch('https://accounts.spotify.com/api/token', authParameters) 
  .then((result) => result.json())
  .then(data => setAccessToken(data.access_token))
 }, [])



 const Search = async() =>  {

  var artistParameters = {
    method: "GET", 
    headers: {
      'Content-Type': 'application/json',
      'Authorization': "Bearer "+ accessToken
    }
  }
 

  var artistId = await fetch('https://api.spotify.com/v1/search?q='+ searchInput + '&type=artist'  , artistParameters)
  .then((res) => res.json()) 
  .then((response) => {return response.artists.items[0].id})  

  var returnedAlbum = await fetch('https://api.spotify.com/v1/artists/'+ artistId + '/albums' + '?includes_groups=album&market=US&limit=50', artistParameters)
  .then((res) => res.json())  
  .then(res => setAlbum(res.items))
 }
 


  return (
    <Container>
    <InputGroup className="mt-3" size='lg'>
    <FormControl 
    placeholder="search artist" 
    onKeyPress={(e) => {
      if(e.key === "Enter") {
       Search()
      }
    }} 
    onChange={(e) => setSearchInput(e.target.value)} 
    />
    <Button onClick={Search}>Search</Button>
    </InputGroup> 
   
   <br/> 
   <br/>
    <div className="music">
     {album.map((item) => {
      return (
        <a key={item.id} href={item.external_urls.spotify} style={{margin: 12,cursor: 'pointer', textDecoration: 'none'}}> 
        <img src={item.images[1].url} className="image"/> 
        <div className="musicContainer"> 
        <h6>{item.name.slice(0, 15)}</h6> 
         <h6>{item.release_date}</h6>
        </div>
        </a>
      )
     })}
    </div>
    
    </Container>
  )
}

export default App