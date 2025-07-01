import companyModel from '../models/Company.model.js'

export const submitEmail = async (email,otp,expireOtp) => {
  //    const existingCompany = await companyModel.findOne({ email });

  // if (existingCompany) {
  //   existingCompany.resetOTP = otp;
  //   existingCompany.otpExpiry = expireOtp;
  //   existingCompany.isVerified = 'red'; 
  //   await existingCompany.save();
  //   return existingCompany;
  // }


    const company = await companyModel.create({
        email,
        resetOTP: otp,
        otpExpiry: expireOtp
    })
    return company
}


export const createCompanyService = async (data) => {
  const {
    companyName,
    registrationNumber,
    password,
    registrationDate,
    gstNumber,
    panNumber,
    address,
    phone,
    website,
    email,
  } = data;

  const company = await companyModel.findOne({ email });

  company.companyName = companyName;
  company.registrationNumber = registrationNumber;
  company.password = await companyModel.hashPassword(password);
  company.registrationDate = registrationDate;
  company.gstNumber = gstNumber;
  company.panNumber = panNumber;
  company.address = address;
  company.phone = phone;
  company.website = website;
  company.registrationComplete = true;

  await company.save();
};
