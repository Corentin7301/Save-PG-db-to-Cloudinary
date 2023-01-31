const {
    exec
} = require("child_process");
const schedule = require('node-schedule');
const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const env = require("dotenv").config();

console.log("Save script started at " + new Date().toLocaleString());

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const rule = new schedule.RecurrenceRule();
rule.hour = process.env.SCHEDULE_HOUR;
rule.minute = process.env.SCHEDULE_MINUTE;

const db_name = process.env.DB_NAME;
const db_user = process.env.DB_USER;
const db_password = process.env.DB_PASSWORD;
const db_port = process.env.DB_PORT;
const db_host = process.env.DB_HOST;

schedule.scheduleJob(rule, function () {
    const file_name = `garage_a_shape_${db_name}_${getCurrentDateTime()}.dump`;
    const file_path = path.resolve(__dirname, file_name);
    const cmd = `PGPASSWORD=${db_password} pg_dump -F t -h ${db_host} -p ${db_port} -U ${db_user} -F t ${db_name} -f ${file_path} --format=custom`;

    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }

        console.log('Sending file to cloudinary...');
        

        cloudinary.uploader.upload(file_path, {
            resource_type: "auto",
            folder: process.env.CLOUDINARY_FOLDER,
            public_id: file_name
        }, function (
            error,
            result
        ) {
            if (error) {
                console.error(error);
                return;
            }

            console.log('Success! File name is: ',result.public_id);
            console.log('File url is: ',result.secure_url);
            console.log('File size is: ',result.bytes);
            console.log('Well I go back to sleep... ^^')
            
            fs.unlinkSync(file_path);
        });
    });
});

function getCurrentDateTime() {
    const date = new Date();
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    const hours = `0${date.getHours()}`.slice(-2);
    const minutes = `0${date.getMinutes()}`.slice(-2);
    return `${year}_${month}_${day}_${hours}:${minutes}`;
  }
  