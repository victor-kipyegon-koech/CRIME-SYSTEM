import nodemailer from "nodemailer"

//Create a test account for transporter
const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure:false,
    auth:{
        user: 'hector.klocko@ethereal.email',
        pass: '7kN2reymVUHDBFts8m'
    }
});

// //callback fn

// transporter.verify((success,error)=>{
//     if(error){
//         console.log(error)
//     }else{
//         console.log('Server is ready to take our messages')
//     }
// })


(async ()=>{
    const info = await transporter.sendMail({
        from: '"Hector Klocko"  <hector.klocko@ethereal.email>',
        to: "wachira.denis@teach2give.com",
        subject: "Hello ✔",
        text: "Hello World",
        html: "<b>Hello World</b>"
    });

    console.log("Message sent:", info.messageId)
})()