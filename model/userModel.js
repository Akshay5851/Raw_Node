const users = [
    { id: 1, name: 'Product A', description: 'Description of Product A', price: 100 },
    { id: 2, name: 'Product B', description: 'Description of Product B', price: 200 },
    { id: 3, name: 'Product C', description: 'Description of Product C', price: 300 },
  ];

class userModel{

    static getalluser(){
        return users;
    }

    static getuserById(id){
        return users.find( user=> user.id===id)
    }
}

module.exports=userModel;