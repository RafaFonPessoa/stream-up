const url = "http://localhost:4000/pictures"
const newUser = 
    {
        "_id": "5325123152312351235",
        "name": "imagem5",
        "src": "uploads\\1686704716305.jpeg",
        "__v": 0
    }


function getUser() {
  axios.get(url)
  .then(response => {
    const data = response.data
    renderResults.textContent = JSON.stringify(data)
  })
  .catch(error => console.log(error))
}
getUser()

function addNewUseR() {
    axios.post(url, newUser)
    .then(response => {
        console.log(response.data)
    })
    .catch(error=> console.log(error))
}

addNewUseR()