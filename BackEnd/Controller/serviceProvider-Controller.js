const router = require('express').Router();
let ServiceProvider = require('../modles/service-provider');
const Payment = require('../modles/payment');
const Employee = require('../modles/Customer');
const uploadModel = require('../modles/uploadModel');

// Route for adding a new Service Provider
const newServiceProvider = async (req, res) => {
  var photo = '';

  if (req.file) {
    photo = req.file.filename;
  } else {
    photo = 'default.jpeg';
  }

  const companyName = req.body.companyName;
  const serviceType = req.body.serviceType;
  const location = req.body.location;
  const contactNumber = req.body.contactNumber;

  const newServiceProviderData = new ServiceProvider({
    companyName,
    serviceType,
    location,
    contactNumber,
    photo,
  });

  newServiceProviderData
    .save()
    .then(() => {
      res.json('New Service Provider Added');
    })

    .catch(err => {
      console.log(err);
    });
};

// Route for getting all the service providers
const viewServiceProvider = async (req, res) => {
  ServiceProvider.find()
    .then(serviceProviders => {
      res.status(200).json(serviceProviders);
    })
    .catch(err => {
      console.log(err);
    });
};

// Route for updating a service provider
const updateServiceProvider = async (req, res) => {
  let serviceProviderId = req.params.id;
  const { companyName, serviceType, location, contactNumber } = req.body;

  const updateServiceProvider = {
    companyName,
    serviceType,
    location,
    contactNumber,
  };

  const update = await ServiceProvider.findByIdAndUpdate(
    serviceProviderId,
    updateServiceProvider
  )
    .then(() => {
      res.status(200).send({ status: 'Service Provider Updated' });
    })
    .catch(error => {
      res
        .status(500)
        .send({ status: 'Error with updating data', error: error.message });
    });
};

// Route for deleting a service provider
const deleteServiceProvider = async (req, res) => {
  const serviceProviderId = req.params.id;

  await ServiceProvider.findByIdAndRemove(serviceProviderId)
    .then(() => {
      res.status(200).send({ status: 'Service Provide deleted' });
    })
    .catch(error => {
      res.status(500).send({
        status: 'Error with deleting service provider',
        error: error.message,
      });
    });
};

//Route for getting a specific service provider
const viewSingleProvider = async (req, res) => {
  const serviceProviderId = req.params.id;

  await ServiceProvider.findById(serviceProviderId)
    .then(serviceProvider => {
      res.status(200).send({
        status: 'Service Provider fetched',
        serviceProvider: serviceProvider,
      });
    })
    .catch(error => {
      res.status(500).send({
        status: 'Error with getting service provider',
        error: error.message,
      });
    });
};

const getServiceProviderNames = async (req, res) => {
  try {
    const serviceProviderList = await ServiceProvider.find(
      {},
      { companyName: 1 }
    );

    res.status(200).json(serviceProviderList);
  } catch (error) {
    res.status(500).send({
      status: 'Error with getting service provider',
      error: error.message,
    });
  }
};

const getCommissionByCategory = async (req, res) => {
  const targetMonth = +req.query.month + 1;
  const targetYear = +req.query.year;

  await Payment.aggregate([
    {
      $addFields: {
        payee: {
          $convert: {
            input: '$payeeId',
            to: 'objectId',
            onError: '',
            onNull: '',
          },
        },
      },
    },
    {
      $lookup: {
        from: 'service-providers',
        localField: 'payee',
        foreignField: '_id',
        as: 'services',
      },
    },
    {
      $match: {
        $expr: {
          $and: 
            [
           {$eq: [{ $month: '$createdAt' }, targetMonth]},
            {$eq: [{ $year: '$createdAt'}, targetYear]}]
        },
      },
    },
    {
      $group: {
        _id: '$services.serviceType',
        total: {
          $sum: '$amount',
        },
      },
    },
  ]).exec((err, data) => {
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(400).json({ err: err });
    }
  });
};

const getServicePayment = async (req, res) => {
  const targetYear = +req.params.year;
  const monthWords = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  await Payment.aggregate([
    {
      $match: { category: 'Services Chargers', 
      $expr: {
        $eq: [{ $year: '$createdAt' }, targetYear],
      },},
     
    },
    {
      $group: {
        _id: { month: { $month: '$createdAt' } },
        total: { $sum: '$amount' },
      },
    },
  ]).exec((err, data) => {
    if (data) {
      data.sort((a, b) => a._id.month - b._id.month);

      const updatedData = data.map(item => {
        item._id.month = monthWords[item._id.month - 1];
        return { ...item };
      });
      res.status(200).json(updatedData);
    } else {
      res.status(400).json({ err: err });
    }
  });
};

const getManagerStatistics = async (req, res) => {
  var spCount = 0;
  var commissionGained = 0;


  await ServiceProvider.aggregate([
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
      },
    },
  ]).exec((err, data) => {
    if (data) {
      spCount = data[0].count;
    } else {
      res.status(404).json({ err: err });
    }
  });

  await Payment.aggregate([
    {
      $match: { category: 'Services Chargers' },
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: { $multiply: ['$amount', 0.1] },
        },
      },
    },
  ]).exec((err, data) => {
    if (data) {
      commissionGained = data[0].total;

      
      const stat = {
        spCount: spCount,
        commissionGained: commissionGained,
      };

      res.status(200).json(stat);

    } else {
      res.status(404).json({ err: err });
    }
  });

};

const getEmployeeStatistics = async (req, res) => {
  var employeeCount = 0;
  var salaryPaid = 0;

  await Employee.aggregate([
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
      },
    },
  ]).exec((err, data) => {
    if (data) {
      employeeCount = data[0].count;
    } else {
      res.status(404).json({ err: err });
    }
  });


  await Employee.aggregate([
    {
      $group: {
        _id: null,
        total: {
          $sum: '$basicSalary'
        },
      },
    },
  ]).exec((err, data) => {
    if (data) {
      console.log(data);
      salaryPaid = data[0].total;

      const stat = {
        employeeCount: employeeCount,
        salaryPaid: salaryPaid,
      };

      res.status(200).json(stat);
    } else {
      res.status(404).json({ err: err });
    }
  });
};



module.exports = {
  newServiceProvider,
  viewServiceProvider,
  updateServiceProvider,
  deleteServiceProvider,
  viewSingleProvider,
  getServiceProviderNames,
  getCommissionByCategory,
  getServicePayment,
  getManagerStatistics,
  getEmployeeStatistics
};
