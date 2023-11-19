const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require ('jsonwebtoken')

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/your-database-name', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})


const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
})

const User = mongoose.model('User', userSchema);

//update user registration route

app.post('/register', async (req, res) => {
  const {username, password} = req.body
})


try {
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({message: 'Usuario ja existe'})
  }

  //hash the password
  const hashedPassoword = await bcrypt.hash(password, 10)

  //create a new user 
  const newUser = new User({ username, password: hashedPassoword })
  
  //save the user to the database
  await newUser.save();

  res.json({message: 'cadastro feito com sucesso'})

} catch (error) {
  console.error('Falha no cadastro:', error.message);
  res.status(500).json({message: 'internal server error' })
}



app.use(bodyParser.json())
app.use(cors())


// //login
// app.post('/login', (req, res) => {
//   const { email, password } = req.body;
//   res.json({ success: true, message: "login feito com sucesso" })
// });

// //subscribe
// app.post('/subscribe', (req, res) => {
//   const { email, password } = req.body
//   res.json({ success: true, message: "cadastro realizado com sucesso" })
// });

app.listen(PORT, () => {
  console.log(`servidor rodando on http://localhost:${port}`);
})