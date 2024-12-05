const express = require('express')
const recordRoutes = express.Router()
const dbo = require('../db/conn')
const hasher  = require('crypto');
 
/////////////////////////////
//                         //
//      Assignment 4       //
//                         //
/////////////////////////////

// This section will help you create a new record. ******************************

//Add logic 
recordRoutes.route("/record/create").post(async (req, res) => {
    try{
 let db_connect = dbo.getDb();

 let accountNum = 1000 //Starting account num
 let flag = false;
 const {password} = req.body;

 const hashPassword = hasher.createHash('sha256').update(password).digest('hex'); //collect the password from the body and hash it

 let myobj = {
   username: req.body.username,
   password: hashPassword, //Setting the password as the hashPassword now
   role: req.body.role,
   checkings: 0,
   savings: 0,
   investments: 0,
   accountID: accountNum,
   transactionHistory: []
 };


 console.log("----Begin Body Grab----")
 console.log(req.body.username)
 console.log(req.body.role)
 console.log("----end of body grab----")


 let myquery = { username: req.body.username}; //search for username from body
 const account = await db_connect.collection("accounts").findOne(myquery); 


 if(account != null){
    return await res.status(400).json({ message: "Username already exists" })
 } 

 else{

  while (!flag) {

    let accountIDQuery = { accountID: accountNum };
    const accountIdCheck = await db_connect.collection("accounts").findOne(accountIDQuery);

    if (accountIdCheck) {
        accountNum += 1;
        console.log(accountNum);
    } else {
        flag = true;
        myobj.accountID = accountNum;
        console.log("Added new accountID")
        break;
    }
}

    const result = await db_connect.collection("accounts").insertOne(myobj); //otherwise it inserts into db
    console.log(" ------- inside create -------------")
    console.log("username added to database")
    let myquery = { username: req.body.username, password: req.body.password}; 
    const account = await db_connect.collection("records").findOne( myquery ); 
    console.log("-------------End of Create------------------")
    res.send(account); //send account back to account Summary Page
  
 }
    } catch(err) {
        throw err;
    }
});

//This section will sorta perform a login message **************************************
recordRoutes.route("/record/login").post(async (req, res) => {
  try{

    let db_connect = dbo.getDb();
    req.session.username = null
    req.session.role = null

    const {password} = req.body; //Collect the password from the screen
    console.log("Password provided: " + password)
    const hashedPassword = hasher.createHash('sha256').update(password).digest('hex'); //hash the collected password
    console.log("Hashed Password: " + hashedPassword)
    let myquery = { username: req.body.username}; 
    const account = await db_connect.collection("accounts").findOne( myquery ); 

 if( account === null) { //if the password isnt the same
  console.log("unsuccessfully logged in")
  return res.status(200).send({ message: 'Invalid username or password' });
 }

 else if(account.password !== hashedPassword || account.password === null){
  console.log("unsuccessfully logged in")
  return res.status(200).send({ message: 'Invalid username or password' });
 }

 if(account.password === hashedPassword){ //if its not empty ie if it exists
   console.log("successfully logged in")
   console.log(account.username, " ", account.role)
   req.session.accountID = account.accountID //create an accountID session
   req.session.username = account.username
   req.session.role = account.role; //Create the session based on the role!
   console.log("session Role is set too: " + req.session.role)
   console.log("End of Login")
   res.send(account); //send account back to account Summary Page
 } else {
   console.log("unsuccessfully logged in")
   res.status(200).json({ message: "Not authenticated" });

 }
    } catch(err) {
      res.status(200).json({ message: "unsuccessfully logged in" })
        throw err;
    }
});

