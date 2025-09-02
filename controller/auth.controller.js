const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../utils/sendEmail");
const Customer = require("../models/customer");

exports.registerCustomer = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ where: { email } });
    if (existingCustomer) {
      return res.status(400).json({ message: "Customer already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new customer
    const newCustomer = await Customer.create({
      name,
      email,
      phone,
      password: hashedPassword,
      isVerified: false,
    });

    // Generate verification token
    const verificationToken = jwt.sign(
      { id: newCustomer.id, email: newCustomer.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );


    // Send verification email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: newCustomer.email,
      subject: "Verify your account",
      text: ` text: Hello ${newCustomer.name}, 
        Please verify your account by clicking the link below:

        http://localhost:3000/api/auth/verify/${verificationToken}

        If you did not create this account, please ignore this email.

        Thanks,  
        The Banking App Team `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: "Customer registered successfully. Please verify your account.",
      customer: {
        id: newCustomer.id,
        name: newCustomer.name,
        email: newCustomer.email,
        isVerified: newCustomer.isVerified,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find customer by email
    const customer = await Customer.findOne({ where: { email } });
    if (!customer) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if customer is verified
    if (!customer.isVerified) {
      return res
        .status(403)
        .json({ message: "Please verify your account before logging in" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: customer.id, email: customer.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        isVerified: customer.isVerified,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.verifyCustomer = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const customer = await Customer.findByPk(decoded.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    if (customer.isVerified) {
      return res.status(400).json({ message: "Account already verified" });
    }

    customer.isVerified = true;
    await customer.save();

    res.status(200).json({ message: "Customer verified successfully", customer });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Invalid or expired verification link" });
  }
};
