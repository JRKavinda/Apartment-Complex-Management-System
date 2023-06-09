const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Customer = require('../modles/Customer');
const UserService = require('../service/customer-service');

const newSignUp = async (req, res) => {
  const name = req.body.name;
  const apartmentNo = req.body.apartmentNo;
  const nicNo = req.body.nicNo;
  const phoneNo = Number(req.body.phoneNo);
  const email = req.body.email;
  const password = req.body.password;
  const photo = (req.file)?req.file.filename:null;

  const existingUser = await UserService.findUserByApartmentNo(apartmentNo);

  if (existingUser) {
    return res.status(400).send({
      err: 'User already Exits',
    });
  }

  const hash = await bcrypt.hash(password, 10);

  const newCustomer = new Customer({
    name,
    apartmentNo,
    nicNo,
    phoneNo,
    email,
    password: hash,
    photo
  });

  newCustomer
    .save()
    .then(() => {
      res.status(200).json('Customer Added');
    })
    .catch(err => {
      console.log(err);
    });
};

const login = async (req, res, session) => {
  try {
    const { apartmentNo, password } = req.body;
    const LoggedUser = await UserService.login(apartmentNo, password);

    res.status(200).send(LoggedUser);
  } catch (err) {
    res.status(400).send({ err: err.message });
  }
};

const viewCustomer = async (req, res) => {
  let id = req.params.id;
  
  Customer.findById(id, (err, customerModle) => {
    if (err) {
      return res.status(400).json({ success: false, err });
    }

    return res.status(200).json({
      success: true,
      customerModle,
    });
  });
};

const viewProfileById = async (req, res) => {
  const curntUser = req.user;
 
  try {
    if (!curntUser) {
      return res.status(400).send({ err: 'User Not Logged In' });
    }

    const userDoc = await Customer.findById(curntUser.id)
    
    const user = userDoc?.toJSON();

    delete user?.password;
    res.status(200).json(user);
  } catch (err) {
    res.status(400).send({ err: err });
  }
};

const updateProfileById = async (req, res) => {
  let userID = req.params.id;

  //Dstructure
  const { name, apartmentNo, nicNo, phoneNo, email} = req.body;

  const updateCustomer = {
    name,
    apartmentNo,
    nicNo,
    phoneNo,
    email,
    
  };

  //Search the that id is available or not
  const update = await Customer.findByIdAndUpdate(userID,{name: name,apartmentNo: apartmentNo,nicNo: nicNo,phoneNo: phoneNo,email: email})
    
    .then(customer => {
   
      //status = 200 = updated
      res.status(200).send({ status: 'User Updated', user: customer });
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .send({ status: 'Error with updating data', error: err.message });
    });
};


const viewProfiles = async (req, res) => {
  Customer.find()
    .then(customers => {
      res.json(customers);
    })
    .catch(err => {
      console.log(err);
    });

  
};

const resetPassword = async (req, res) => {
  try {
    const { email } = req.params;
    const {password} = req.body;

    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(404).send({ error: 'Customer not found' });
    }

    const hash = await bcrypt.hash(password, 10);

    await Customer.updateOne({ email: customer.email }, { password: hash });

    return res.status(200).send({ msg: 'Record updated' });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: 'Internal server error' });
  }
};


const upload = async (req,res) =>{

  let userID = req.params.id;

  //Dstructure
  const  photo = req.file.filename;
  console.log(photo)
  //Search the that id is available or not
  
  const update = await Customer.updateOne({_id: userID},{$set:{photo: photo}})
    
    .then(customer => {
   
      //status = 200 = updated
      res.status(200).send({ status: 'User Updated', user: customer });
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .send({ status: 'Error with updating data', error: err.message });
    });
}

const deleteProfilePic = async (req, res) => {
  

  try {
    let userID = req.params.id;
    // Find the customer by their ID
    const customer = await Customer.findById({_id: userID});

    // Delete the photo field in the customer document
    customer.photo = null;
    await customer.save();

    return res.status(200).send({ status: 'Profile photo deleted successfully' });
  } catch (error) {
    console.error('Error deleting profile photo:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};




module.exports = {
  newSignUp,
  login,
  viewProfileById,
  updateProfileById,
  deleteProfilePic,
  viewProfiles,
  resetPassword,
  viewCustomer,
  upload,
};