// Check authentication
recordRoutes.route("/record/auth-check").get((req, res) => {
  console.log("Entered the auth-check route")
  if (req.session && req.session.username) {
    console.log("Role is set too: " + req.session.role)
    console.log("Username is set too: " + req.session.username)
    res.json({ role: req.session.role });
    console.log("End of auth-check route")
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});



recordRoutes.route("/record/logout").post(async (req, res) => {
   try{
    console.log("logged out")
      req.session.destroy()
      res.send({message: "logged out"})
   } catch(err) {
     res.status(200).json({ message: "unsuccessfully logged out" })
       throw err;
   }
});

//This section will serve as the logic for the backend accountSummary **************************************
recordRoutes.route("/record/accountSummary").get(async (req, res) => {
   try{
    console.log("--- Inside account Summary ---")
      let db_connect = dbo.getDb();
    if(!req.session.username){
      return res.status(201).send({ message: 'Session Not Set!!' })
      }
  console.log("session for Username was found")
  const user = await db_connect.collection("accounts").findOne( {accountID: (req.session.accountID)}); 
  res.send(user);

   } catch(err) {
       throw err;
   }
});

// Handles deposits and withdrawals on the employeeSummary page
recordRoutes.route("/record/employeeSummary").post(async (req, res) => {
  const { accountID, transactionType, accountType, amount } = req.body;
  const db_connect = dbo.getDb();
  const parsedAccountID = Number(accountID);
  const parsedAmount = parseFloat(amount);


  try {
    const account = await db_connect.collection("accounts").findOne({ accountID: parsedAccountID });

    // Log the request details
    console.log("Received transaction request:");
    console.log("Selected accountID:", parsedAccountID);
    console.log("Transaction Type:", transactionType);
    console.log("Account Type:", accountType);
    console.log("Amount:", parsedAmount);

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    let updateResult;

    if (transactionType === "deposit") {
      const increaseValue = parsedAmount;

      if (accountType === "savings") {
        updateResult = await db_connect.collection("accounts").updateOne(
          { accountID: parsedAccountID },
          { $inc: { savings: increaseValue } }
        );
      } else if (accountType === "checkings") {
        updateResult = await db_connect.collection("accounts").updateOne(
          { accountID: parsedAccountID },
          { $inc: { checkings: increaseValue } }
        );
      } else if (accountType === "investments") {
        updateResult = await db_connect.collection("accounts").updateOne(
          { accountID: parsedAccountID },
          { $inc: { investments: increaseValue } }
        );
      }

    } else if (transactionType === "withdraw") {
      const decreaseValue = -parsedAmount; 
      if (accountType === "savings") {
        if (account.savings >= parsedAmount) {
          updateResult = await db_connect.collection("accounts").updateOne(
            { accountID: parsedAccountID },
            { $inc: { savings: decreaseValue } }
          );
        } else {
          return res.status(400).send({ message: 'Insufficient funds in savings' });
        }
      } 
      if (accountType === "checkings") {
        if (account.checkings >= parsedAmount) {
          updateResult = await db_connect.collection("accounts").updateOne(
            { accountID: parsedAccountID },
            { $inc: { checkings: decreaseValue } }
          );
        } else {
          return res.status(400).send({ message: 'Insufficient funds in checkings' });
        }
      } else if (accountType === "investments") {
        if (account.investments >= parsedAmount) {
          updateResult = await db_connect.collection("accounts").updateOne(
            { accountID: parsedAccountID },
            { $inc: { investments: decreaseValue } }
          );
        } else {
          return res.status(400).send({ message: 'Insufficient funds in investments' });
        }
      }
    } else {
      return res.status(400).send({ message: 'Invalid transaction type' });
    }

    // Log the transaction in the account's transaction history
    await db_connect.collection("accounts").updateOne(
      { accountID: parsedAccountID },
      {
        $push: {
          transactionHistory: {
            type: transactionType,
            account: accountType,
            amount: parsedAmount,
            timestamp: new Date().toISOString()
          }
        }
      }
    );

    res.status(200).json({ message: "Transaction logged successfully" });
  } catch (err) {
    console.log("Transaction error:", err);
    res.status(500).json({ message: "Transaction Error" });
  }
});

recordRoutes.route("/record/transfer").post(async (req, res) => {
  const { fromAccountID, fromAccountType, toAccountID, toAccountType, transferAmount } = req.body;
  const db_connect = dbo.getDb();
  const parsedToAccountID = Number(toAccountID); // Ensure accountID is a number
  const parsedFromAccountID = Number(fromAccountID); // Ensure accountID is a number
  const parsedAmount = Number(transferAmount);

  try {
    console.log("Inside transfer");

    const fromAccount = await db_connect.collection("accounts").findOne({ accountID: parsedFromAccountID });
    const toAccount = await db_connect.collection("accounts").findOne({ accountID: parsedToAccountID });

    // Check if both accounts exist
    if (!fromAccount || !toAccount) {
      console.log("Account not found");
      return res.status(404).json({ message: "Account not found" });
    }

    // Check if enough money is in the source account
    if (fromAccount[fromAccountType] < parsedAmount) {
      console.log("Not enough in source account");
      return res.status(400).json({ message: "Not enough in source account" });
    }

    // Update account balances
    await db_connect.collection("accounts").updateOne(
      { accountID: parsedFromAccountID },
      { $inc: { [fromAccountType]: -parsedAmount } }
    );
    await db_connect.collection("accounts").updateOne(
      { accountID: parsedToAccountID },
      { $inc: { [toAccountType]: parsedAmount } }
    );

    // Log transactions
    await db_connect.collection("accounts").updateOne(
      { accountID: parsedFromAccountID },
      {
        $push: {
          transactionHistory: {
            type: 'withdraw',
            account: fromAccountType,
            amount: parsedAmount,
            timestamp: new Date().toISOString()
          }
        }
      }
    );

    await db_connect.collection("accounts").updateOne(
      { accountID: parsedToAccountID },
      {
        $push: {
          transactionHistory: {
            type: 'deposit',
            account: toAccountType,
            amount: parsedAmount,
            timestamp: new Date().toISOString()
          }
        }
      }
    );

    res.status(200).json({ message: "Transfer successful" });
  } catch (err) {
    console.log("Transfer error:", err);
    res.status(500).json({ message: "Transfer Error" });
  }
});
recordRoutes.route("/record/transactionHistory").get(async (req, res) => {
  try {
    let db_connect = dbo.getDb();
    const transactionHistory = await db_connect.collection("accounts").findOne( {username: (req.session.username)}); 
    res.json(transactionHistory);
  } catch (error) {
    console.error('Failed to fetch transaction history:', error);
    res.status(500).send('Internal Server Error');
  }
});

recordRoutes.route("/record/bankingSummary").post(async (req, res) => {
  const { transactionType, amount, account } = req.body;

  try {
    let db_connect = dbo.getDb();
    console.log("--- Inside of Banking Summary ---");

    if (!req.session.accountID) {
      return res.status(401).send({ message: 'Session Not Set!' });
    }
    console.log("Session ID is set: " + req.session.accountID);

    const databaseAccount = await db_connect.collection("accounts").findOne({ accountID: req.session.accountID });

    if (!databaseAccount) {
      console.log("Account was not found");
      return res.status(404).send({ message: 'User not found in database' });
    }

    let updateResult;

    if (transactionType === "deposit") {
      const increaseValue = Number(amount);

      if (account === "savings") {
        updateResult = await db_connect.collection("accounts").updateOne(
          { accountID: req.session.accountID },
          { $inc: { savings: increaseValue } }
        );
      } else if (account === "checkings") {
        updateResult = await db_connect.collection("accounts").updateOne(
          { accountID: req.session.accountID },
          { $inc: { checkings: increaseValue } }
        );
      } else if (account === "investments") {
        updateResult = await db_connect.collection("accounts").updateOne(
          { accountID: req.session.accountID },
          { $inc: { investments: increaseValue } }
        );
      }

    } else if (transactionType === "withdraw") {
      let decreaseValue = Number(amount);

      if (account === "savings") {
        if (databaseAccount.savings >= decreaseValue) {
          updateResult = await db_connect.collection("accounts").updateOne(
            { accountID: req.session.accountID },
            { $set: { savings: databaseAccount.savings - decreaseValue } }
          );
        } else {
          return res.status(400).send({ message: 'Insufficient funds in savings' });
        }
      } else if (account === "checkings") {
        if (databaseAccount.checkings >= decreaseValue) {
          updateResult = await db_connect.collection("accounts").updateOne(
            { accountID: req.session.accountID },
            { $set: { checkings: databaseAccount.checkings - decreaseValue } }
          );
        } else {
          return res.status(400).send({ message: 'Insufficient funds in checkings' });
        }
      } else if (account === "investments") {
        if (databaseAccount.investments >= decreaseValue) {
          updateResult = await db_connect.collection("accounts").updateOne(
            { accountID: req.session.accountID },
            { $set: { investments: databaseAccount.investments - decreaseValue } }
          );
        } else {
          return res.status(400).send({ message: 'Insufficient funds in investments' });
        }
      }
    } else {
      return res.status(400).send({ message: 'Invalid transaction type' });
    }

    // Log the transaction
    const logTransaction = await db_connect.collection("accounts").updateOne(
      { accountID: req.session.accountID },
      {
        $push: {
          transactionHistory: {
            type: transactionType,
            account: account,
            amount: amount,
            timestamp: new Date().toISOString()
          }
        }
      }
    );

    console.log("--- Transaction logged ---");
    res.status(200).send(updateResult);

  } catch (err) {
    console.error("The Try Failed", err);
    res.status(500).send({ error: 'Server error' });
  }
});


//This section will display a userlist  ************************
recordRoutes.route("/record/allAccounts").get(async (req, res) => {
    try{
      console.log("Listing specific items");
      let db_connect = dbo.getDb("accounts");
      const result =  await db_connect.collection("accounts").find({}).project({accountID:1, username:1, role:1, checkings:1, savings:1}).toArray();
      res.json(result);
      console.log(result)
    } catch(err) {
        console.log("Error fetching accounts");
        throw err;
    }
});



//This section will display a userlist  ************************
recordRoutes.route("/record/changeRole/:selectedAccountID").put(async (req, res) => {
  try {
    console.log("Entered Change Role");
    console.log("New Role Wanted: " + req.body.role);
    console.log("Selected User ID: " + req.params.selectedAccountID);
    const selectedID = parseInt(req.params.selectedAccountID);
    let db_connect = dbo.getDb("accounts");
    
    let myquery = { accountID: selectedID }; 
    const account = await db_connect.collection("accounts").findOne( myquery ); 
    if(account){
      console.log("Found account!")
      const updateResult = await db_connect.collection("accounts").updateOne(
        { accountID: selectedID },
        { $set: { role: req.body.role } }
        );
        res.status(200).json({ message: 'Role updated successfully.' });
       } else {
        console.log("Didnt work")
        res.status(404).json({ message: 'Unable to update role - Backend.' });
       }
   } catch(err) {
      console.log("Error fetching accounts");
      throw err;
  }
});



 
module.exports = recordRoutes;