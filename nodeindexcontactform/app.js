const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

// View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render("contact", {
  layout: false,
  name: req.body.name,
  quote: req.body.quote
  });
})

app.post('/send', (req, res) => {
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Name:${req.body.fname}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone:${req.body.phone}</li>
      <li>Pincode:${req.body.pincode}</li>
      <li>Country:${req.body.country}</li>
      <li>Budget in Rs.:${req.body.budget}</li>
      <li>Service Required:${req.body.service}</li>
    </ul>
    
  `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'mail.caramelit.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'krishnamurthy.p@caramelit.com', // generated ethereal user
        pass: 'Caramelit@123$'  // generated ethereal password
    },
    tls:{
      rejectUnauthorized:false
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
      from: ' <krishnamurthy.p@caramelit.com>', // sender address
      to: 'raghu.m@caramelit.com',// list of receivers
      subject: 'Contact from the Caramel IT Services', // Subject line
      text: 'Hello world?', // plain text body
      html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render('contact', {msg:'Email has been sent'});
  });
  });

app.listen(5000, () => console.log('Express Server started...at Port 5000, check browser...'));