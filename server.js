require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());


function alternatingCaps(str) {
  let result = '';
  let upper = true;
  for (let char of str) {
    if (/[a-zA-Z]/.test(char)) {
      result += upper ? char.toUpperCase() : char.toLowerCase();
      upper = !upper;
    } else {
      result += char;
    }
  }
  return result;
}


app.get("/", (req, res) => {
  res.send("BFHL API is live 🚀. Use POST /bfhl to test the API.");
});


app.post("/bfhl", (req, res) => {
  try {
    const data = req.body.data;
    if (!Array.isArray(data)) throw new Error("Data must be an array");

    let odd_numbers = [];
    let even_numbers = [];
    let alphabets = [];
    let special_characters = [];
    let sum = 0;
    let concat_string = "";

    for (let item of data) {
      let strItem = String(item);
      if (/^\d+$/.test(strItem)) { 
        let num = parseInt(strItem);
        sum += num;
        if (num % 2 === 0) even_numbers.push(strItem);
        else odd_numbers.push(strItem);
      } else if (/^[a-zA-Z]+$/.test(strItem)) { 
        alphabets.push(strItem.toUpperCase());
      } else { 
        special_characters.push(strItem);
      }
    }

    // concat all alphabets in reverse order, alternating caps
    let allAlphabets = data
      .filter(i => /^[a-zA-Z]+$/.test(String(i)))
      .reverse()
      .join('');
    concat_string = alternatingCaps(allAlphabets);

    const response = {
      is_success: true,
      user_id: `${process.env.FULL_NAME}_${process.env.DOB}`,
      email: process.env.EMAIL,
      roll_number: process.env.ROLL_NUMBER,
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum: String(sum),
      concat_string
    };

    res.status(200).json(response);

  } catch (err) {
    res.status(400).json({ is_success: false, message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
